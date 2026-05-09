/**
 * RAG (Retrieval Augmented Generation) Pipeline
 * Provides context-aware responses from agent knowledge base
 */

import "server-only";

export interface RAGDocument {
  id: string;
  content: string;
  metadata: {
    type: "instruction" | "knowledge" | "pdf" | "document";
    source: string;
    createdAt: Date;
  };
}

export interface RAGContext {
  documents: RAGDocument[];
  relevanceScores: number[];
}

/**
 * Simple similarity scoring (for MVP)
 * In production, use vector embeddings (Chroma, Pinecone, etc.)
 */
function calculateSimilarity(query: string, text: string): number {
  const queryWords = query.toLowerCase().split(/\s+/);
  const textWords = text.toLowerCase().split(/\s+/);

  let matches = 0;
  for (const word of queryWords) {
    if (textWords.some((tw) => tw.includes(word) || word.includes(tw))) {
      matches++;
    }
  }

  return matches / Math.max(queryWords.length, 1);
}

/**
 * Retrieve relevant documents from knowledge base
 */
export function retrieveRelevantDocuments(
  query: string,
  documents: RAGDocument[],
  topK: number = 3
): RAGContext {
  // Score all documents
  const scored = documents.map((doc) => ({
    document: doc,
    score: calculateSimilarity(query, doc.content),
  }));

  // Sort by relevance and take top K
  const relevant = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter((s) => s.score > 0); // Only include if there's some relevance

  return {
    documents: relevant.map((r) => r.document),
    relevanceScores: relevant.map((r) => r.score),
  };
}

/**
 * Build context string for Ollama from retrieved documents
 */
export function buildContextString(context: RAGContext): string {
  if (context.documents.length === 0) {
    return "";
  }

  let contextStr =
    "RETRIEVED CONTEXT FOR REFERENCE:\n" + "=".repeat(50) + "\n\n";

  context.documents.forEach((doc, idx) => {
    contextStr += `[Document ${idx + 1} - ${doc.metadata.type}]\n`;
    contextStr += `Source: ${doc.metadata.source}\n`;
    contextStr += `Content: ${doc.content}\n`;
    contextStr += "\n";
  });

  contextStr += "=".repeat(50) + "\n";
  return contextStr;
}

/**
 * Generate system prompt with RAG context
 */
export function generateAgentSystemPrompt(
  agentName: string,
  agentInstructions: string,
  meetingTopic: string,
  ragContext: RAGContext
): string {
  const contextStr = buildContextString(ragContext);

  return `You are "${agentName}", an AI agent in a meeting.

MEETING TOPIC: "${meetingTopic}"

YOUR CORE INSTRUCTIONS:
${agentInstructions}

${contextStr}

BEHAVIOR RULES:
1. ONLY discuss "${meetingTopic}" and related context
2. Use the retrieved context to inform your answers
3. Be concise (1-3 sentences max)
4. If uncertain, say "I don't have information about that"
5. Stay professional and helpful
6. Refuse off-topic requests politely

GOAL: Help participants with "${meetingTopic}" by providing accurate, context-aware responses.`;
}

/**
 * Create empty knowledge base for new agent
 */
export function createKnowledgeBase(
  agentInstructions: string,
  agentName: string
): RAGDocument[] {
  return [
    {
      id: `instruction-${Date.now()}`,
      content: agentInstructions,
      metadata: {
        type: "instruction",
        source: `${agentName}'s Core Instructions`,
        createdAt: new Date(),
      },
    },
  ];
}

/**
 * Add document to knowledge base
 */
export function addDocumentToKB(
  documents: RAGDocument[],
  content: string,
  type: RAGDocument["metadata"]["type"],
  source: string
): RAGDocument[] {
  return [
    ...documents,
    {
      id: `doc-${Date.now()}`,
      content,
      metadata: {
        type,
        source,
        createdAt: new Date(),
      },
    },
  ];
}
