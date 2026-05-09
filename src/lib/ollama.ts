/**
 * Ollama Integration - Local AI Model Management
 * Connects to Ollama running on localhost:11434
 */

import axios, { AxiosError } from "axios";

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || "http://localhost:11434/api";

export interface OllamaModel {
  name: string;
  model: string;
  modified_at: string;
  size: number;
  digest: string;
}

export interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  system?: string;
  context?: number[];
  temperature?: number;
  top_k?: number;
  top_p?: number;
}

export interface OllamaGenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

/**
 * Check if Ollama is running and accessible
 */
export async function checkOllamaHealth(): Promise<boolean> {
  try {
    const response = await axios.get(`${OLLAMA_API_URL}/tags`, {
      timeout: 5000,
    });
    return response.status === 200;
  } catch (err) {
    console.error("❌ Ollama health check failed:", err instanceof Error ? err.message : String(err));
    return false;
  }
}

/**
 * Get list of available Ollama models
 */
export async function listOllamaModels(): Promise<OllamaModel[]> {
  try {
    const response = await axios.get<{ models: OllamaModel[] }>(
      `${OLLAMA_API_URL}/tags`
    );
    return response.data.models || [];
  } catch (err) {
    console.error("❌ Failed to list Ollama models:", err instanceof Error ? err.message : String(err));
    return [];
  }
}

/**
 * Generate text using Ollama model
 * Used for agent responses during calls
 */
export async function generateWithOllama(
  request: OllamaGenerateRequest
): Promise<string> {
  try {
    console.log(`📝 Generating with Ollama model: ${request.model}`);

    const response = await axios.post<OllamaGenerateResponse>(
      `${OLLAMA_API_URL}/generate`,
      {
        model: request.model,
        prompt: request.prompt,
        system: request.system,
        stream: request.stream || false,
        temperature: request.temperature || 0.2, // Lower = more deterministic
        top_k: request.top_k || 40,
        top_p: request.top_p || 0.9,
      },
      {
        timeout: 60000, // 60 second timeout
      }
    );

    return response.data.response;
  } catch (err) {
    const error = err as AxiosError;
    console.error("❌ Ollama generation failed:", error.message);
    throw new Error(`Ollama generation failed: ${error.message}`);
  }
}

/**
 * Pull (download) an Ollama model
 */
export async function pullOllamaModel(modelName: string): Promise<boolean> {
  try {
    console.log(`📥 Pulling Ollama model: ${modelName}`);

    const response = await axios.post(
      `${OLLAMA_API_URL}/pull`,
      { name: modelName },
      { timeout: 300000 } // 5 minute timeout for large models
    );

    console.log(`✅ Model ${modelName} pulled successfully`);
    return true;
  } catch (err) {
    console.error(`❌ Failed to pull model ${modelName}:`, err instanceof Error ? err.message : String(err));
    return false;
  }
}

/**
 * Delete an Ollama model
 */
export async function deleteOllamaModel(modelName: string): Promise<boolean> {
  try {
    console.log(`🗑️  Deleting Ollama model: ${modelName}`);

    await axios.delete(`${OLLAMA_API_URL}/delete`, {
      data: { name: modelName },
    });

    console.log(`✅ Model ${modelName} deleted successfully`);
    return true;
  } catch (err) {
    console.error(`❌ Failed to delete model ${modelName}:`, err instanceof Error ? err.message : String(err));
    return false;
  }
}

/**
 * Test a model by generating a simple response
 */
export async function testOllamaModel(modelName: string): Promise<{ success: boolean; response?: string; error?: string }> {
  try {
    const response = await generateWithOllama({
      model: modelName,
      prompt: "Say 'Hello! I am working correctly.' in exactly one sentence.",
      temperature: 0.1,
    });

    return {
      success: true,
      response: response.trim(),
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
