/**
 * Ollama Agent Core
 * Main logic for agent execution with Ollama, RAG, and Tools
 */

import "server-only";

import { generateWithOllama, testOllamaModel, OllamaGenerateRequest } from "./ollama";
import {
  generateAgentSystemPrompt,
  createKnowledgeBase,
  retrieveRelevantDocuments,
  RAGDocument,
} from "./rag-pipeline";
import { executeTool, getAvailableTools } from "./agent-tools";

export interface OllamaAgent {
  id: string;
  name: string;
  model: string; // Ollama model name (e.g., "mistral", "llama2")
  instructions: string;
  knowledgeBase: RAGDocument[];
  tools: string[]; // List of enabled tools
  temperature: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentResponseContext {
  meetingId: string;
  meetingTopic: string;
  userQuery: string;
  agentId: string;
}

/**
 * Initialize a new Ollama-based agent
 */
export async function initializeOllamaAgent(
  name: string,
  model: string,
  instructions: string,
  tools: string[] = ["calculator", "websearch", "calendar"]
): Promise<OllamaAgent | null> {
  try {
    console.log(`🤖 Initializing Ollama agent: ${name}`);
    console.log(`📦 Using model: ${model}`);

    // Test if model is available
    const testResult = await testOllamaModel(model);
    if (!testResult.success) {
      console.error(`❌ Model ${model} not available:`, testResult.error);
      return null;
    }

    console.log(`✅ Model ${model} is working`);

    // Create initial knowledge base from instructions
    const knowledgeBase = createKnowledgeBase(instructions, name);

    const agent: OllamaAgent = {
      id: `agent_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      name,
      model,
      instructions,
      knowledgeBase,
      tools,
      temperature: 0.2, // Conservative for consistency
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log(`✅ Agent ${name} initialized successfully`);
    console.log(`   Model: ${model}`);
    console.log(`   Tools: ${tools.join(", ")}`);
    console.log(`   Knowledge Base Size: ${knowledgeBase.length} documents`);

    return agent;
  } catch (err) {
    console.error(`❌ Failed to initialize agent:`, err);
    return null;
  }
}

/**
 * Generate response from Ollama agent
 */
export async function generateAgentResponse(
  agent: OllamaAgent,
  context: AgentResponseContext
): Promise<{ response: string; toolsUsed: string[] }> {
  try {
    console.log(`💬 Generating response for query: "${context.userQuery}"`);

    // Retrieve relevant documents from knowledge base
    const ragContext = retrieveRelevantDocuments(
      context.userQuery,
      agent.knowledgeBase,
      3
    );

    // Generate system prompt with RAG context
    const systemPrompt = generateAgentSystemPrompt(
      agent.name,
      agent.instructions,
      context.meetingTopic,
      ragContext
    );

    // Generate response
    const request: OllamaGenerateRequest = {
      model: agent.model,
      prompt: context.userQuery,
      system: systemPrompt,
      temperature: agent.temperature,
      top_p: 0.9,
      top_k: 40,
    };

    const response = await generateWithOllama(request);

    return {
      response: response.trim(),
      toolsUsed: [],
    };
  } catch (err) {
    console.error(`❌ Failed to generate response:`, err);
    return {
      response: "I encountered an error processing your request. Please try again.",
      toolsUsed: [],
    };
  }
}

/**
 * Process agent response with tool calling capability
 * (Advanced: Parse response for tool calls and execute them)
 */
export async function processAgentResponseWithTools(
  agent: OllamaAgent,
  context: AgentResponseContext
): Promise<{ response: string; toolsUsed: string[] }> {
  try {
    // First pass: generate base response
    let { response, toolsUsed } = await generateAgentResponse(agent, context);

    // Check if response contains tool calls (e.g., [TOOL: calculator(2+2)])
    const toolCallPattern = /\[TOOL:\s*(\w+)\s*\((.*?)\)\]/g;
    let match;
    const executedTools = [];

    while ((match = toolCallPattern.exec(response)) !== null) {
      const [fullMatch, toolName, parameters] = match;

      if (agent.tools.includes(toolName.toLowerCase())) {
        console.log(`🔧 Agent is calling tool: ${toolName}`);

        const result = await executeTool(toolName, {
          [toolName === "calculator" ? "expression" : "query"]: parameters,
        });

        if (result.success) {
          response = response.replace(fullMatch, `[RESULT: ${result.result}]`);
          executedTools.push(toolName);
        }
      }
    }

    return {
      response,
      toolsUsed: executedTools,
    };
  } catch (err) {
    console.error(`❌ Error processing response with tools:`, err);
    return {
      response: "Error processing your request.",
      toolsUsed: [],
    };
  }
}

/**
 * Get agent capabilities
 */
export async function getAgentCapabilities(agent: OllamaAgent) {
  const availableTools = await getAvailableTools();
  const enabledTools = availableTools.filter((t) =>
    agent.tools.includes(t.name.toLowerCase())
  );

  return {
    agentName: agent.name,
    model: agent.model,
    temperature: agent.temperature,
    enabledTools: enabledTools,
    knowledgeBaseSize: agent.knowledgeBase.length,
    capabilities: [
      "text_generation",
      "question_answering",
      "tool_execution",
      "context_awareness",
    ],
  };
}
