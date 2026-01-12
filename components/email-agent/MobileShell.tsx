'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Inbox, Mail, Settings, Plus, Sparkles, MessageSquare, BookText, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getDictionary } from '@/lib/i18n';
import { Locale } from '@/lib/types';

interface MobileShellProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAutomationActive: boolean; // Add this prop
}

export function MobileShell({
  children,
  activeTab,
  onTabChange,
  isAutomationActive,
}: MobileShellProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dict = getDictionary('en'); // Assuming English for demo

  const tabs = [
    { id: 'inbox', label: dict.tabs.inbox, icon: Inbox },
    { id: 'smart-reply', label: dict.tabs.smartReply, icon: MessageSquare },
    { id: 'rules', label: dict.tabs.rules, icon: BookText },
    { id: 'metrics', label: dict.tabs.metrics, icon: BarChart },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-950 text-white shadow-lg overflow-hidden">
      {/* Sticky Header */}
      <motion.header
        className="flex items-center justify-between p-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-700 z-40"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/" className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-red-400" />
          <span className="text-xl font-bold">{dict.common.appName}</span>
        </Link>
        <Badge variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-500/30">
          {dict.common.demoBadge}
        </Badge>
      </motion.header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-900 custom-scrollbar relative">
        {children}
      </main>

      {/* Floating Action Button (FAB) */}
      <motion.div
        className="absolute bottom-20 right-4 z-40"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Button
          size="lg"
          className="rounded-full w-14 h-14 bg-red-600 hover:bg-red-700 shadow-lg text-white"
          aria-label="New Rule or Compose"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </motion.div>

      {/* Bottom Tab Bar */}
      <motion.nav
        className="flex justify-around items-center h-16 bg-slate-900/80 backdrop-blur-md border-t border-slate-700 z-40"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <Button
              key={tab.id}
              variant="ghost"
              className={`flex flex-col items-center justify-center space-y-1 h-full w-full rounded-none 
                ${isActive && !isAutomationActive ? 'text-red-400' : 'text-slate-400'} 
                ${isActive && isAutomationActive ? 'text-blue-400 animate-pulse' : 'hover:text-white'}
                ${isAutomationActive && tab.id !== 'inbox' ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              onClick={() => !isAutomationActive && onTabChange(tab.id)}
              aria-label={tab.label}
              disabled={isAutomationActive && tab.id !== 'inbox'} // Disable other tabs during automation
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{tab.label}</span>
            </Button>
          );
        })}
      </motion.nav>
    </div>
  );
}
