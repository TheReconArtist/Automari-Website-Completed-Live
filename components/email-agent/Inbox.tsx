'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Archive, Bell, ChevronLeft, Mail, Search, Send, Settings, PlusCircle, Trash, Tag, Star, Clock, User, MessageSquare, BookText, BarChart, X, CheckCircle, FolderOpen, Filter, MoreVertical, MailX, UserPlus, Zap, Pause } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getDictionary } from '@/lib/i18n';
import { Email, EmailCategory, Locale, EMAIL_CATEGORIES } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';
import { gsap } from 'gsap'; // Added gsap import

const mockEmails = require('@/data/mock-inbox.json') as Email[];

interface InboxProps {
  onSelectEmail: (email: Email) => void;
  isAutomationActive: boolean;
  onStartAutomation?: () => void;
  onStopAutomation?: () => void;
}

interface AnimatedEmailProps {
    email: Email;
    targetRef: React.RefObject<HTMLDivElement>;
    onComplete: (id: string) => void;
    onCountUpdate: (category: EmailCategory) => void; 
}

function AnimatedEmail({
    email,
    targetRef,
    onComplete,
    onCountUpdate
}: AnimatedEmailProps) {
    const [position, setPosition] = useState({ x: 0, y: 0, opacity: 1 });
    const emailRef = useRef<HTMLDivElement>(null);

    // Get category color
    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'priority': return { from: '#eab308', to: '#ca8a04' };
            case 'leads': return { from: '#ef4444', to: '#dc2626' };
            case 'support': return { from: '#3b82f6', to: '#2563eb' };
            case 'billing': return { from: '#22c55e', to: '#16a34a' };
            case 'spam': return { from: '#6b7280', to: '#4b5563' };
            default: return { from: '#a855f7', to: '#9333ea' };
        }
    };

    const colors = getCategoryColor(email.category);

    useEffect(() => {
        if (emailRef.current && targetRef.current) {
            const emailRect = emailRef.current.getBoundingClientRect();
            const targetRect = targetRef.current.getBoundingClientRect();

            setPosition({
                x: targetRect.left - emailRect.left + (targetRect.width / 2) - (emailRect.width / 2), 
                y: targetRect.top - emailRect.top + (targetRect.height / 2) - (emailRect.height / 2), 
                opacity: 0 
            });

            const timer = setTimeout(() => {
                onComplete(email.id);
                onCountUpdate(email.category);
            }, 1200); 
            return () => clearTimeout(timer);
        }
    }, [email.id, targetRef, onComplete, onCountUpdate, email.category]);

    return (
        <motion.div
            ref={emailRef}
            className="absolute z-50 p-3 rounded-lg text-xs text-white shadow-2xl whitespace-nowrap border border-white/20 backdrop-blur-sm"
            style={{
                background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
            }}
            initial={{ 
                opacity: 1, 
                scale: 1, 
                rotate: 0,
                filter: 'blur(0px) brightness(1)',
            }} 
            animate={{
                x: position.x,
                y: position.y,
                opacity: [1, 1, 0.8, position.opacity],
                scale: [1, 1.1, 0.4, 0.3],
                rotate: [0, 5, -5, 0],
                filter: ['blur(0px) brightness(1)', 'blur(1px) brightness(1.3)', 'blur(2px) brightness(1.5)', 'blur(3px) brightness(2)'],
            }}
            transition={{
                duration: 1.2,
                ease: [0.4, 0, 0.2, 1],
                times: [0, 0.3, 0.7, 1],
            }}
        >
            {/* Sparkle trail effect */}
            <motion.div
                className="absolute -inset-2 rounded-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                    opacity: [0, 0.6, 0],
                    scale: [0.8, 1.2, 1.5],
                }}
                transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    repeatDelay: 0.1,
                }}
                style={{
                    background: `radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)`,
                }}
            />
            
            <div className="relative z-10 flex items-center gap-2">
                <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 1.2, ease: "linear" }}
                >
                    <Tag className="h-3 w-3" />
                </motion.div>
                <span className="font-semibold truncate max-w-[200px]">{email.subject}</span>
            </div>

            {/* Glowing trail */}
            <motion.div
                className="absolute inset-0 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ 
                    opacity: [0, 0.8, 0],
                    scale: [1, 1.3, 1.6],
                }}
                transition={{
                    duration: 1.2,
                    ease: "easeOut",
                }}
                style={{
                    background: `radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)`,
                    filter: 'blur(8px)',
                }}
            />
        </motion.div>
    )
}

export function Inbox({ onSelectEmail, isAutomationActive, onStartAutomation, onStopAutomation }: InboxProps) {
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const [filteredEmails, setFilteredEmails] = useState<Email[]>(mockEmails);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filters, setFilters] = useState<EmailCategory[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedEmailForAction, setSelectedEmailForAction] = useState<Email | null>(null);
  const [processingEmailId, setProcessingEmailId] = useState<string | null>(null);
  const [animatedEmails, setAnimatedEmails] = useState<Email[]>([]);
  const [processedEmailCounts, setProcessedEmailCounts] = useState<Record<EmailCategory, number>>({
    'leads': 0,
    'support': 0,
    'marketing': 0,
    'billing': 0,
    'priority': 0,
    'spam': 0,
  });
  const [generatedEmails, setGeneratedEmails] = useState<Array<{ id: string; to: string; subject: string; body: string; sent: boolean }>>([]);
  const [deletedSpamCount, setDeletedSpamCount] = useState(0);
  const [deletingSpamId, setDeletingSpamId] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [organizedEmails, setOrganizedEmails] = useState<Record<EmailCategory, Email[]>>({
    'leads': [],
    'support': [],
    'marketing': [],
    'billing': [],
    'priority': [],
    'spam': [],
  });
  
  const categoryRefs = {
    'leads': useRef<HTMLDivElement>(null),
    'support': useRef<HTMLDivElement>(null),
    'marketing': useRef<HTMLDivElement>(null),
    'billing': useRef<HTMLDivElement>(null),
    'priority': useRef<HTMLDivElement>(null),
    'spam': useRef<HTMLDivElement>(null),
  };

  const dict = getDictionary('en'); 
  const { toast } = useToast();

  // Debug: Log when automation state changes
  useEffect(() => {
    console.log('📊 Inbox - isAutomationActive changed:', isAutomationActive);
  }, [isAutomationActive]);

  const swipeThreshold = 100; 
  const currentX = useRef(0);
  const swipeActionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const swipeStates = useRef<{ [key: string]: { showActions: boolean } }>({});
  
  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const startX = useRef(0);

  const applyFilters = useCallback(() => {
    let updatedEmails = emails;

    if (searchTerm) {
      updatedEmails = updatedEmails.filter(
        (email) =>
          email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.sender.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.length > 0) {
      updatedEmails = updatedEmails.filter((email) =>
        filters.some((filter) => email.category === filter || email.labels.includes(filter as any))
      );
    }

    setFilteredEmails(updatedEmails);
  }, [emails, searchTerm, filters]);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters, emails, applyFilters]);

  // Generate email reply for customer
  const generateCustomerEmail = async (email: Email) => {
    try {
      const res = await fetch('/api/demo/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          tone: 'Professional', 
          snippets: [] 
        }),
      });
      const data = await res.json();
      if (data.variants && data.variants.length > 0) {
        const generatedEmail = {
          id: `generated-${Date.now()}`,
          to: email.sender,
          subject: `Re: ${email.subject}`,
          body: data.variants[0].text,
          sent: false,
        };
        setGeneratedEmails(prev => [...prev, generatedEmail]);
        
        // Simulate sending after a delay
        setTimeout(() => {
          setGeneratedEmails(prev => 
            prev.map(e => e.id === generatedEmail.id ? { ...e, sent: true } : e)
          );
          toast({
            title: "Email Sent",
            description: `Reply sent to ${email.sender}`,
          });
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to generate email:", error);
    }
  };

  // Reset emails when automation starts
  const hasResetRef = useRef(false);
  useEffect(() => {
    if (isAutomationActive && !showResults && !hasResetRef.current) {
      // Always reset emails when automation starts
      console.log('🔄 Resetting emails for automation...', isAutomationActive);
      const resetEmails = mockEmails.map(e => ({ ...e, read: false }));
      setEmails(resetEmails);
      setFilteredEmails(resetEmails);
      setAnimatedEmails([]);
      setProcessedEmailCounts({
        'leads': 0,
        'support': 0,
        'marketing': 0,
        'billing': 0,
        'priority': 0,
        'spam': 0,
      });
      setDeletedSpamCount(0);
      setGeneratedEmails([]);
      setOrganizedEmails({
        'leads': [],
        'support': [],
        'marketing': [],
        'billing': [],
        'priority': [],
        'spam': [],
      });
      setShowResults(false);
      setProcessingEmailId(null);
      setDeletingSpamId(null);
      hasResetRef.current = true;
      console.log('✅ Emails reset complete. Total unread:', resetEmails.length);
    }
    if (!isAutomationActive) {
      hasResetRef.current = false;
    }
  }, [isAutomationActive, showResults]);

  // Use refs to track latest state for the processing loop
  const emailsRef = useRef(emails);
  const animatedEmailsRef = useRef(animatedEmails);
  const isAutomationActiveRef = useRef(isAutomationActive);
  const showResultsRef = useRef(showResults);
  const processingEmailIdRef = useRef(processingEmailId);

  useEffect(() => {
    emailsRef.current = emails;
  }, [emails]);

  useEffect(() => {
    animatedEmailsRef.current = animatedEmails;
  }, [animatedEmails]);

  useEffect(() => {
    isAutomationActiveRef.current = isAutomationActive;
  }, [isAutomationActive]);

  useEffect(() => {
    showResultsRef.current = showResults;
  }, [showResults]);

  useEffect(() => {
    processingEmailIdRef.current = processingEmailId;
  }, [processingEmailId]);

  // Main automation processing loop - processes one email at a time
  useEffect(() => {
    // Don't process if automation is not active or results are showing
    if (!isAutomationActive || showResults) {
      return;
    }
    
    // Don't process if already processing an email
    if (processingEmailId) {
      return;
    }

    let timers: NodeJS.Timeout[] = [];
    let isCancelled = false;

    // Use refs to get latest values
    const currentEmails = emailsRef.current;
    const currentAnimated = animatedEmailsRef.current;
    const unprocessedEmails = currentEmails.filter(e => !e.read && !currentAnimated.some(ae => ae.id === e.id));
    
    console.log('🤖 Automation check:', {
      isAutomationActive: isAutomationActiveRef.current,
      processingEmailId,
      showResults: showResultsRef.current,
      totalEmails: currentEmails.length,
      unprocessedCount: unprocessedEmails.length,
      readEmails: currentEmails.filter(e => e.read).length,
      animatedCount: currentAnimated.length
    });

    // Check if all emails are processed
    const allProcessed = currentEmails.filter(e => !e.read).length === 0;
    const allAnimationsComplete = currentAnimated.length === 0;
    
    if (allProcessed && allAnimationsComplete && currentEmails.some(e => e.read)) {
      // Show results when all emails are processed
      console.log('✅ All emails processed, showing results...');
      const resultsTimer = setTimeout(() => {
        if (isCancelled || !isAutomationActiveRef.current) return;
        // Organize emails by category
        const organized: Record<EmailCategory, Email[]> = {
          'leads': [],
          'support': [],
          'marketing': [],
          'billing': [],
          'priority': [],
          'spam': [],
        };
        
        emailsRef.current.forEach(email => {
          if (email.read && email.category) {
            if (email.category === 'leads' && email.priorityScore > 85) {
              organized['priority'].push(email);
            } else if (email.category !== 'spam') {
              organized[email.category].push(email);
            }
          }
        });
        
        console.log('📊 Organized emails:', organized);
        setOrganizedEmails(organized);
        setShowResults(true);
        // Stop automation to show results
        if (onStopAutomation) onStopAutomation();
      }, 2000);
      timers.push(resultsTimer);
      return () => {
        isCancelled = true;
        timers.forEach(timer => clearTimeout(timer));
      };
    }

    // Process next email if available
    if (unprocessedEmails.length > 0) {
      const emailToProcess = unprocessedEmails[0];
      console.log('📧 Starting to process email:', emailToProcess.subject, 'Category:', emailToProcess.category);
      setProcessingEmailId(emailToProcess.id);

      // Initial delay before processing
      const timer1 = setTimeout(() => {
        if (isCancelled || !isAutomationActiveRef.current) return;
        // Classification delay
        const timer2 = setTimeout(async () => {
          if (isCancelled || !isAutomationActiveRef.current) return;
          // Simulate AI processing
          await new Promise(resolve => setTimeout(resolve, 300)); 

          const simulatedCategory: EmailCategory = (emailToProcess.category === 'leads' && emailToProcess.priorityScore > 85) ? 'priority' : emailToProcess.category;
          const targetRef = categoryRefs[simulatedCategory];

          // Handle spam deletion with animation
          if (simulatedCategory === 'spam') {
            setDeletingSpamId(emailToProcess.id);
            const spamTimer = setTimeout(() => {
              if (isCancelled || !isAutomationActiveRef.current) return;
              setEmails(prev => prev.filter(e => e.id !== emailToProcess.id));
              setDeletedSpamCount(prev => prev + 1);
              setDeletingSpamId(null);
              setProcessingEmailId(null);
              toast({
                title: "Spam Deleted",
                description: `Removed spam email from ${emailToProcess.sender}`,
              });
            }, 1200);
            timers.push(spamTimer);
            return;
          }

          // Generate and send email for high-priority leads
          if ((simulatedCategory === 'leads' || simulatedCategory === 'priority') && emailToProcess.priorityScore > 80) {
            const emailGenTimer = setTimeout(() => {
              if (isCancelled || !isAutomationActiveRef.current) return;
              generateCustomerEmail(emailToProcess);
            }, 800);
            timers.push(emailGenTimer);
          }

          // Add to animated emails for visual animation
          if (targetRef && targetRef.current) {
            setAnimatedEmails(prev => [...prev, { ...emailToProcess, category: simulatedCategory }]);
          }

          // Mark email as read and categorized
          setEmails(prev => 
            prev.map(e => 
              e.id === emailToProcess.id ? { ...e, read: true, category: simulatedCategory } : e
            )
          );
          
          // Clear processing flag after animation delay - this will trigger useEffect again
          const clearTimer = setTimeout(() => {
            if (isCancelled || !isAutomationActiveRef.current) return;
            setProcessingEmailId(null);
          }, 2000);
          timers.push(clearTimer);
        }, 500);
        timers.push(timer2);
      }, 200);
      timers.push(timer1);
    }

    return () => {
      isCancelled = true;
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [isAutomationActive, emails, processingEmailId, animatedEmails, showResults, onStopAutomation, toast]);

  const handleAnimationComplete = (id: string) => {
    setAnimatedEmails(prev => {
      const filtered = prev.filter(email => email.id !== id);
      console.log('✨ Animation complete for email:', id, 'Remaining animated:', filtered.length);
      return filtered;
    });
  };

  const handleCountUpdate = (category: EmailCategory) => {
    setProcessedEmailCounts(prev => ({
      ...prev,
      [category]: (prev[category] || 0) + 1
    }));
    const categoryBin = categoryRefs[category as keyof typeof categoryRefs].current;
    if (categoryBin) {
        gsap.to(categoryBin, { scale: 1.1, duration: 0.1, yoyo: true, repeat: 1, ease: "power1.out" });
    }
  };

  const handleAssign = (id: string, team: string) => {
    setEmails(prev => prev.map(email => email.id === id ? { ...email, assignedTo: team } : email));
    toast({
      title: dict.inbox.toastAssignedTitle,
      description: dict.inbox.toastAssignedDescription(team),
    });
    setShowAssignDialog(false);
  };

  const handleArchive = (id: string) => {
    setEmails(prev => prev.map(email => email.id === id ? { ...email, archived: true } : email));
    toast({
      title: dict.inbox.toastArchivedTitle,
      description: dict.inbox.toastArchivedDescription,
    });
  };

  const handleSnooze = (id: string) => {
    setEmails(prev => prev.map(email => email.id === id ? { ...email, snoozed: true } : email));
    toast({
      title: dict.inbox.toastSnoozedTitle,
      description: dict.inbox.toastSnoozedDescription,
    });
  };

  const handleFilterToggle = (category: EmailCategory) => {
    setFilters((prev) =>
      prev.includes(category) ? prev.filter((f) => f !== category) : [...prev, category]
    );
  };

  const handleTouchStart = (e: React.TouchEvent, id: string) => {
    if (isAutomationActive) return;
    startX.current = e.touches[0].clientX;
    currentX.current = startX.current; 
    const item = itemRefs.current[id];
    if (item) item.style.transition = 'none'; 
  };

  const handleTouchMove = (e: React.TouchEvent, id: string) => {
    if (isAutomationActive) return;
    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - startX.current;
    const item = itemRefs.current[id];

    if (item) {
      item.style.transform = `translateX(${diff}px)`;
      const showActions = Math.abs(diff) > 50; 
      if (swipeActionRefs.current[id]) {
          swipeActionRefs.current[id]!.style.opacity = showActions ? '1' : '0';
          swipeActionRefs.current[id]!.style.transform = `translateX(${showActions ? '0px' : '20px'})`;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent, id: string) => {
    if (isAutomationActive) return;
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX.current;
    const item = itemRefs.current[id];

    if (item) item.style.transition = 'transform 0.3s ease-out'; 

    if (diff > swipeThreshold) {
      handleArchive(id);
    } else if (diff < -swipeThreshold) {
      handleSnooze(id);
    } else {
      if (item) item.style.transform = 'translateX(0px)';
    }
    if (swipeActionRefs.current[id]) {
        swipeActionRefs.current[id]!.style.opacity = '0';
        swipeActionRefs.current[id]!.style.transform = 'translateX(20px)';
    }
  };

  const handlePullToRefresh = async () => {
    if (isAutomationActive) return;
    toast({
      title: dict.inbox.toastRefreshTitle,
            description: dict.inbox.toastRefreshDescription,
    });
    await new Promise(resolve => setTimeout(resolve, 1500));
    setEmails(mockEmails.map(email => ({ ...email, read: false, archived: false, snoozed: false })));
    setFilters([]);
    setSearchTerm('');
    setShowResults(false);
    setOrganizedEmails({
      'leads': [],
      'support': [],
      'marketing': [],
      'billing': [],
      'priority': [],
      'spam': [],
    });
    setProcessedEmailCounts({
      'leads': 0,
      'support': 0,
      'marketing': 0,
      'billing': 0,
      'priority': 0,
      'spam': 0,
    });
    setDeletedSpamCount(0);
    setGeneratedEmails([]);
    toast({
      title: dict.inbox.toastRefreshedTitle,
      description: dict.inbox.toastRefreshedDescription,
    });
  };

  const handleResetResults = () => {
    setShowResults(false);
    setEmails(mockEmails.map(e => ({ ...e, read: false }))); 
    setAnimatedEmails([]);
    setProcessedEmailCounts({
      'leads': 0,
      'support': 0,
      'marketing': 0,
      'billing': 0,
      'priority': 0,
      'spam': 0,
    });
    setDeletedSpamCount(0);
    setGeneratedEmails([]);
    setOrganizedEmails({
      'leads': [],
      'support': [],
      'marketing': [],
      'billing': [],
      'priority': [],
      'spam': [],
    });
    setProcessingEmailId(null);
    setDeletingSpamId(null);
    // Ensure automation is stopped
    if (onStopAutomation) onStopAutomation();
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 relative">
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <h2 className="text-2xl font-bold text-white">Inbox</h2>
        <div className="flex items-center space-x-2">
          {!isAutomationActive && onStartAutomation && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  onClick={onStartAutomation}
                  size="sm"
                  className="bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 hover:from-red-700 hover:via-purple-700 hover:to-blue-700 text-white font-semibold px-4 py-2 rounded-full shadow-lg relative overflow-hidden group"
                  style={{
                    boxShadow: '0 0 20px rgba(239, 68, 68, 0.4), 0 0 40px rgba(147, 51, 234, 0.3)',
                  }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-red-600 via-purple-600 to-blue-600"
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{
                      backgroundSize: '200% 200%',
                    }}
                  />
                  <span className="relative z-10 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span>Automate</span>
                  </span>
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  aria-label="Toggle filters"
                  className="text-slate-400 hover:text-white"
                >
                  <Filter className="h-5 w-5" />
                </Button>
              </motion.div>
            </>
          )}
          {isAutomationActive && onStopAutomation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                onClick={onStopAutomation}
                size="sm"
                variant="outline"
                className="bg-slate-800/90 backdrop-blur-md border-red-500/50 text-red-400 hover:bg-slate-700/90 hover:text-red-300 font-semibold px-4 py-2 rounded-full"
              >
                <Pause className="h-4 w-4 mr-2" />
                Stop
              </Button>
            </motion.div>
          )}
          <Button variant="ghost" size="sm" aria-label="More options" className="text-slate-400 hover:text-white">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {!isAutomationActive && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: showFilters ? 1 : 0, height: showFilters ? "auto" : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="p-4 border-b border-slate-700">
            <Input
              type="text"
              placeholder={dict.inbox.searchPlaceholder}
              className="w-full bg-slate-800 border-slate-700 text-white placeholder-slate-500 mb-3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              {EMAIL_CATEGORIES.map((category) => (
                <Badge
                  key={category}
                  variant={filters.includes(category) ? "default" : "outline"}
                  className={`cursor-pointer ${
                    filters.includes(category)
                      ? "bg-red-600 text-white border-red-700"
                      : "bg-slate-700/50 text-slate-300 border-slate-600 hover:bg-slate-600"
                  }`}
                  onClick={() => handleFilterToggle(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Automation Status Banner */}
      {isAutomationActive && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mx-4 mt-2 mb-2 p-3 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-red-500/20 backdrop-blur-sm rounded-lg border border-blue-400/30"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <motion.div
              className="w-2 h-2 bg-green-400 rounded-full"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [1, 0.7, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <span className="text-sm font-semibold text-green-300">Automation Active</span>
            <motion.span
              className="text-xs text-slate-400"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Processing emails...
            </motion.span>
          </div>
          {/* Stats */}
          <div className="flex items-center justify-center gap-4 text-xs">
            {deletedSpamCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 text-red-400"
              >
                <Trash className="h-3 w-3" />
                <span>{deletedSpamCount} spam deleted</span>
              </motion.div>
            )}
            {generatedEmails.filter(e => e.sent).length > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 text-blue-400"
              >
                <Send className="h-3 w-3" />
                <span>{generatedEmails.filter(e => e.sent).length} emails sent</span>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* Results View - Shows organized emails after automation */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex-1 overflow-y-auto custom-scrollbar relative pb-28"
          >
            {/* Success Header */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mx-4 mt-4 mb-6 p-6 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl border border-green-400/30 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block mb-3"
              >
                <CheckCircle className="h-12 w-12 text-green-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">Automation Complete!</h3>
              <p className="text-slate-300 text-sm mb-4">
                Your inbox has been organized. {deletedSpamCount > 0 && `${deletedSpamCount} spam emails deleted.`} {generatedEmails.filter(e => e.sent).length > 0 && `${generatedEmails.filter(e => e.sent).length} replies sent.`}
              </p>
              <Button
                onClick={handleResetResults}
                variant="outline"
                size="sm"
                className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
              >
                Run Again
              </Button>
            </motion.div>

            {/* Organized Categories */}
            <div className="px-4 space-y-6 pb-6">
              {EMAIL_CATEGORIES.filter(cat => cat !== 'spam' && organizedEmails[cat].length > 0).map((category, catIndex) => {
                const categoryEmails = organizedEmails[category];
                const getCategoryColor = (cat: EmailCategory) => {
                  switch (cat) {
                    case 'priority': return { bg: 'from-yellow-500/20 to-yellow-600/20', border: 'border-yellow-500/40', text: 'text-yellow-400', icon: 'text-yellow-300' };
                    case 'leads': return { bg: 'from-red-500/20 to-red-600/20', border: 'border-red-500/40', text: 'text-red-400', icon: 'text-red-300' };
                    case 'support': return { bg: 'from-blue-500/20 to-blue-600/20', border: 'border-blue-500/40', text: 'text-blue-400', icon: 'text-blue-300' };
                    case 'billing': return { bg: 'from-green-500/20 to-green-600/20', border: 'border-green-500/40', text: 'text-green-400', icon: 'text-green-300' };
                    case 'marketing': return { bg: 'from-purple-500/20 to-purple-600/20', border: 'border-purple-500/40', text: 'text-purple-400', icon: 'text-purple-300' };
                    default: return { bg: 'from-slate-500/20 to-slate-600/20', border: 'border-slate-500/40', text: 'text-slate-400', icon: 'text-slate-300' };
                  }
                };
                const colors = getCategoryColor(category);
                const getCategoryIcon = (cat: EmailCategory) => {
                  switch (cat) {
                    case 'priority': return <Star className="h-5 w-5" />;
                    case 'leads': return <Mail className="h-5 w-5" />;
                    case 'support': return <MessageSquare className="h-5 w-5" />;
                    case 'billing': return <Tag className="h-5 w-5" />;
                    case 'marketing': return <Send className="h-5 w-5" />;
                    default: return <Mail className="h-5 w-5" />;
                  }
                };

                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: catIndex * 0.1 + 0.3 }}
                    className={`bg-gradient-to-br ${colors.bg} backdrop-blur-sm rounded-xl border-2 ${colors.border} p-4`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-slate-800/50 ${colors.icon}`}>
                          {getCategoryIcon(category)}
                        </div>
                        <div>
                          <h4 className={`text-lg font-bold ${colors.text} capitalize`}>{category}</h4>
                          <p className="text-xs text-slate-400">{categoryEmails.length} {categoryEmails.length === 1 ? 'email' : 'emails'}</p>
                        </div>
                      </div>
                      <Badge className={`${colors.border} ${colors.text} bg-slate-800/50`}>
                        {categoryEmails.length}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {categoryEmails.slice(0, 3).map((email, idx) => (
                        <motion.div
                          key={email.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: catIndex * 0.1 + idx * 0.05 + 0.4 }}
                          className="p-3 bg-slate-800/40 rounded-lg border border-slate-700/30 hover:border-slate-600/50 transition-colors cursor-pointer"
                          onClick={() => !isAutomationActive && onSelectEmail(email)}
                        >
                          <div className="flex items-start justify-between mb-1">
                            <span className="text-sm font-semibold text-white truncate flex-1">{email.sender}</span>
                            <span className="text-xs text-slate-400 ml-2">{email.time}</span>
                          </div>
                          <h5 className="text-sm text-white font-medium mb-1 truncate">{email.subject}</h5>
                          <p className="text-xs text-slate-400 line-clamp-2">{email.body}</p>
                          {email.labels.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {email.labels.slice(0, 2).map((label) => (
                                <Badge key={label} variant="outline" className="text-xs bg-slate-700/50 text-slate-300 border-slate-600">
                                  {label}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      ))}
                      {categoryEmails.length > 3 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: catIndex * 0.1 + 0.5 }}
                          className="text-center pt-2"
                        >
                          <span className="text-xs text-slate-400">
                            +{categoryEmails.length - 3} more {categoryEmails.length - 3 === 1 ? 'email' : 'emails'}
                          </span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`flex-1 overflow-y-auto custom-scrollbar relative pb-28 ${showResults ? 'hidden' : ''}`} onTouchEnd={handlePullToRefresh}>
        <AnimatePresence>
          {filteredEmails.length === 0 && !processingEmailId && (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-slate-400 mt-12"
            >
              <MailX className="h-12 w-12 mx-auto mb-4" />
              <p>No emails to display.</p>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div layout className="divide-y divide-slate-800">
          {filteredEmails.map((email) => (
            <AnimatePresence key={email.id}>
              {!email.read && (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ 
                    opacity: 0, 
                    x: processingEmailId === email.id ? -100 : deletingSpamId === email.id ? 300 : 0,
                    scale: deletingSpamId === email.id ? 0.3 : 1,
                    rotate: deletingSpamId === email.id ? 15 : 0,
                  }} 
                  transition={{ duration: deletingSpamId === email.id ? 0.8 : 0.3, ease: deletingSpamId === email.id ? "easeIn" : "easeOut" }}
                  className={`relative ${processingEmailId === email.id ? 'opacity-50 blur-sm pointer-events-none' : ''} ${deletingSpamId === email.id ? 'pointer-events-none' : ''}`}
                  style={{ touchAction: 'pan-y' }} 
                  onPanEnd={!isAutomationActive ? (e, info) => {
                      const item = itemRefs.current[email.id];
                      if (item) item.style.transition = 'transform 0.3s ease-out'; 

                      const diff = info.offset.x;

                      if (diff > swipeThreshold) {
                          handleArchive(email.id);
                      } else if (diff < -swipeThreshold) {
                          handleSnooze(email.id);
                      } else {
                          if (item) item.style.transform = 'translateX(0px)';
                      }
                      if (swipeActionRefs.current[email.id]) {
                          swipeActionRefs.current[email.id]!.style.opacity = '0';
                          swipeActionRefs.current[email.id]!.style.transform = 'translateX(20px)';
                      }
                  } : undefined}
                  onPan={(e, info) => {
                    if (isAutomationActive) return;
                    const item = itemRefs.current[email.id];
                    if (item) {
                        item.style.transform = `translateX(${info.offset.x}px)`;
                        const showActions = Math.abs(info.offset.x) > 50; 
                        if (swipeActionRefs.current[email.id]) {
                            swipeActionRefs.current[email.id]!.style.opacity = showActions ? '1' : '0';
                            swipeActionRefs.current[email.id]!.style.transform = `translateX(${showActions ? '0px' : '20px'})`;
                        }
                    }
                  }}
                  onPanStart={() => {
                    if (isAutomationActive) return;
                    const item = itemRefs.current[email.id];
                    if (item) item.style.transition = 'none'; 
                  }}
                >
                  <div
                    ref={(el) => { itemRefs.current[email.id] = el; }}
                    className={`relative p-4 hover:bg-slate-700 transition-colors ${email.read ? 'opacity-70' : 'font-semibold'}`}
                    onClick={() => !isAutomationActive && onSelectEmail(email)}
                    role="button"
                    aria-label={`Select email from ${email.sender} about ${email.subject}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-white flex items-center">
                          {email.priorityScore > 80 && <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />}
                          {email.sender}
                      </span>
                      <span className="text-xs text-slate-400">{email.time}</span>
                    </div>
                    <h4 className="text-base text-white truncate">{email.subject}</h4>
                    <p className="text-sm text-slate-400 truncate">{email.body}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {email.labels.map((label) => (
                        <Badge key={label} variant="outline" className="bg-slate-700/50 text-slate-300 border-slate-600">
                          <Tag className="h-3 w-3 mr-1" />{label}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {processingEmailId === email.id && (
                      <>
                          <motion.div
                              initial={{ width: '0%' }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 1.2, ease: "easeInOut" }}
                              className={`absolute bottom-0 left-0 h-1 ${
                                deletingSpamId === email.id 
                                  ? 'bg-gradient-to-r from-red-600 to-red-800' 
                                  : 'bg-gradient-to-r from-red-500 via-purple-500 to-blue-500'
                              }`}
                          />
                          {/* AI Processing indicator */}
                          {deletingSpamId === email.id ? (
                            <motion.div
                                className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-red-500/20 backdrop-blur-sm rounded-full border border-red-400/30"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                            >
                                <motion.div
                                    animate={{ 
                                        rotate: [0, 360],
                                        scale: [1, 1.2, 1],
                                    }}
                                    transition={{
                                        rotate: { duration: 0.8, repeat: Infinity, ease: "linear" },
                                        scale: { duration: 0.6, repeat: Infinity, ease: "easeInOut" },
                                    }}
                                >
                                    <Trash className="h-3 w-3 text-red-400" />
                                </motion.div>
                                <span className="text-xs text-red-300 font-medium">Deleting spam...</span>
                            </motion.div>
                          ) : (
                            <motion.div
                                className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-blue-500/20 backdrop-blur-sm rounded-full border border-blue-400/30"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                            >
                                <motion.div
                                    className="w-2 h-2 bg-blue-400 rounded-full"
                                    animate={{ 
                                        scale: [1, 1.2, 1],
                                        opacity: [0.7, 1, 0.7],
                                    }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                />
                                <span className="text-xs text-blue-300 font-medium">AI Processing...</span>
                            </motion.div>
                          )}
                      </>
                  )}

                  {!isAutomationActive && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <motion.div
                        ref={(el) => { swipeActionRefs.current[email.id] = el; }}
                        className="flex space-x-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 0, x: 20 }} 
                        transition={{ duration: 0.2 }}
                      >
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleArchive(email.id);
                          }}
                          aria-label="Archive email"
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSnooze(email.id);
                          }}
                          aria-label="Snooze email"
                        >
                          <Clock className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-slate-600 hover:bg-slate-700 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEmailForAction(email);
                            setShowAssignDialog(true);
                          }}
                          aria-label="Assign email"
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </motion.div>

        <AnimatePresence>
            {animatedEmails.map(email => (
                <AnimatedEmail 
                    key={email.id} 
                    email={email} 
                    targetRef={categoryRefs[email.category as keyof typeof categoryRefs] || categoryRefs.spam} 
                    onComplete={handleAnimationComplete} 
                    onCountUpdate={handleCountUpdate}
                />
            ))}
        </AnimatePresence>

      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-900/80 backdrop-blur-sm border-t border-slate-700 z-30 flex justify-around items-center text-center text-xs">
        {EMAIL_CATEGORIES.map((category) => (
            <motion.div
                key={category}
                ref={categoryRefs[category]}
                className="flex flex-col items-center space-y-1 w-1/6 p-1"
                initial={{ opacity: 0.7, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                <div 
                    className={`relative w-14 h-14 rounded-full flex items-center justify-center border-2 shadow-lg 
                                ${category === 'priority' ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400' :
                                  category === 'leads' ? 'border-red-500 bg-red-500/20 text-red-400' :
                                  category === 'support' ? 'border-blue-500 bg-blue-500/20 text-blue-400' :
                                  category === 'billing' ? 'border-green-500 bg-green-500/20 text-green-400' :
                                  category === 'spam' ? 'border-gray-500 bg-gray-500/20 text-gray-400' : 
                                  'border-slate-500 bg-slate-500/20 text-slate-400'}
                            `}>
                    {category === 'priority' && <Star className="h-6 w-6 fill-current" />}
                    {category === 'leads' && <Mail className="h-6 w-6" />}
                    {category === 'support' && <MessageSquare className="h-6 w-6" />}
                    {category === 'billing' && <Tag className="h-6 w-6" />}
                    {category === 'spam' && <Trash className="h-6 w-6" />}
                    <AnimatePresence>
                        {processedEmailCounts[category as EmailCategory] > 0 && (
                            <motion.span
                                key={processedEmailCounts[category as EmailCategory]}
                                initial={{ scale: 0, opacity: 0, y: -10 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0, opacity: 0, y: 10 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold border-2 border-slate-800"
                            >
                                {processedEmailCounts[category as EmailCategory]}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
                <span className="text-slate-400 capitalize text-xs mt-1">{category}</span>
            </motion.div>
        ))}
      </div>

      {/* Assign Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="bg-slate-800 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Assign Email</DialogTitle>
            <DialogDescription className="text-slate-400">
              Assign "{selectedEmailForAction?.subject}" to a team member.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button onClick={() => handleAssign(selectedEmailForAction!.id, 'Sales Team')}>Assign to Sales</Button>
            <Button onClick={() => handleAssign(selectedEmailForAction!.id, 'Support Team')}>Assign to Support</Button>
            <Button onClick={() => handleAssign(selectedEmailForAction!.id, 'Finance Team')}>Assign to Finance</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
