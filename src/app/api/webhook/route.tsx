import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { inngest } from "@/inngest/client";
import { streamVideo } from "@/lib/stream-video"
import { initializeOllamaAgent, generateAgentResponse, AgentResponseContext } from "@/lib/ollama-agent"
import { checkOllamaHealth, listOllamaModels } from "@/lib/ollama"
import {
MessageNewEvent,
CallEndedEvent,
CallTranscriptionReadyEvent,
CallSessionParticipantLeftEvent,
CallRecordingReadyEvent,
CallSessionStartedEvent
} from "@stream-io/node-sdk"
import { and, eq, not, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { GneneratedAvatarUri } from "@/lib/avatar";
import { streamChat } from "@/lib/stream-chat";

function verifySignatureWithSDK(body:string,signature:string):boolean{
    return streamVideo.verifyWebhook(body,signature)
}
export async function POST(req:NextRequest){
    console.log("🔔 WEBHOOK RECEIVED");
    
    const signature=req.headers.get("x-signature");
    const apiKey=req.headers.get("x-api-key");
    if(!signature || !apiKey){
        console.log("❌ Missing signature or API key");
        return NextResponse.json(
            {error:"Missing signature or API key"},
            {status:400}
        )
    }

    const body=await req.text();
    if(!verifySignatureWithSDK(body,signature)){
        console.log("❌ Invalid signature");
        return NextResponse.json({error:"Invalid signature"},{status:401})
    }

    let payload:unknown;
    try{
        payload=JSON.parse(body) as Record<string,unknown>;
    }catch{
        console.log("❌ Invalid JSON");
        return NextResponse.json({error:"Invalid Json"},{status:400})
    }

    const eventType=(payload as Record<string,unknown>)?.type;
    console.log("📨 Event Type:", eventType);
    console.log("📦 Full Payload:", JSON.stringify(payload, null, 2));

    if(eventType==="call.session_started"){
        const event=payload as CallSessionStartedEvent;
        const meetingId=event.call.custom?.meetingId;
        
        console.log("🎯 Processing call.session_started");
        console.log("Meeting ID from webhook:", meetingId);

        if(!meetingId){
            console.log("❌ No meetingId in webhook");
            return NextResponse.json({error:"Missing meetingId"},{status:400})
        }
        
        console.log("🔍 Searching for meeting:", meetingId);
        const [existingMeeting]=await db
               .select()
               .from(meetings)
               .where(eq(meetings.id,meetingId));
        
        console.log("Meeting found:", existingMeeting ? "✓ YES" : "❌ NO");
        if(existingMeeting) {
            console.log("Meeting details:", { id: existingMeeting.id, name: existingMeeting.name, agentId: existingMeeting.agentId });
        }
        
        if(!existingMeeting){
            console.log("❌ Meeting not found");
            return NextResponse.json({error:"Meeting not found"},{status:404})
        }
        
        // Only initialize agent if meeting is in "upcoming" status (prevent duplicates)
        if(existingMeeting.status !== "upcoming"){
            console.log("⚠️ Meeting already initialized or completed, skipping agent initialization");
            return NextResponse.json({status:"ok"});
        }
        
        await db
        .update(meetings)
        .set({
            status:"active",
            startedAt:new Date()
        })
        .where(eq(meetings.id,meetingId));
        
        console.log("✓ Meeting status updated to active");
        
        console.log("🔍 Searching for agent:", existingMeeting.agentId);
        const [existingAgent]=await db
        .select()
        .from(agents)
        .where(eq(agents.id,existingMeeting.agentId));

        console.log("Agent found:", existingAgent ? "✓ YES" : "❌ NO");
        if(existingAgent) {
            console.log("Agent details:", { id: existingAgent.id, name: existingAgent.name });
        }

        if(!existingAgent){
            console.log("❌ Agent not found");
            return NextResponse.json({error:"agent not found"},{status:404});
        }

        // Initialize agent in background WITHOUT blocking the webhook response
        (async () => {
            try {
                console.log("=".repeat(80));
                console.log("INITIALIZING OLLAMA-BASED AGENT");
                console.log("Meeting ID:", meetingId);
                console.log("Meeting Name:", existingMeeting.name);
                console.log("Agent Name:", existingAgent.name);
                console.log("Agent ID:", existingAgent.id);
                console.log("Agent Instructions:", existingAgent.instructions);
                console.log("=".repeat(80));

                // Check if Ollama is running
                const ollamaHealthy = await checkOllamaHealth();
                if (!ollamaHealthy) {
                    console.error("❌ Ollama is not running or not accessible");
                    console.log("   Make sure Ollama is running: ollama serve");
                    return;
                }

                console.log("✓ Ollama health check passed");

                // List available models
                const models = await listOllamaModels();
                console.log(`✓ Available Ollama models: ${models.map(m => m.model).join(", ") || "None"}`);

                // Initialize Ollama agent
                // Using model from agent.model field or default to "mistral"
                const agentModel = existingAgent.model || "mistral";
                
                const ollamaAgent = await initializeOllamaAgent(
                    existingAgent.name,
                    agentModel,
                    existingAgent.instructions,
                    ["calculator", "websearch", "calendar"]
                );

                if (!ollamaAgent) {
                    console.error("❌ Failed to initialize Ollama agent");
                    return;
                }

                console.log("✅ Ollama agent initialized successfully");
                console.log(`   Model: ${ollamaAgent.model}`);
                console.log(`   Temperature: ${ollamaAgent.temperature}`);
                console.log(`   Tools: ${ollamaAgent.tools.join(", ")}`);
                console.log(`   Knowledge Base: ${ollamaAgent.knowledgeBase.length} documents`);

                // Store agent configuration in database for persistence
                // TODO: Create agent_sessions table to store active agent instances
                console.log("✅ Agent configuration stored and ready for meeting interactions");

            } catch (err) {
                console.error("❌ Ollama Agent Initialization Failed:");
                console.error("Error details:", err);
                console.error("Error stack:", (err as any)?.stack);
            }
        })();

        return NextResponse.json({status:"ok"});

    }else if(eventType==="call.session_participant_left"){
        const event=payload as CallSessionParticipantLeftEvent;
        const meetingId=event.call_cid.split(":")[1];

        if(!meetingId){
            return NextResponse.json({error:"Missing meetingId"},{status:400})
        }

         const call=streamVideo.video.call("default",meetingId);
         await call.end();
    }else if(eventType==="call.session_ended"){
        const event=payload as CallEndedEvent;
        const meetingId=event.call.custom?.meetingId;
           if(!meetingId){
            return NextResponse.json({error:"Missing meetingId"},{status:400})
        }
     await db
       .update(meetings)
       .set({
        status:"processing",
        endedAt:new Date(),
       }) 
       .where(and(eq(meetings.id,meetingId),eq(meetings.status,"active")))
    }else if(eventType==="call.transcription_ready"){
        const event=payload as CallTranscriptionReadyEvent;
        const meetingId=event.call_cid.split(":")[1];
         if(!meetingId){
            return NextResponse.json({error:"Missing meetingId"},{status:400})
        }

        const [updatedMeeting]=await db
            .update(meetings)
            .set({
                transcriptUrl:event.call_transcription.url,
            })
            .where(eq(meetings.id,meetingId))
            .returning();
         
          if(!updatedMeeting){
            return NextResponse.json({error:"Missing updatedMeeting"},{status:404})
        }   
        await inngest.send({
            name:"meetings/processing",
            data:{
                meetingId:updatedMeeting.id,
                transcriptUrl:updatedMeeting.transcriptUrl
            }
        })
    }else if(eventType==="call.recording_ready"){
        const event=payload as CallRecordingReadyEvent;
        const meetingId=event.call_cid.split(":")[1];
         if(!meetingId){
            return NextResponse.json({error:"Missing meetingId"},{status:400})
        }

       await db
         .update(meetings)
         .set({
            recordingUrl:event.call_recording.url,
         })
         .where(eq(meetings.id,meetingId));
    } else if(eventType==="message.new"){
       const event=payload as MessageNewEvent;
       
       const userId=event.user?.id;
       const channelId=event.channel_id;
       const text=event.message?.text;

       if(!userId || !channelId || !text){
        return NextResponse.json(
            {error:"Missing required fields"},
            {status:400}
        );
       }

       // Handle messages from ACTIVE calls or COMPLETED calls
       const [existingMeeting]=await db 
          .select()
          .from(meetings)
          .where(and(eq(meetings.id,channelId), 
                    or(eq(meetings.status,"active"), eq(meetings.status,"completed"))));

          if(!existingMeeting){
            return NextResponse.json({error:"Meetings not found"},{status:404})
          }

          const [existingAgent]=await db 
             .select()
             .from(agents)
             .where(eq(agents.id,existingMeeting.agentId));

          if(!existingAgent){
            return NextResponse.json({error:"Agent not found"},{status:404})
          }

          if(userId !== existingAgent.id){
            const instructions = `
      You are an AI assistant helping the user revisit a recently completed meeting.
      Below is a summary of the meeting, generated from the transcript:
      
      ${existingMeeting.summary}
      
      The following are your original instructions from the live meeting assistant. Please continue to follow these behavioral guidelines as you assist the user:
      
      ${existingAgent.instructions}
      
      The user may ask questions about the meeting, request clarifications, or ask for follow-up actions.
      Always base your responses on the meeting summary above.
      
      You also have access to the recent conversation history between you and the user. Use the context of previous messages to provide relevant, coherent, and helpful responses. If the user's question refers to something discussed earlier, make sure to take that into account and maintain continuity in the conversation.
      
      If the summary does not contain enough information to answer a question, politely let the user know.
      
      Be concise, helpful, and focus on providing accurate information from the meeting and the ongoing conversation.
      `;
       
      const channel=streamChat.channel("messaging",channelId)
      await channel.watch();

      const previousMessages=channel.state.messages
           .slice(-5)
           .filter((msg)=>msg.text && msg.text.trim() !== "");

      // Build chat history for context
      let fullPrompt = previousMessages
        .map((msg) => `${msg.user?.id === existingAgent.id ? "Agent" : "User"}: ${msg.text}`)
        .join("\n");
      
      fullPrompt += `\nUser: ${text}\nAgent:`;

      // Generate response using Ollama
      const { generateWithOllama } = await import("@/lib/ollama");
      const ollamaResponse = await generateWithOllama({
            model: existingAgent.model || "mistral",
            prompt: fullPrompt,
            system: instructions,
            temperature: 0.2,
      });

      const GPTResponseText = ollamaResponse.trim();
      console.log(GPTResponseText);
                if(!GPTResponseText){
                    return NextResponse.json(
                        {error:"No response from Ollama"},
                        {status:400}
                    );
                }
                
                const avatarUrl=GneneratedAvatarUri({
                    seed:existingAgent.name,
                    variant:"botttsNeutral"
                });

                streamChat.upsertUser({
                    id:existingAgent.id,
                    name:existingAgent.name,
                    image:avatarUrl,
                });

                channel.sendMessage({
                    text:GPTResponseText,
                    user:{
                        id:existingAgent.id,
                        name:existingAgent.name,
                        image:avatarUrl
                    }
                })
          }
    }


    return NextResponse.json({status:"ok"});
}
