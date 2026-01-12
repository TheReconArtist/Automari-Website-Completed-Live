'use client';

import { ChatMessage } from '@/components/chat/BrainProvider';

// Placeholder for WebLLM init and generate functions
let webllmEngine: any = null;
let webllmLoadingPromise: Promise<any> | null = null;

export type ModelType = 'webllm' | 'server' | 'rules';
export type ServerProvider = 'groq' | 'openai' | 'anthropic' | 'openrouter';

interface ModelAdapterResult {
  type: ModelType;
  provider?: ServerProvider;
  engine?: any; // For webllm engine instance
}

interface InitWebLLMOptions {
  onProgress?: (report: { text: string; progress: number }) => void;
}

/**
 * Initializes the WebLLM engine lazily.
 * This will download the model weights and set up the in-browser LLM.
 */
export async function initWebLLM({ onProgress }: InitWebLLMOptions = {}) {
  if (webllmEngine) return webllmEngine;
  if (webllmLoadingPromise) return webllmLoadingPromise;

  webllmLoadingPromise = (async () => {
    try {
      const webllmModule = await import('@mlc-ai/web-llm');
      const CreateMLC = (webllmModule as any).CreateMLC || (webllmModule as any).default?.CreateMLC;
      if (!CreateMLC) {
        throw new Error('CreateMLC not found in @mlc-ai/web-llm');
      }
      const mlc = await CreateMLC();

      const modelList = mlc.getModelList();
      const preferredModel = modelList.find((m: any) => m.model_type.includes("instruct") && m.quantization === "q4f16_1") ||
                             modelList.find((m: any) => m.model_type.includes("instruct")) ||
                             modelList[0]; // Fallback to first available
      
      if (!preferredModel) {
        throw new Error("No suitable WebLLM model found.");
      }

      console.log(`Loading WebLLM model: ${preferredModel.model_type} (${preferredModel.quantization})`);

      await mlc.loadWebGPULibrary();
      await mlc.reload(
        preferredModel.model_type,
        { quantization: preferredModel.quantization },
        (report: { text: string; progress: number }) => {
          onProgress?.(report);
          console.log(`WebLLM Load Progress: ${report.text} (${(report.progress * 100).toFixed(2)}%)`);
        }
      );
      webllmEngine = mlc;
      return webllmEngine;
    } catch (e) {
      console.error("Failed to initialize WebLLM:", e);
      webllmLoadingPromise = null; // Allow retry
      throw e;
    }
  })();

  return webllmLoadingPromise;
}

/**
 * Generates a response from the WebLLM engine.
 * @param messages - Array of chat messages.
 * @param systemPrompt - The system-level instruction for the LLM.
 * @param onDelta - Callback for streaming partial token updates.
 */
export async function generateWebLLMResponse(
  messages: ChatMessage[],
  systemPrompt: string,
  onDelta: (chunk: string) => void
): Promise<void> {
  if (!webllmEngine) {
    throw new Error("WebLLM engine not initialized.");
  }

  const formattedMessages = [
    { role: "system", content: systemPrompt },
    ...messages.map(msg => ({ role: msg.sender === "AI" ? "assistant" : "user", content: msg.text }))
  ];

  const output = await webllmEngine.chat.completions.create({
    messages: formattedMessages,
    stream: true,
  });

  for await (const chunk of output) {
    onDelta(chunk.choices[0]?.delta?.content || "");
  }
}

/**
 * Chooses the appropriate LLM model/provider based on environment and capabilities.
 */
export async function chooseModel(): Promise<ModelAdapterResult> {
  // 1. Always prefer server-side AI if available (check via health endpoint)
  try {
    const healthResponse = await fetch('/api/ai/health', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store', // Don't cache health checks
    });
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      if (process.env.NODE_ENV === 'development') {
        console.log('[ModelAdapter] Health check result:', healthData);
      }
      
      if (healthData.available && healthData.provider) {
        // Server AI is configured and available
        if (process.env.NODE_ENV === 'development') {
          console.log(`[ModelAdapter] Using server AI: ${healthData.provider}`);
        }
        return { type: 'server', provider: healthData.provider as ServerProvider };
      } else {
        // Even if health check fails, try server first - health check might be wrong
        // Return server type so we attempt the API call
        return { type: 'server', provider: null };
      }
    }
  } catch (e) {
    // Network error - API might not exist or be unreachable
    // Still try server - the health endpoint might be down but API might work
    return { type: 'server', provider: null };
  }

  // 2. WebLLM (Browser-based) - only on client, with WebGPU
  if (typeof window !== 'undefined' && (navigator as any).gpu && !localStorage.getItem('noLocalLLM')) {
    return { type: 'webllm' };
  }

  // 3. Fallback to rules-based engine (only if nothing else works)
  return { type: 'rules' };
}
