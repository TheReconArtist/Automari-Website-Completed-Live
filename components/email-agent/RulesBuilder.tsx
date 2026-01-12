'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash, TestTube, ChevronRight, Wand2, Mail, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getDictionary } from '@/lib/i18n';
import { Rule, Email, Locale, RuleCondition, RuleAction } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';
import { agentStub } from '@/lib/agentStub';
import { RuleEditor } from './RuleEditor'; // Assuming RuleEditor is in the same directory
import { v4 as uuidv4 } from 'uuid';

const mockEmails = require('@/data/mock-inbox.json') as Email[];

const STARTER_RULES: Rule[] = [
  {
    id: uuidv4(),
    name: 'Auto-categorize Sales Leads',
    isActive: true,
    conditions: [
      { field: 'subject', operator: 'contains', value: 'partnership' },
      { field: 'body', operator: 'contains', value: 'inquiry' },
    ],
    actions: [{ type: 'apply-label', value: 'Sales Lead' }],
  },
  {
    id: uuidv4(),
    name: 'Snooze Marketing Emails',
    isActive: true,
    conditions: [
      { field: 'sender', operator: 'contains', value: 'marketing team' },
      { field: 'category', operator: 'equals', value: 'marketing' },
    ],
    actions: [{ type: 'snooze', value: '24' }],
  },
  {
    id: uuidv4(),
    name: 'Assign Urgent Support Tickets',
    isActive: true,
    conditions: [
      { field: 'subject', operator: 'contains', value: 'issue' },
      { field: 'priorityScore', operator: 'greater-than', value: 80 },
    ],
    actions: [{ type: 'assign-teammate', value: 'Support Team' }],
  },
];

export function RulesBuilder() {
  const [rules, setRules] = useState<Rule[]>(() => {
    if (typeof window !== 'undefined') {
      const savedRules = localStorage.getItem('automari-rules');
      return savedRules ? JSON.parse(savedRules) : STARTER_RULES;
    }
    return STARTER_RULES;
  });
  const [editingRule, setEditingRule] = useState<Rule | undefined>(undefined);
  const [showTestPanel, setShowTestPanel] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, Rule[]>>({});

  const dict = getDictionary('en');
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('automari-rules', JSON.stringify(rules));
  }, [rules]);

  const handleSaveRule = (newRule: Rule) => {
    setRules((prev) => {
      const existingIndex = prev.findIndex((r) => r.id === newRule.id);
      if (existingIndex > -1) {
        const updatedRules = [...prev];
        updatedRules[existingIndex] = newRule;
        return updatedRules;
      } else {
        return [...prev, newRule];
      }
    });
    setEditingRule(undefined);
    toast({
      title: dict.toasts.ruleSaved,
      duration: 2000,
    });
  };

  const handleDeleteRule = (id: string) => {
    setRules((prev) => prev.filter((rule) => rule.id !== id));
    toast({
      title: dict.toasts.ruleDeleted,
      duration: 2000,
    });
  };

  const handleTestRules = async () => {
    setShowTestPanel(true);
    const results: Record<string, Rule[]> = {};
    for (const email of mockEmails) {
      const matchingRules = await agentStub.evaluateRules(email, rules);
      if (matchingRules.length > 0) {
        results[email.id] = matchingRules;
      }
    }
    setTestResults(results);
  };

  if (editingRule) {
    return <RuleEditor rule={editingRule} onSave={handleSaveRule} onCancel={() => setEditingRule(undefined)} />;
  }

  return (
    <motion.div
      className="p-4 h-full overflow-y-auto custom-scrollbar bg-slate-900"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Wand2 className="h-6 w-6 mr-2 text-red-400" />{dict.rules.rulesBuilderTitle}
        </h2>
        <Button onClick={() => setEditingRule({ id: uuidv4(), name: '', isActive: true, conditions: [], actions: [] })} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />{dict.rules.newRule}
        </Button>
      </div>
      <p className="text-slate-400 mb-6">{dict.rules.rulesBuilderSubtitle}</p>

      <div className="space-y-4 mb-6">
        <AnimatePresence>
          {rules.length === 0 ? (
            <motion.div
              key="no-rules"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6 text-center text-slate-500"
            >
              <Wand2 className="h-12 w-12 mx-auto mb-4" />
              <p>No rules defined yet. Create your first automation rule!</p>
            </motion.div>
          ) : (
            rules.map((rule) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-slate-800 border-slate-700 p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white">{rule.name}</h3>
                    <p className={`text-sm ${rule.isActive ? 'text-green-400' : 'text-red-400'}`}>
                      {rule.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setEditingRule(rule)} aria-label={`Edit rule ${rule.name}`}>
                      <Edit className="h-4 w-4 text-slate-400 hover:text-white" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteRule(rule.id)} aria-label={`Delete rule ${rule.name}`}>
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <Card className="bg-slate-800 border-slate-700 p-4">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <TestTube className="h-5 w-5 mr-2 text-red-400" />{dict.rules.testPanel}
        </h3>
        <p className="text-slate-400 mb-4">{dict.rules.runOnSample}</p>
        <Button onClick={handleTestRules} disabled={rules.length === 0} className="w-full bg-red-600 hover:bg-red-700 text-white">
          <TestTube className="h-4 w-4 mr-2" />Run Test
        </Button>

        <Dialog open={showTestPanel} onOpenChange={setShowTestPanel}>
            <DialogContent className="bg-slate-800 text-white border-slate-700 max-w-lg md:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-white">Test Results</DialogTitle>
                    <DialogDescription className="text-slate-400">Showing which emails matched your rules.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {Object.keys(testResults).length === 0 ? (
                        <p className="text-center text-slate-400">No emails matched any active rules.</p>
                    ) : (
                        mockEmails.map((email) => (
                            <Card key={email.id} className="bg-slate-700/50 border-slate-600 p-3">
                                <div className="flex items-center space-x-2 mb-2">
                                    {testResults[email.id] ? (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-red-500" />
                                    )}
                                    <span className="font-bold text-white">{email.subject}</span>
                                </div>
                                {testResults[email.id] && (
                                    <div className="ml-7 text-sm text-slate-300">
                                        <p className="mb-1">{dict.rules.matches}:</p>
                                        <ul className="list-disc list-inside space-y-0.5">
                                            {testResults[email.id].map(rule => (
                                                <li key={rule.id}>
                                                    <span className="font-medium text-blue-300">{rule.name}</span>: 
                                                    {rule.actions.map(action => {
                                                        let actionText = '';
                                                        switch (action.type) {
                                                            case 'auto-reply': actionText = `Auto-reply with '${action.value}'`; break;
                                                            case 'apply-label': actionText = `Apply label '${action.value}'`; break;
                                                            case 'assign-teammate': actionText = `Assign to '${action.value}'`; break;
                                                            case 'snooze': actionText = `Snooze for ${action.value} hours`; break;
                                                            case 'draft-follow-up': actionText = `Draft follow-up: '${action.value}'`; break;
                                                            default: actionText = action.value;
                                                        }
                                                        return actionText;
                                                    }).join('; ')}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </Card>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>

      </Card>
    </motion.div>
  );
}
