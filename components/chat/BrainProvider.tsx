'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { chooseModel, initWebLLM, generateWebLLMResponse, ModelType, ServerProvider } from '@/lib/ai/modelAdapter';
import { SYSTEM_PROMPT } from '@/lib/ai/systemPrompt';
import { getRulesFallbackResponse } from '@/lib/ai/rulesFallback';
import { conversationMemory } from '@/lib/ai/conversationMemory';
import { leadQualification } from '@/lib/ai/leadQualification';
import { analyticsSystem } from '@/lib/ai/analytics';
import { ragSystem } from '@/lib/ai/ragSystem';
import { businessTools, executeBusinessTool } from '@/lib/ai/businessTools';

// Define types for messages and context
export interface ChatMessage {
  id: number | string;
  sender: "AI" | "You";
  text: string;
  timestamp: Date;
}

interface ChatContextType {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  modelType: ModelType | null;
  provider: ServerProvider | null;
  sendMessage: (text: string, isQuickAction?: boolean) => Promise<void>;
  addMessage: (message: ChatMessage) => void;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface BrainProviderProps {
  children: React.ReactNode;
  systemPromptOverride?: string;
  knowledgeDocs?: string[]; // Not directly used by BrainProvider, but can be passed to rulesFallback if needed.
}

export function BrainProvider({ children, systemPromptOverride }: BrainProviderProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'initial',
      sender: "AI",
      text: "Hey! I'm Mari, your AI-automation strategist. Tell me the one part of your business that feels the most chaotic or time-consuming right now.",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelType, setModelType] = useState<ModelType | null>(null);
  const [provider, setProvider] = useState<ServerProvider | null>(null);
  const currentStream = useRef<AbortController | null>(null);
  const isInit = useRef(false);
  const sessionId = useRef(`session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: 'initial',
        sender: "AI",
        text: "Hey! I'm Mari, your AI-automation strategist. Tell me the one part of your business that feels the most chaotic or time-consuming right now.",
        timestamp: new Date(),
      },
    ]);
  }, []);

  // Initialize model on first mount / chat open
  useEffect(() => {
    const initializeModel = async () => {
      if (isInit.current) return;
      isInit.current = true;

      try {
        const modelDecision = await chooseModel();
        setModelType(modelDecision.type);
        setProvider(modelDecision.provider || null);

        if (modelDecision.type === 'webllm') {
          toast.info("Loading local AI model... First run may take longer.", { duration: 5000 });
          const startTime = performance.now();
          await initWebLLM({
            onProgress: (report) => {
              if (report.progress < 1) {
                toast.loading(`Loading local AI: ${report.text} (${(report.progress * 100).toFixed(0)}%)`, {
                  id: 'webllm-loading',
                  duration: 60000, // Keep loading toast for a long time
                });
              }
            },
          });
          toast.success("Local AI model loaded!");
          if (performance.now() - startTime > 20000) {
            toast.info("Local model took over 20 seconds to load. Performance may vary.");
          }
        } else if (modelDecision.type === 'server') {
          toast.success(`Connected to server AI via ${modelDecision.provider}!`);
        } else if (modelDecision.type === 'rules') {
          toast.info("Using rules-based fallback for AI.");
        }
      } catch (e: any) {
        console.error("Failed to initialize AI model:", e);
        setError(`Failed to initialize AI: ${e.message}`);
        toast.error(`Failed to initialize AI: ${e.message}`);
        setModelType('rules'); // Fallback to rules if init fails
      }
    };

    initializeModel();
  }, [prefersReducedMotion]); // Re-evaluate if user changes motion preference

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: "You",
      text: text.trim(),
      timestamp: new Date(),
    };
    
    // Add user message immediately and get updated messages
    let currentMessages: ChatMessage[] = [];
    setMessages(prev => {
      currentMessages = [...prev, userMessage];
      return currentMessages;
    });
    
    setIsLoading(true);
    setError(null); // Clear any previous errors

    // Initialize conversation memory and lead qualification
    await conversationMemory.getContext(sessionId.current);
    await leadQualification.initializeLead(sessionId.current);

    // Track analytics event
    analyticsSystem.trackEvent({
      type: 'message',
      sessionId: sessionId.current,
      data: { message: text.trim(), timestamp: new Date() },
      timestamp: new Date()
    });

    // Create an AbortController for stream cancellation
    currentStream.current = new AbortController();
    const signal = currentStream.current.signal;

    let aiResponseText = "";

    try {
      if (modelType === 'webllm') {
        // Count user messages to determine if this is the first message
        const userMessageCount = currentMessages.filter(m => m.sender === "You").length;
        const isFirstMessage = userMessageCount === 1;
        const lastUserMessage = text.trim();
        
        // Get previous AI responses to prevent repetition
        const previousAIResponses = currentMessages
          .filter(m => m.sender === "AI" && m.id !== 'initial')
          .map(m => m.text.substring(0, 100))
          .slice(-5);
        
        // Enhance system prompt with conversation context
        const basePrompt = systemPromptOverride || SYSTEM_PROMPT;
        const enhancedPrompt = `${basePrompt}

## CRITICAL: CURRENT CONVERSATION STATE
- Total user messages: ${userMessageCount}
- ${isFirstMessage ? '⚠️ FIRST MESSAGE - Send greeting only' : '⚠️ NOT first message - NEVER greet again'}
- User just said: "${lastUserMessage}"

## ANTI-REPETITION: YOUR PREVIOUS RESPONSES
${previousAIResponses.length > 0 ? previousAIResponses.map((r, i) => `${i + 1}. "${r}..."`).join('\n') : 'None yet'}

🚫 DO NOT repeat any of the above. Generate something COMPLETELY DIFFERENT.

## YOUR TASK
The user said: "${lastUserMessage}"
1. Acknowledge their specific words
2. Add brief insight
3. Ask ONE different follow-up question`;

        await generateWebLLMResponse(currentMessages, enhancedPrompt, (chunk) => {
          setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage && lastMessage.sender === "AI" && typeof lastMessage.id === 'string' && lastMessage.id.startsWith("stream-")) {
              return prev.map((msg, idx) =>
                idx === prev.length - 1 ? { ...msg, text: msg.text + chunk } : msg
              );
            } else {
              return [...prev, { id: `stream-${Date.now()}`, sender: "AI", text: chunk, timestamp: new Date() }];
            }
          });
        });
        // Finalize the streaming message after completion
        setMessages(prev => prev.map(msg => 
            (typeof msg.id === 'string' && msg.id.startsWith("stream-")) ? { ...msg, id: Date.now() + Math.random(), text: msg.text } : msg
        ));

      } else if (modelType === 'server') {
        try {
          // Format messages for API - ensure we include full conversation history
          // Filter out the initial greeting message but keep all actual conversation
          const apiMessages = currentMessages
            .filter(msg => msg.id !== 'initial') // Remove initial greeting from context
            .map(msg => ({ 
              role: msg.sender === "AI" ? "assistant" : "user", 
              content: msg.text 
            }))
            .slice(-20); // Keep last 20 messages for context (prevent token overflow)
          
          // Ensure we have at least the current user message
          if (apiMessages.length === 0 || apiMessages[apiMessages.length - 1].role !== 'user') {
            // This shouldn't happen, but add safety check
            apiMessages.push({
              role: 'user',
              content: text.trim()
            });
          }

          // Debug logging (can be removed in production)
          if (process.env.NODE_ENV === 'development') {
            console.log('[BrainProvider] Sending to API:', { 
              messageCount: apiMessages.length, 
              userMessages: apiMessages.filter(m => m.role === 'user').length
            });
          }

          const response = await fetch('/api/ai', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'x-session-id': sessionId.current // Pass session ID for conversation memory
            },
            body: JSON.stringify({ 
              messages: apiMessages
            }),
            signal, // Pass the abort signal
          });

          if (!response.ok) {
            let errorDetails = `Server error: ${response.status}`;
            try {
              const errorData = await response.json();
              errorDetails = errorData.details || errorData.error || errorDetails;
              if (process.env.NODE_ENV === 'development') {
                console.error('[BrainProvider] API Error:', errorData);
              }
            } catch (e) {
              // If JSON parsing fails, use status text
              errorDetails = response.statusText || errorDetails;
            }
            if (process.env.NODE_ENV === 'development') {
              console.error('[BrainProvider] API request failed:', errorDetails);
            }
            throw new Error(errorDetails);
          }

          const reader = response.body?.getReader();
          if (!reader) {
            if (process.env.NODE_ENV === 'development') {
              console.error('[BrainProvider] No readable stream from API');
            }
            throw new Error("No readable stream from server. The AI provider may not be configured.");
          }

          // Stream started successfully

          // Update provider from response header
          const providerHeader = response.headers.get('x-llm-provider');
          if (providerHeader && providerHeader !== 'none') {
            setProvider(providerHeader as ServerProvider);
          }

          const decoder = new TextDecoder();
          let done = false;

          // Create an AI message placeholder for streaming
          const streamingAiMessageId = `stream-${Date.now()}`;
          addMessage({ id: streamingAiMessageId, sender: "AI", text: "", timestamp: new Date() });

          // Optimized streaming with requestAnimationFrame for smooth updates
          let animationFrameId: number | null = null;
          let pendingUpdate = false;
          let lastUpdateTime = 0;
          const UPDATE_INTERVAL = 50; // Update every 50ms for smooth streaming
          
          const updateMessage = () => {
            if (pendingUpdate && !signal.aborted) {
              const now = Date.now();
              if (now - lastUpdateTime >= UPDATE_INTERVAL) {
                setMessages(prev => prev.map(msg => 
                    msg.id === streamingAiMessageId ? { ...msg, text: aiResponseText } : msg
                ));
                pendingUpdate = false;
                lastUpdateTime = now;
              }
            }
            animationFrameId = null;
          };

          while (!done && !signal.aborted) {
            try {
              const { value, done: readerDone } = await reader.read();
              done = readerDone;
              
              if (value) {
                const chunk = decoder.decode(value, { stream: true });
                if (chunk) {
                  aiResponseText += chunk;
                  if (!pendingUpdate) {
                    pendingUpdate = true;
                    if (animationFrameId === null) {
                      animationFrameId = requestAnimationFrame(updateMessage);
                    }
                  }
                }
              }
            } catch (readError: any) {
              if (!signal.aborted) {
                console.error("Error reading stream:", readError);
                throw new Error(`Stream read error: ${readError.message}`);
              }
              break;
            }
          }
          
          // Final update
          if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
          }
          updateMessage();

          // Finalize the streaming message
          if (aiResponseText.trim()) {
            setMessages(prev => prev.map(msg => 
                msg.id === streamingAiMessageId ? { ...msg, id: Date.now() + Math.random(), text: aiResponseText.trim() } : msg
            ));
          } else {
            // If no response was received, remove the placeholder
            setMessages(prev => prev.filter(msg => msg.id !== streamingAiMessageId));
            throw new Error("No response received from AI provider.");
          }
        } catch (fetchError: any) {
          if (signal.aborted) {
            throw fetchError; // Re-throw abort errors
          }
          if (process.env.NODE_ENV === 'development') {
            console.error("[BrainProvider] Server API error:", fetchError);
          }
          
          // ALWAYS try to retry the API call once before falling back to rules
          // Sometimes network issues cause temporary failures
          try {
            if (process.env.NODE_ENV === 'development') {
              console.log("[BrainProvider] Retrying API call...");
            }
            const retryResponse = await fetch('/api/ai', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'x-session-id': sessionId.current
              },
              body: JSON.stringify({ 
                messages: currentMessages
                  .filter(msg => msg.id !== 'initial')
                  .map(msg => ({ 
                    role: msg.sender === "AI" ? "assistant" : "user", 
                    content: msg.text 
                  }))
                  .slice(-20)
              }),
            });

            if (retryResponse.ok && retryResponse.body) {
              // Retry successful
              const retryReader = retryResponse.body.getReader();
              const decoder = new TextDecoder();
              let done = false;
              const streamingAiMessageId = `stream-${Date.now()}`;
              addMessage({ id: streamingAiMessageId, sender: "AI", text: "", timestamp: new Date() });

              while (!done) {
                const { value, done: readerDone } = await retryReader.read();
                done = readerDone;
                if (value) {
                  const chunk = decoder.decode(value, { stream: true });
                  if (chunk) {
                    aiResponseText += chunk;
                    setMessages(prev => prev.map(msg => 
                      msg.id === streamingAiMessageId ? { ...msg, text: aiResponseText } : msg
                    ));
                  }
                }
              }
              
              if (aiResponseText.trim()) {
                setMessages(prev => prev.map(msg => 
                  msg.id === streamingAiMessageId ? { ...msg, id: Date.now() + Math.random(), text: aiResponseText.trim() } : msg
                ));
                return; // Success, exit early
              }
            }
          } catch (retryError) {
            if (process.env.NODE_ENV === 'development') {
              console.error("[BrainProvider] Retry also failed:", retryError);
            }
          }

          // Only fallback to rules if API completely fails
          if (process.env.NODE_ENV === 'development') {
            console.warn("[BrainProvider] Falling back to rules-based response (API unavailable)");
          }
          const isFirstUserMessage = currentMessages.filter(m => m.sender === "You").length === 1;
          const rulesResponse = await getRulesFallbackResponse(text, isFirstUserMessage);
          aiResponseText = rulesResponse.text;
          addMessage({ id: Date.now(), sender: "AI", text: aiResponseText, timestamp: new Date() });
        }

      } else { // Rules fallback with RAG enhancement
        // Try RAG system first
        const ragResponse = await ragSystem.generateResponse(text, {
          industry: conversationMemory.getContext(sessionId.current).companyInfo?.industry,
          category: 'general'
        });
        
        const isFirstUserMessage = currentMessages.filter(m => m.sender === "You").length === 1;
        
        if (ragResponse.confidence > 0.5) {
          aiResponseText = ragResponse.answer;
        } else {
          const rulesResponse = await getRulesFallbackResponse(text, isFirstUserMessage);
          aiResponseText = rulesResponse.text;
        }
        
        addMessage({ id: Date.now(), sender: "AI", text: aiResponseText, timestamp: new Date() });
      }

    } catch (e: any) {
      if (signal.aborted) {
        // Message sending aborted
        aiResponseText = "Message cancelled.";
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.error("Error generating AI response:", e);
        }
        
        // Try rules fallback if we haven't already
        if (modelType !== 'rules' && !aiResponseText) {
          try {
            if (process.env.NODE_ENV === 'development') {
              console.log("Attempting rules-based fallback...");
            }
            const isFirstUserMessage = currentMessages.filter(m => m.sender === "You").length === 1;
            const rulesResponse = await getRulesFallbackResponse(text, isFirstUserMessage);
            aiResponseText = rulesResponse.text;
            addMessage({ id: Date.now() + 1, sender: "AI", text: aiResponseText, timestamp: new Date() });
            setError(null); // Clear error since we have a fallback response
          } catch (fallbackError: any) {
            if (process.env.NODE_ENV === 'development') {
              console.error("Rules fallback also failed:", fallbackError);
            }
            setError(e.message);
            // Only show error message if all fallbacks fail
            aiResponseText = `I apologize, but I'm experiencing a technical issue. Let me help you connect directly with our support team:\n\n**📞 Support Contact**\nPhone/Text: [**561-201-4365**](tel:561-201-4365)\nEmail: [**contactautomari@gmail.com**](mailto:contactautomari@gmail.com)\n\nOur team can provide immediate assistance with your automation needs.`;
            addMessage({ id: Date.now() + 1, sender: "AI", text: aiResponseText, timestamp: new Date() });
          }
        } else {
          setError(e.message);
          // If we already have some response text, use it
          if (!aiResponseText) {
            aiResponseText = `I apologize, but I'm experiencing a technical issue. Please contact our support team at [**561-201-4365**](tel:561-201-4365) or email us at [**contactautomari@gmail.com**](mailto:contactautomari@gmail.com) for immediate assistance.`;
            addMessage({ id: Date.now() + 1, sender: "AI", text: aiResponseText, timestamp: new Date() });
          }
        }
      }
    } finally {
      // Update conversation memory and lead qualification
      conversationMemory.addTurn(sessionId.current, {
        id: userMessage.id.toString(),
        timestamp: userMessage.timestamp,
        userMessage: userMessage.text,
        aiResponse: aiResponseText,
        businessValue: analyticsSystem.getAnalytics(sessionId.current)?.metrics.businessValueScore || 0
      });

      // Update lead qualification
      await leadQualification.updateLead(sessionId.current);

      // Track analytics event
      analyticsSystem.trackEvent({
        type: 'engagement',
        sessionId: sessionId.current,
        data: { 
          response: aiResponseText, 
          businessValue: analyticsSystem.getAnalytics(sessionId.current)?.metrics.businessValueScore || 0,
          timestamp: new Date() 
        },
        timestamp: new Date()
      });

      setIsLoading(false);
      currentStream.current = null; // Clear abort controller
      
      // Clear error if we successfully got a response
      if (aiResponseText && !error) {
        setError(null);
      }
    }
  }, [isLoading, modelType, addMessage, systemPromptOverride, prefersReducedMotion, error]);

  const contextValue = React.useMemo(() => ({
    messages,
    isLoading,
    error,
    modelType,
    provider,
    sendMessage,
    addMessage,
    clearChat,
  }), [messages, isLoading, error, modelType, provider, sendMessage, addMessage, clearChat]);

  return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a BrainProvider');
  }
  return context;
}
