'use client'

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Send, Zap, Brain, MessageSquare } from "lucide-react"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import { BrainProvider, useChat, ChatMessage } from '@/components/chat/BrainProvider';
import { toast } from 'sonner';
import { useChatOpen } from '@/components/chat/useChatOpen';
import { SiriWaveLogo } from './SiriWaveLogo';
import {
  MAIN_CATEGORIES,
  getFollowUpOptions,
  shouldShowMainCategories,
  GuidedOption,
} from '@/lib/ai/guidedFlows';

// Define a type for lead capture information
interface LeadInfo {
  name?: string;
  email?: string;
  phone?: string;
}

// Mari Mari - Futuristic AI-Powered Automation Consultant Chatbot UI
function MariMariChatbotUI() {
  const { isOpen, toggleChat, setIsOpen } = useChatOpen();
  const { messages, isLoading, error, modelType, provider, sendMessage, addMessage, clearChat } = useChat();
  const [inputMessage, setInputMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [leadInfo, setLeadInfo] = useState<LeadInfo>({});
  const [awaitingLeadInfo, setAwaitingLeadInfo] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const submitLead = async (info: LeadInfo) => {
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: info.name,
          email: info.email,
          phone: info.phone,
          message: 'Lead captured via Mari Mari chatbot — requested discovery call/quote.',
          source: 'Mari Mari Chatbot',
          type: 'chatbot-lead',
        }),
      });
    } catch {
      // Non-blocking
    }
  };

  const handleSendMessage = async (initialMessage?: string) => {
    const currentInput = initialMessage || inputMessage.trim();
    if (!currentInput || isLoading) return;

    setInputMessage("");
    setIsTyping(true);

    if (awaitingLeadInfo) {
      const parsedLeadInfo = parseLeadInfo(currentInput);
      const mergedLead = { ...leadInfo, ...parsedLeadInfo };
      setLeadInfo(mergedLead);

      addMessage({ id: Date.now(), sender: "You", text: currentInput, timestamp: new Date() });

      const missing: string[] = [];
      if (!mergedLead.name) missing.push('name');
      if (!mergedLead.email) missing.push('email');
      if (!mergedLead.phone) missing.push('phone number');

      if (missing.length === 0) {
        await submitLead(mergedLead);
        toast.success(`Thank you, ${mergedLead.name}! Our team will reach out shortly.`, { duration: 5000 });
        addMessage({
          id: Date.now() + 1,
          sender: "AI",
          text: `Perfect, ${mergedLead.name}! Mike will reach out at ${mergedLead.email} or ${mergedLead.phone} within a few hours to schedule your discovery call. Feel free to keep asking me about automation in the meantime.`,
          timestamp: new Date()
        });
        setAwaitingLeadInfo(false);
        setLeadInfo({});
      } else {
        addMessage({
          id: Date.now() + 1,
          sender: "AI",
          text: `Almost there — I still need your ${missing.join(', ')}. Drop them in one message (e.g. "John Smith, john@company.com, 561-555-1234").`,
          timestamp: new Date()
        });
      }
    } else {
      await sendMessage(currentInput);

      const lower = currentInput.toLowerCase();
      if (lower.includes('book') || lower.includes('schedule') || lower.includes('discovery') ||
          lower.includes('quote') || lower.includes('consultation') || lower.includes('appointment')) {
        setAwaitingLeadInfo(true);
      }
    }
    
    setTimeout(() => setIsTyping(false), 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const chatMessages = messages.map(m => ({ sender: m.sender, text: m.text }));
  const lastUserMsg = [...messages].reverse().find(m => m.sender === 'You')?.text || '';
  const lastAiMsg = [...messages].reverse().find(m => m.sender === 'AI')?.text || '';
  const followUpOptions = !isLoading ? getFollowUpOptions(lastUserMsg, lastAiMsg) : null;
  const showMainCategories = !isLoading && !awaitingLeadInfo && shouldShowMainCategories(chatMessages);

  const handleOptionSelect = async (option: GuidedOption) => {
    if (isLoading) return;
    await handleSendMessage(option.query);
    const lower = option.query.toLowerCase();
    if (lower.includes('book') || lower.includes('discovery') || lower.includes('quote')) {
      setAwaitingLeadInfo(true);
    }
  };

  const parseLeadInfo = (text: string): LeadInfo => {
    const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    const phoneMatch = text.match(/((?:\+\d{1,3}[-.\s]?)?(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4})/);
    const nameExplicit = text.match(/(?:my name is|i am|i'm|name:)\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)?)/i);
    let name = nameExplicit ? nameExplicit[1] : undefined;
    if (!name) {
      const withoutContact = text.replace(emailMatch?.[0] || '', '').replace(phoneMatch?.[0] || '', '').replace(/[,;|]/g, ' ').trim();
      const words = withoutContact.split(/\s+/).filter(w => /^[A-Z][a-z]+$/.test(w));
      if (words.length >= 2) name = `${words[0]} ${words[1]}`;
      else if (words.length === 1) name = words[0];
    }
    return {
      name,
      email: emailMatch ? emailMatch[1] : undefined,
      phone: phoneMatch ? phoneMatch[1] : undefined,
    };
  };

  const renderMarkdown = (text: string) => {
    return (
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          a: ({ node, ...props }) => {
            if (props.href?.startsWith('tel:') || props.href?.startsWith('mailto:')) {
              return <a {...props} className="text-blue-400 hover:text-blue-300 underline font-semibold" />;
            }
            return <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline" />;
          },
          strong: ({ node, ...props }) => <strong {...props} className="font-bold text-blue-300" />,
          p: ({ node, ...props }) => <p {...props} className="mb-1 last:mb-0" />,
          ul: ({ node, ...props }) => <ul {...props} className="list-disc list-inside ml-4 space-y-1" />,
          li: ({ node, ...props }) => <li {...props} className="mb-0.5" />,
        }}
      >
        {text}
      </ReactMarkdown>
    );
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-[60]"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Minimize chat" : "Open chat with Mari"}
          className="relative w-14 h-14 rounded-full flex items-center justify-center overflow-hidden shadow-xl"
          style={{
            background: 'linear-gradient(135deg, #0b1220 0%, #020617 100%)',
            boxShadow: '0 4px 24px rgba(34, 211, 238, 0.5)',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="minimize"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                <ChevronDown className="h-5 w-5 text-cyan-400" strokeWidth={2.5} />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
              >
                <SiriWaveLogo size={56} aria-label="Chat with Automari" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* Futuristic Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-28 right-6 w-[420px] max-w-[90vw] h-[600px] md:h-[650px] bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-3xl shadow-2xl z-[60] flex flex-col overflow-hidden backdrop-blur-xl"
            style={{
              boxShadow: '0 0 60px rgba(59, 130, 246, 0.4), 0 0 120px rgba(59, 130, 246, 0.2), inset 0 0 60px rgba(59, 130, 246, 0.1)',
            }}
            initial={{ opacity: 0, y: 50, scale: 0.9, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: 50, scale: 0.9, rotateX: 15 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Mountain Background Design - Building Animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ borderRadius: '24px' }}>
              {/* Base gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950/80 to-slate-900" style={{ borderRadius: '24px' }} />
              
              {/* Mountain layers - SVG perfectly fitted to container */}
              <svg 
                className="absolute inset-0 w-full h-full" 
                viewBox="0 0 420 650" 
                preserveAspectRatio="none"
                style={{ width: '100%', height: '100%', borderRadius: '24px' }}
              >
                {/* Clip path to ensure nothing extends beyond borders - matches container rounded corners */}
                <defs>
                  <clipPath id="mountainClip">
                    <rect x="0" y="0" width="420" height="650" rx="24" ry="24" />
                  </clipPath>
                </defs>
                
                <g clipPath="url(#mountainClip)">
                  {/* Back mountain layer - building from bottom */}
                  <motion.path
                    d="M0,650 L0,650 L80,650 L150,650 L220,650 L280,650 L350,650 L420,650 L420,650 L0,650 Z"
                    fill="rgba(30, 58, 138, 0.4)"
                    initial={{ d: "M0,650 L0,650 L80,650 L150,650 L220,650 L280,650 L350,650 L420,650 L420,650 L0,650 Z" }}
                    animate={{ 
                      d: [
                        "M0,650 L0,650 L80,650 L150,650 L220,650 L280,650 L350,650 L420,650 L420,650 L0,650 Z",
                        "M0,500 L0,550 L80,500 L150,530 L220,470 L280,510 L350,450 L420,490 L420,650 L0,650 Z",
                        "M0,480 L0,540 L80,490 L150,520 L220,460 L280,500 L350,440 L420,480 L420,650 L0,650 Z"
                      ],
                      opacity: [0.3, 0.5, 0.4]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      repeatDelay: 1,
                      ease: "easeInOut"
                    }}
                  />
                
                  {/* Middle mountain layer - building after back layer */}
                  <motion.path
                    d="M0,650 L0,650 L100,650 L180,650 L250,650 L320,650 L420,650 L420,650 L0,650 Z"
                    fill="rgba(59, 130, 246, 0.3)"
                    initial={{ d: "M0,650 L0,650 L100,650 L180,650 L250,650 L320,650 L420,650 L420,650 L0,650 Z" }}
                    animate={{ 
                      d: [
                        "M0,650 L0,650 L100,650 L180,650 L250,650 L320,650 L420,650 L420,650 L0,650 Z",
                        "M0,550 L0,600 L100,530 L180,570 L250,500 L320,540 L420,480 L420,650 L0,650 Z",
                        "M0,530 L0,580 L100,510 L180,550 L250,480 L320,520 L420,460 L420,650 L0,650 Z"
                      ],
                      opacity: [0.25, 0.4, 0.3]
                    }}
                    transition={{
                      duration: 4,
                      delay: 0.5,
                      repeat: Infinity,
                      repeatDelay: 1,
                      ease: "easeInOut"
                    }}
                  />
                
                  {/* Front mountain layer - building last */}
                  <motion.path
                    d="M0,650 L0,650 L120,650 L200,650 L280,650 L360,650 L420,650 L420,650 L0,650 Z"
                    fill="rgba(103, 232, 249, 0.25)"
                    initial={{ d: "M0,650 L0,650 L120,650 L200,650 L280,650 L360,650 L420,650 L420,650 L0,650 Z" }}
                    animate={{ 
                      d: [
                        "M0,650 L0,650 L120,650 L200,650 L280,650 L360,650 L420,650 L420,650 L0,650 Z",
                        "M0,600 L0,650 L120,570 L200,610 L280,530 L360,570 L420,510 L420,650 L0,650 Z",
                        "M0,580 L0,630 L120,550 L200,590 L280,510 L360,550 L420,490 L420,650 L0,650 Z"
                      ],
                      opacity: [0.2, 0.35, 0.25]
                    }}
                    transition={{
                      duration: 4,
                      delay: 1,
                      repeat: Infinity,
                      repeatDelay: 1,
                      ease: "easeInOut"
                    }}
                  />
                
                  {/* Small mountain peaks - building individually */}
                  <motion.path
                    d="M50,650 L70,650 L90,650 L50,650 Z"
                    fill="rgba(59, 130, 246, 0.2)"
                    initial={{ d: "M50,650 L70,650 L90,650 L50,650 Z" }}
                    animate={{ 
                      d: [
                        "M50,650 L70,650 L90,650 L50,650 Z",
                        "M50,530 L70,510 L90,530 L50,550 Z",
                        "M50,520 L70,500 L90,520 L50,540 Z"
                      ],
                      opacity: [0, 0.3, 0.2]
                    }}
                    transition={{
                      duration: 3,
                      delay: 1.5,
                      repeat: Infinity,
                      repeatDelay: 1.5,
                      ease: "easeInOut"
                    }}
                  />
                  
                  <motion.path
                    d="M200,650 L220,650 L240,650 L200,650 Z"
                    fill="rgba(103, 232, 249, 0.2)"
                    initial={{ d: "M200,650 L220,650 L240,650 L200,650 Z" }}
                    animate={{ 
                      d: [
                        "M200,650 L220,650 L240,650 L200,650 Z",
                        "M200,490 L220,470 L240,490 L200,510 Z",
                        "M200,480 L220,460 L240,480 L200,500 Z"
                      ],
                      opacity: [0, 0.3, 0.2]
                    }}
                    transition={{
                      duration: 3,
                      delay: 2,
                      repeat: Infinity,
                      repeatDelay: 1.5,
                      ease: "easeInOut"
                    }}
                  />
                  
                  <motion.path
                    d="M270,650 L290,650 L310,650 L270,650 Z"
                    fill="rgba(59, 130, 246, 0.2)"
                    initial={{ d: "M270,650 L290,650 L310,650 L270,650 Z" }}
                    animate={{ 
                      d: [
                        "M270,650 L290,650 L310,650 L270,650 Z",
                        "M270,550 L290,530 L310,550 L270,570 Z",
                        "M270,540 L290,520 L310,540 L270,560 Z"
                      ],
                      opacity: [0, 0.3, 0.2]
                    }}
                    transition={{
                      duration: 3,
                      delay: 2.5,
                      repeat: Infinity,
                      repeatDelay: 1.5,
                      ease: "easeInOut"
                    }}
                  />
                  
                  <motion.path
                    d="M350,650 L370,650 L390,650 L350,650 Z"
                    fill="rgba(103, 232, 249, 0.2)"
                    initial={{ d: "M350,650 L370,650 L390,650 L350,650 Z" }}
                    animate={{ 
                      d: [
                        "M350,650 L370,650 L390,650 L350,650 Z",
                        "M350,470 L370,450 L390,470 L350,490 Z",
                        "M350,460 L370,440 L390,460 L350,480 Z"
                      ],
                      opacity: [0, 0.3, 0.2]
                    }}
                    transition={{
                      duration: 3,
                      delay: 3,
                      repeat: Infinity,
                      repeatDelay: 1.5,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Construction particles/effects - small dots that appear during building */}
                  {[...Array(12)].map((_, i) => (
                    <motion.circle
                      key={i}
                      cx={50 + (i * 30)}
                      cy={650}
                      r={2}
                      fill="rgba(103, 232, 249, 0.6)"
                      initial={{ cy: 650, opacity: 0, r: 0 }}
                      animate={{
                        cy: [650, 500 - (i * 20), 480 - (i * 20)],
                        opacity: [0, 1, 0],
                        r: [0, 3, 0]
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.2,
                        repeat: Infinity,
                        repeatDelay: 4,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </g>
              </svg>
              
              {/* Subtle overlay gradient for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" style={{ borderRadius: '24px' }} />
            </div>

            {/* Futuristic Header */}
            <div className="relative z-10 bg-gradient-to-r from-blue-600/20 via-cyan-500/10 to-blue-600/20 backdrop-blur-md p-5 border-b border-blue-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0">
                  <SiriWaveLogo size={40} aria-label="Automari.Ai" />
                  <div className="min-w-0 border-l border-blue-500/20 pl-3">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2 truncate">
                      Mari Mari
                      <span className="w-2 h-2 bg-green-400 rounded-full shrink-0" />
                    </h3>
                    <p className="text-xs text-blue-300/80 font-medium truncate">AI-Automation Strategist</p>
                  </div>
                </div>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  aria-label="Minimize chat"
                  className="shrink-0 text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 border border-transparent hover:border-white/10"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronDown className="h-5 w-5" />
                </motion.button>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 relative z-10 custom-scrollbar">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`flex ${message.sender === "You" ? "justify-end" : "justify-start"}`}
                >
                  <motion.div
                    className={`max-w-[85%] p-4 rounded-2xl shadow-lg relative ${
                      message.sender === "You"
                        ? "bg-gradient-to-br from-blue-600 to-cyan-500 text-white rounded-br-sm"
                        : "bg-slate-800/80 backdrop-blur-sm text-slate-100 rounded-bl-sm border border-blue-500/20"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    style={
                      message.sender === "You"
                        ? {
                            boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(59, 130, 246, 0.2)',
                          }
                        : {
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 20px rgba(59, 130, 246, 0.1)',
                          }
                    }
                  >
                    <div className="text-sm leading-relaxed">
                      {renderMarkdown(message.text)}
                    </div>
                    <p className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </motion.div>
                </motion.div>
              ))}

              {/* Guided option chips */}
              {(showMainCategories || followUpOptions) && !isLoading && !awaitingLeadInfo && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 space-y-2"
                >
                  <div className="text-xs text-blue-300/80 font-medium flex items-center gap-1.5 px-1">
                    <Zap className="h-3 w-3" />
                    {showMainCategories ? 'Pick an area to get started:' : 'What fits best?'}
                  </div>
                  <div className="flex flex-col gap-2">
                    {(showMainCategories ? MAIN_CATEGORIES : followUpOptions!)!.map((option, index) => (
                      <motion.button
                        key={option.label}
                        onClick={() => handleOptionSelect(option)}
                        disabled={isLoading}
                        className="text-sm px-4 py-2.5 bg-slate-800/70 hover:bg-blue-600/25 rounded-xl text-slate-200 hover:text-white transition-all text-left border border-blue-500/25 hover:border-cyan-400/40 disabled:opacity-50 backdrop-blur-sm"
                        whileHover={{ scale: 1.01, x: 3 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        {option.label}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Advanced Loading Animation */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-slate-800/80 backdrop-blur-sm text-slate-100 rounded-2xl rounded-bl-sm p-4 border border-blue-500/30 shadow-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1.5">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2.5 h-2.5 bg-blue-400 rounded-full"
                            animate={{
                              y: [0, -8, 0],
                              opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              delay: i * 0.2,
                              ease: "easeInOut",
                            }}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Brain className="h-4 w-4 text-cyan-400" />
                        </motion.div>
                        <span className="text-xs text-blue-300">
                          {modelType === 'webllm' ? "Processing locally..." : provider ? `Connected to ${provider}...` : "Analyzing..."}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center"
                >
                  <div className="bg-blue-900/30 border border-blue-700/50 rounded-xl p-4 text-center shadow-lg backdrop-blur-sm max-w-[85%]">
                    <p className="text-xs text-blue-300 mb-2 flex items-center justify-center gap-2">
                      <motion.div
                        className="w-2 h-2 bg-blue-400 rounded-full"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      Reconnecting to AI...
                    </p>
                    <button
                      onClick={() => {
                        clearChat();
                        setError(null);
                      }}
                      className="text-xs text-blue-400 hover:text-blue-300 underline mt-2"
                    >
                      Start Fresh Chat
                    </button>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Futuristic Input Area */}
            <div className="relative z-10 p-5 border-t border-blue-500/30 bg-gradient-to-t from-slate-900 to-transparent backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <motion.div
                  className="flex-1 relative"
                  whileFocus={{ scale: 1.02 }}
                >
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={awaitingLeadInfo ? "Name, email, phone (e.g. John Smith, john@co.com, 561-555-1234)" : "Describe your biggest business bottleneck..."}
                    className="w-full bg-slate-800/60 border-2 border-blue-500/30 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/50 transition-all shadow-lg backdrop-blur-sm"
                    disabled={isLoading}
                  />
                  {isTyping && (
                    <motion.div
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    </motion.div>
                  )}
                </motion.div>
                <motion.button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-gradient-to-br from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl p-3 text-white transition-all shadow-lg relative overflow-hidden group"
                  style={{
                    boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <Send className="h-5 w-5 relative z-10" />
                </motion.button>
              </div>
              <p className="text-xs text-blue-300/70 mt-3 text-center flex items-center justify-center gap-2">
                <MessageSquare className="h-3 w-3" />
                Powered by {modelType === 'webllm' ? 'Local AI' : provider || 'Advanced AI'} • 
                <a href="tel:561-201-4365" className="text-blue-400 hover:text-blue-300 underline ml-1">561-201-4365</a>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Wrap the UI with BrainProvider
export default function MariMariChatbot() {
  return (
    <BrainProvider>
      <MariMariChatbotUI />
    </BrainProvider>
  );
}
