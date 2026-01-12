'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, User, Sparkles, Tag, Reply, Archive, Trash, Edit, Clock, MailPlus, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getDictionary } from '@/lib/i18n';
import { Email, EmailTone, AiClassification, AiDraftReply, Locale } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';

interface ThreadProps {
  email: Email;
  onBack: () => void;
  isAutomationActive: boolean;
}

export function Thread({ email, onBack, isAutomationActive }: ThreadProps) {
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([]);
  const [priorityScore, setPriorityScore] = useState<number | null>(null);
  const [draftReplyText, setDraftReplyText] = useState<string>('');
  const [selectedTone, setSelectedTone] = useState<EmailTone>('Professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentAiAction, setCurrentAiAction] = useState<string | null>(null);

  const dict = getDictionary('en');
  const { toast } = useToast();

  useEffect(() => {
    if (!isAutomationActive) return; // Only run automation in live demo mode

    const runAutomationSequence = async () => {
      setCurrentAiAction("AI is analyzing email...");
      setIsGenerating(true);
      try {
        const res = await fetch('/api/demo/classify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data: AiClassification = await res.json();
        setAiSummary(data.summary);
        setSuggestedReplies(data.suggestedActions);
        setPriorityScore(data.priorityScore);
        setCurrentAiAction("Email classified and prioritized!");

        // Simulate drafting reply
        await new Promise(resolve => setTimeout(resolve, 1500));
        setCurrentAiAction("Drafting intelligent reply...");

        const draftRes = await fetch('/api/demo/draft', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, tone: 'Professional', snippets: [] }),
        });
        const draftData: AiDraftReply = await draftRes.json();
        if (draftData.variants && draftData.variants.length > 0) {
            setDraftReplyText(draftData.variants[0].text);
        }
        setCurrentAiAction("Reply drafted and ready!");

        // Simulate action (e.g., sending reply, archiving)
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCurrentAiAction("Performing automated action...");

        toast({
            title: "Automated action complete!",
            description: `Email from ${email.sender} processed and replied.`, 
            duration: 3000,
        });

        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (error) {
        console.error("Automation sequence failed:", error);
        toast({
          title: dict.common.error,
          description: "Automation sequence encountered an issue.",
          variant: "destructive",
        });
      } finally {
        setIsGenerating(false);
        // Automatically go back to inbox to process next email in demo mode
        onBack(); 
      }
    };

    runAutomationSequence();

  }, [email, isAutomationActive, dict.common.error, onBack, toast]);

  // When not in automation mode, keep existing functionality for manual interaction
  useEffect(() => {
    if (isAutomationActive) return; // Don't run if automation is active

    const fetchClassification = async () => {
        setIsGenerating(true);
        try {
          const res = await fetch('/api/demo/classify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          });
          const data: AiClassification = await res.json();
          setAiSummary(data.summary);
          setSuggestedReplies(data.suggestedActions);
          setPriorityScore(data.priorityScore);
        } catch (error) {
          console.error("Failed to classify email:", error);
          toast({
            title: dict.common.error,
            description: "Failed to get AI classification.",
            variant: "destructive",
          });
        } finally {
          setIsGenerating(false);
        }
      };
  
      fetchClassification();
  }, [email, dict.common.error, toast, isAutomationActive]);

  const handleGenerateReply = async () => {
    setIsGenerating(true);
    setDraftReplyText('');
    try {
      const res = await fetch('/api/demo/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, tone: selectedTone, snippets: [] }), // No snippets for now
      });
      const data: AiDraftReply = await res.json();
      if (data.variants && data.variants.length > 0) {
        setDraftReplyText(data.variants[0].text);
      }
    } catch (error) {
      console.error("Failed to draft reply:", error);
      toast({
        title: dict.common.error,
        description: "Failed to generate AI reply.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInsertSnippet = (snippet: string) => {
    setDraftReplyText((prev) => `${prev}\n\n${snippet}`);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Thread Header */}
      <motion.div
        className="p-4 bg-slate-800 border-b border-slate-700 flex items-center gap-3"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Button variant="ghost" size="icon" onClick={onBack} aria-label="Back to Inbox" disabled={isAutomationActive}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-semibold text-white truncate flex-1">{email.subject}</h2>
        {priorityScore !== null && (
          <Badge
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              priorityScore > 85 ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
            }`}
          >
            P: {priorityScore}
          </Badge>
        )}
      </motion.div>

      {/* AI Processing Indicator */}
      <AnimatePresence>
        {isGenerating && currentAiAction && (
          <motion.div
            key="ai-processing-indicator"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-3 bg-blue-600/20 text-blue-300 flex items-center justify-center space-x-2 text-sm font-medium border-b border-blue-500/30"
          >
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span>{currentAiAction}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email Content and AI Insights */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <Card className="bg-slate-800 border-slate-700 p-4 mb-6">
          <div className="flex items-center space-x-3 mb-3 text-slate-300">
            <User className="h-5 w-5" />
            <span className="font-medium">{email.sender}</span>
            <span className="text-sm text-slate-500">• {email.time}</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">{email.subject}</h3>
          <p className="text-slate-300 whitespace-pre-wrap">{email.body}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {email.labels.map((label) => (
              <Badge key={label} variant="outline" className="bg-slate-700/50 text-slate-300 border-slate-600">
                <Tag className="h-3 w-3 mr-1" />{label}
              </Badge>
            ))}
          </div>
        </Card>

        {/* AI Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: aiSummary ? 1 : 0, y: aiSummary ? 0 : 20 }}
          transition={{ duration: 0.5 }}
        >
          {aiSummary && (
            <Card className="bg-gradient-to-br from-blue-900/40 to-slate-800/40 border-blue-700/50 p-4 mb-6">
              <h4 className="font-bold text-blue-300 mb-2 flex items-center">
                <Sparkles className="h-4 w-4 mr-2" />{dict.thread.aiSummary}
              </h4>
              <p className="text-slate-200 text-sm">{aiSummary}</p>
            </Card>
          )}
        </motion.div>

        {/* Suggested Actions */}
        <AnimatePresence>
          {suggestedReplies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <h4 className="font-bold text-slate-300 mb-3 flex items-center">
                <Lightbulb className="h-4 w-4 mr-2" />{dict.thread.suggestedReplies}
              </h4>
              <div className="flex flex-wrap gap-2">
                {suggestedReplies.map((reply, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="border-blue-500/30 text-blue-300 hover:bg-blue-900/20 text-xs"
                    onClick={() => setDraftReplyText(reply)} // Simple click to insert
                    disabled={isAutomationActive}
                  >
                    {reply}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Draft Reply Panel */}
        <Card className="bg-slate-800 border-slate-700 p-4 sticky bottom-0 mt-6 md:mt-0">
          <h4 className="font-bold text-white mb-3 flex items-center"><Reply className="h-4 w-4 mr-2" />{dict.thread.draftReply}</h4>
          <Textarea
            placeholder="Draft your reply..."
            className="w-full bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 mb-3 min-h-[100px]"
            value={draftReplyText}
            onChange={(e) => setDraftReplyText(e.target.value)}
            aria-label="Draft email reply"
            disabled={isAutomationActive}
          />
          <div className="flex flex-col sm:flex-row gap-2 mb-3">
            <Select value={selectedTone} onValueChange={(value: EmailTone) => setSelectedTone(value)} disabled={isAutomationActive}>
              <SelectTrigger className="w-full sm:w-[180px] bg-slate-700/50 border-slate-600 text-white">
                <SelectValue placeholder={dict.thread.tone} />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="Professional">{dict.thread.professional}</SelectItem>
                <SelectItem value="Friendly">{dict.thread.friendly}</SelectItem>
                <SelectItem value="Brief">{dict.thread.brief}</SelectItem>
              </SelectContent>
            </Select>
            <div className="w-full sm:flex-1">
              <Select onValueChange={handleInsertSnippet} disabled={isAutomationActive}>
                <SelectTrigger className="w-full sm:w-[180px] bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder={dict.thread.insertSnippets} />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="Hello, thank you for reaching out. We will get back to you within 24 hours.">{dict.thread.faq}</SelectItem>
                  <SelectItem value="Our pricing details can be found on our website: [link to pricing]">{dict.thread.pricing}</SelectItem>
                  <SelectItem value="Please use this link to book a meeting with our team: [booking link]">{dict.thread.bookingLink}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleGenerateReply} disabled={isGenerating || isAutomationActive} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isGenerating ? dict.common.loading : dict.thread.replyWithAI}
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700" disabled={isAutomationActive}>
              <Tag className="h-4 w-4 mr-2" />{dict.thread.categorize}
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700" disabled={isAutomationActive}>
              <MailPlus className="h-4 w-4 mr-2" />{dict.thread.assign}
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700" disabled={isAutomationActive}>
              <Clock className="h-4 w-4 mr-2" />{dict.inbox.snooze}
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700" disabled={isAutomationActive}>
              <Edit className="h-4 w-4 mr-2" />{dict.thread.createRule}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
