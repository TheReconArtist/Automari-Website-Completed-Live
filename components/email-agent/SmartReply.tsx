'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Sparkles, Wand2, Edit, MessageSquare, Send } from 'lucide-react';
import { getDictionary } from '@/lib/i18n';
import { EmailTone, AiDraftReply, Locale } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';

export function SmartReply() {
  const [emailContent, setEmailContent] = useState('');
  const [generatedReplies, setGeneratedReplies] = useState<AiDraftReply | null>(null);
  const [selectedTone, setSelectedTone] = useState<EmailTone>('Professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [editReplyId, setEditReplyId] = useState<number | null>(null);
  const [editedReplyText, setEditedReplyText] = useState('');

  const dict = getDictionary('en');
  const { toast } = useToast();

  const handleGenerateReplies = async () => {
    if (!emailContent.trim()) return;

    setIsGenerating(true);
    setGeneratedReplies(null);
    setEditReplyId(null);
    setEditedReplyText('');

    try {
      // This would ideally classify the email first, then draft a reply
      // For demo simplicity, we'll mock an email object to send to the draft API
      const mockEmail = {
        id: 'temp-smart-reply',
        sender: 'Mock Sender',
        subject: 'Smart Reply Request',
        body: emailContent,
        time: new Date().toISOString(),
        read: true,
        category: 'support',
        labels: [],
        priorityScore: 50,
      };

      const res = await fetch('/api/demo/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: mockEmail, tone: selectedTone, snippets: [] }),
      });
      const data: AiDraftReply = await res.json();
      setGeneratedReplies(data);
    } catch (error) {
      console.error("Failed to generate smart replies:", error);
      toast({
        title: dict.common.error,
        description: "Failed to generate smart replies.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyReply = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: dict.toasts.replyCopied,
      duration: 2000,
    });
  };

  const handleInsertToDraft = (text: string) => {
    // In a real app, this would insert into an active draft
    toast({
      title: dict.toasts.replyInserted,
      description: "(Simulated: Would insert into an active draft elsewhere)",
      duration: 3000,
    });
  };

  return (
    <motion.div
      className="p-4 h-full overflow-y-auto custom-scrollbar bg-slate-900"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
        <MessageSquare className="h-6 w-6 mr-2 text-blue-400" />{dict.smartReply.playgroundTitle}
      </h2>
      <p className="text-slate-400 mb-6">{dict.smartReply.playgroundSubtitle}</p>

      <Card className="bg-slate-800 border-slate-700 p-4 mb-6">
        <Textarea
          placeholder={dict.smartReply.pasteEmail}
          className="w-full bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 mb-4 min-h-[150px]"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          aria-label={dict.smartReply.pasteEmail}
        />
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <Select value={selectedTone} onValueChange={(value: EmailTone) => setSelectedTone(value)}>
            <SelectTrigger className="w-full sm:w-[180px] bg-slate-700/50 border-slate-600 text-white">
              <SelectValue placeholder={dict.thread.tone} />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
              <SelectItem value="Professional">{dict.thread.professional}</SelectItem>
              <SelectItem value="Friendly">{dict.thread.friendly}</SelectItem>
              <SelectItem value="Brief">{dict.thread.brief}</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleGenerateReplies}
            disabled={isGenerating || !emailContent.trim()}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isGenerating ? (
              <span className="flex items-center"><Sparkles className="h-4 w-4 mr-2 animate-pulse" />{dict.smartReply.typingAnimation}</span>
            ) : (
              <span className="flex items-center"><Wand2 className="h-4 w-4 mr-2" />{dict.smartReply.generateReplies}</span>
            )}
          </Button>
        </div>
      </Card>

      <AnimatePresence mode="wait">
        {generatedReplies && generatedReplies.variants.length > 0 && (
          <motion.div
            key="replies"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-white flex items-center"><Sparkles className="h-5 w-5 mr-2" />Generated Replies:</h3>
            {generatedReplies.variants.map((reply, index) => (
              <Card key={index} className="bg-slate-800 border-slate-700 p-4">
                {editReplyId === index ? (
                  <Textarea
                    value={editedReplyText}
                    onChange={(e) => setEditedReplyText(e.target.value)}
                    className="w-full bg-slate-700/50 border-slate-600 text-white mb-3 min-h-[80px]"
                  />
                ) : (
                  <p className="text-slate-300 whitespace-pre-wrap mb-3">{reply.text}</p>
                )}
                <div className="flex flex-wrap gap-2 text-sm text-slate-400 mb-3">
                  <span>{reply.tokens} tokens</span>
                  <span>• Est. send: {reply.estimatedSendTime}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {editReplyId === index ? (
                    <Button variant="outline" onClick={() => setEditReplyId(null)} className="border-slate-600 text-slate-300 hover:bg-slate-700">
                      {dict.rules.cancel}
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={() => { setEditReplyId(index); setEditedReplyText(reply.text); }} className="border-slate-600 text-slate-300 hover:bg-slate-700">
                      <Edit className="h-4 w-4 mr-2" />{dict.smartReply.edit}
                    </Button>
                  )}
                  <Button onClick={() => handleCopyReply(editReplyId === index ? editedReplyText : reply.text)} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Copy className="h-4 w-4 mr-2" />{dict.smartReply.copy}
                  </Button>
                  <Button variant="secondary" onClick={() => handleInsertToDraft(editReplyId === index ? editedReplyText : reply.text)} className="bg-red-600 hover:bg-red-700 text-white">
                    <Send className="h-4 w-4 mr-2" />{dict.smartReply.insertToDraft}
                  </Button>
                </div>
              </Card>
            ))}
          </motion.div>
        )}

        {!isGenerating && generatedReplies === null && emailContent.trim() && (
            <motion.div
                key="no-replies-yet"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center text-slate-500 py-10"
            >
                <Wand2 className="h-12 w-12 mx-auto mb-4" />
                <p>Paste an email and generate smart replies!</p>
            </motion.div>
        )}

        {isGenerating && (
            <motion.div
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-blue-400 py-10"
            >
                <Sparkles className="h-12 w-12 mx-auto mb-4 animate-pulse" />
                <p className="text-lg">{dict.smartReply.typingAnimation}</p>
            </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
}
