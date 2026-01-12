'use client';

import { useState, useEffect } from 'react';
import { MobileShell } from './MobileShell';
import { Inbox } from './Inbox';
import { Thread } from './Thread';
import { SmartReply } from './SmartReply';
import { RulesBuilder } from './RulesBuilder';
import { Metrics } from './Metrics';
import { Email } from '@/lib/types';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { Sparkles, Play, Zap, Pause, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDictionary } from '@/lib/i18n';
import { Locale } from '@/lib/types';

export function EmailAgentDemo() {
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isAutomationActive, setIsAutomationActive] = useState(false);
  const [showAutomateButton, setShowAutomateButton] = useState(true);

  // Debug: Log state changes
  useEffect(() => {
    console.log('📊 EmailAgentDemo State:', {
      isAutomationActive,
      showAutomateButton,
      activeTab,
      hasSelectedEmail: !!selectedEmail
    });
  }, [isAutomationActive, showAutomateButton, activeTab, selectedEmail]);

  const dict = getDictionary('en');

  const handleSelectEmail = (email: Email) => {
    if (!isAutomationActive) {
        setSelectedEmail(email);
    }
  };

  const handleBackToInbox = () => {
    setSelectedEmail(null);
  };

  const handleStartAutomation = () => {
    console.log('🚀 AUTOMATE BUTTON CLICKED - STARTING AUTOMATION');
    setIsAutomationActive(true);
    setActiveTab('inbox');
    setSelectedEmail(null);
    setShowAutomateButton(false);
    console.log('✅ State updated - isAutomationActive set to true');
  };

  const handleStopAutomation = () => {
    setIsAutomationActive(false);
    setShowAutomateButton(true);
  };

  const handleReset = () => {
    setIsAutomationActive(false);
    setShowAutomateButton(true);
    setSelectedEmail(null);
    setActiveTab('inbox');
  };

  let content;
  if (!isAutomationActive) {
    // Initial screen or manual mode
    if (selectedEmail) {
        content = <Thread email={selectedEmail} onBack={handleBackToInbox} isAutomationActive={isAutomationActive} />;
    } else {
        switch (activeTab) {
            case 'inbox':
                content = <Inbox onSelectEmail={handleSelectEmail} isAutomationActive={isAutomationActive} onStartAutomation={handleStartAutomation} onStopAutomation={handleStopAutomation} />;
                break;
            case 'smart-reply':
                content = <SmartReply />;
                break;
            case 'rules':
                content = <RulesBuilder />;
                break;
            case 'metrics':
                content = <Metrics />;
                break;
            default:
                content = <Inbox onSelectEmail={handleSelectEmail} isAutomationActive={isAutomationActive} onStartAutomation={handleStartAutomation} onStopAutomation={handleStopAutomation} />;
        }
    }
  } else {
    // Live Automation Active: always render Inbox for the continuous loop
    content = (
        <motion.div
            key="automated-inbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="h-full"
        >
            <Inbox onSelectEmail={handleSelectEmail} isAutomationActive={isAutomationActive} onStartAutomation={handleStartAutomation} onStopAutomation={handleStopAutomation} />
        </motion.div>
    );
  }

  return (
    <>
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative" style={{ pointerEvents: 'auto' }}>
        <MobileShell activeTab={activeTab} onTabChange={setActiveTab} isAutomationActive={isAutomationActive}>
          <AnimatePresence mode="wait">
            {content}
          </AnimatePresence>
        </MobileShell>
      </div>

      {/* Prominent Automate Button - Always visible when not active and on inbox tab */}
      {!isAutomationActive && activeTab === 'inbox' && !selectedEmail && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
          className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-[99999]"
          style={{ 
            position: 'fixed',
            pointerEvents: 'auto',
            zIndex: 99999,
          }}
        >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('AUTOMATE BUTTON CLICKED!');
                  handleStartAutomation();
                }}
                className="bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 hover:from-red-700 hover:via-purple-700 hover:to-blue-700 text-white font-bold text-lg px-8 py-6 rounded-full shadow-2xl border-0 relative overflow-hidden group cursor-pointer flex items-center gap-3"
                style={{
                  boxShadow: '0 0 30px rgba(239, 68, 68, 0.5), 0 0 60px rgba(147, 51, 234, 0.3), 0 0 90px rgba(59, 130, 246, 0.2)',
                  pointerEvents: 'auto',
                  zIndex: 99999,
                }}
              >
                {/* Animated background gradient */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-red-600 via-purple-600 to-blue-600"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    backgroundSize: '200% 200%',
                  }}
                />
                
                {/* Sparkle effects */}
                <motion.div
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="absolute top-2 left-4 h-4 w-4 text-yellow-300" />
                  <Sparkles className="absolute top-4 right-6 h-3 w-3 text-cyan-300" />
                  <Sparkles className="absolute bottom-3 left-8 h-3 w-3 text-pink-300" />
                </motion.div>

                <span className="relative z-10 flex items-center gap-3">
                  <Zap className="h-6 w-6" />
                  <span>Automate</span>
                  <Play className="h-5 w-5" />
                </span>

                {/* Pulsing ring effect */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-white/30"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </button>
            </motion.div>
          </motion.div>
      )}

      {/* Stop/Reset Controls - Show during automation */}
      <AnimatePresence>
        {isAutomationActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-[99999] flex gap-3"
            style={{ 
              position: 'fixed',
              pointerEvents: 'auto',
              zIndex: 99999,
            }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleStopAutomation}
                size="lg"
                variant="outline"
                className="bg-slate-800/90 backdrop-blur-md border-red-500/50 text-red-400 hover:bg-slate-700/90 hover:text-red-300 font-semibold px-6 py-3 rounded-full shadow-lg"
              >
                <Pause className="h-5 w-5 mr-2" />
                Pause
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleReset}
                size="lg"
                variant="outline"
                className="bg-slate-800/90 backdrop-blur-md border-blue-500/50 text-blue-400 hover:bg-slate-700/90 hover:text-blue-300 font-semibold px-6 py-3 rounded-full shadow-lg"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Reset
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toaster />
    </>
  );
}
