'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash, Wand2, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { getDictionary } from '@/lib/i18n';
import { Rule, RuleCondition, RuleAction, EmailCategory, Locale } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface RuleEditorProps {
  rule?: Rule; // Optional for editing existing rule
  onSave: (rule: Rule) => void;
  onCancel: () => void;
}

export function RuleEditor({ rule: initialRule, onSave, onCancel }: RuleEditorProps) {
  const [rule, setRule] = useState<Rule>(
    initialRule || {
      id: uuidv4(),
      name: '',
      isActive: true,
      conditions: [],
      actions: [],
    }
  );
  const dict = getDictionary('en');
  const { toast } = useToast();

  const handleAddCondition = () => {
    setRule((prev) => ({
      ...prev,
      conditions: [...prev.conditions, { field: 'sender', operator: 'contains', value: '' }],
    }));
  };

  const handleConditionChange = (index: number, field: keyof RuleCondition, value: any) => {
    setRule((prev) => {
      const newConditions = [...prev.conditions];
      newConditions[index] = { ...newConditions[index], [field]: value };
      return { ...prev, conditions: newConditions };
    });
  };

  const handleRemoveCondition = (index: number) => {
    setRule((prev) => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index),
    }));
  };

  const handleAddAction = () => {
    setRule((prev) => ({
      ...prev,
      actions: [...prev.actions, { type: 'auto-reply', value: '' }],
    }));
  };

  const handleActionChange = (index: number, field: keyof RuleAction, value: any) => {
    setRule((prev) => {
      const newActions = [...prev.actions];
      newActions[index] = { ...newActions[index], [field]: value };
      return { ...prev, actions: newActions };
    });
  };

  const handleRemoveAction = (index: number) => {
    setRule((prev) => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    if (!rule.name.trim()) {
      toast({
        title: "Rule name is required",
        variant: "destructive",
      });
      return;
    }
    if (rule.conditions.length === 0 || rule.actions.length === 0) {
        toast({
            title: "Rule must have at least one condition and one action",
            variant: "destructive",
        });
        return;
    }
    onSave(rule);
  };

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
          <Wand2 className="h-6 w-6 mr-2 text-red-400" />{initialRule ? 'Edit Rule' : dict.rules.newRule}
        </h2>
        <Button variant="ghost" size="icon" onClick={onCancel} aria-label="Cancel">
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>

      <Card className="bg-slate-800 border-slate-700 p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <Label htmlFor="rule-name" className="text-white">Rule Name</Label>
          <Switch
            id="rule-active"
            checked={rule.isActive}
            onCheckedChange={(checked) => setRule((prev) => ({ ...prev, isActive: checked }))}
            aria-label="Toggle rule active status"
          />
        </div>
        <Input
          id="rule-name"
          placeholder="e.g., Categorize Sales Leads"
          value={rule.name}
          onChange={(e) => setRule((prev) => ({ ...prev, name: e.target.value }))}
          className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
          aria-label="Rule Name"
        />
      </Card>

      {/* Conditions */}
      <Card className="bg-slate-800 border-slate-700 p-4 mb-6">
        <h3 className="text-xl font-bold text-white mb-4">{dict.rules.if}</h3>
        <div className="space-y-4 mb-4">
          {rule.conditions.map((condition, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex flex-col sm:flex-row gap-2 items-center"
            >
              <Select
                value={condition.field}
                onValueChange={(value: RuleCondition['field']) =>
                  handleConditionChange(index, 'field', value)
                }
              >
                <SelectTrigger className="w-full sm:w-[150px] bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="sender">{dict.rules.sender}</SelectItem>
                  <SelectItem value="subject">{dict.rules.subject}</SelectItem>
                  <SelectItem value="body">{dict.rules.body}</SelectItem>
                  <SelectItem value="category">{dict.inbox.category}</SelectItem>
                  <SelectItem value="hasLabel">{dict.rules.hasLabel}</SelectItem>
                  <SelectItem value="age">{dict.rules.age}</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={condition.operator}
                onValueChange={(value: RuleCondition['operator']) =>
                  handleConditionChange(index, 'operator', value)
                }
              >
                <SelectTrigger className="w-full sm:w-[150px] bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  {(condition.field === 'age' ? [
                    { label: 'Less Than', value: 'less-than' },
                    { label: 'Greater Than', value: 'greater-than' },
                  ] : [
                    { label: 'Contains', value: 'contains' },
                    { label: 'Does Not Contain', value: 'not-contains' },
                    { label: 'Equals', value: 'equals' },
                    { label: 'Does Not Equal', value: 'not-equals' },
                  ]).map((op) => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {condition.field === 'category' ? (
                <Select
                  value={condition.value as EmailCategory}
                  onValueChange={(value: EmailCategory) =>
                    handleConditionChange(index, 'value', value)
                  }
                >
                  <SelectTrigger className="w-full sm:flex-1 bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    {[ 'leads', 'support', 'marketing', 'billing', 'priority', 'hr', 'legal'].map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type={condition.field === 'age' ? 'number' : 'text'}
                  placeholder="Value"
                  value={condition.value as string | number}
                  onChange={(e) => handleConditionChange(index, 'value', e.target.value)}
                  className="w-full sm:flex-1 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                />
              )}
              <Button variant="ghost" size="icon" onClick={() => handleRemoveCondition(index)} aria-label="Remove condition">
                <Trash className="h-4 w-4 text-red-500" />
              </Button>
            </motion.div>
          ))}
        </div>
        <Button variant="outline" onClick={handleAddCondition} className="w-full border-dashed border-slate-600 text-slate-300 hover:bg-slate-700">
          <Plus className="h-4 w-4 mr-2" />{dict.rules.addCondition}
        </Button>
      </Card>

      {/* Actions */}
      <Card className="bg-slate-800 border-slate-700 p-4 mb-6">
        <h3 className="text-xl font-bold text-white mb-4">{dict.rules.then}</h3>
        <div className="space-y-4 mb-4">
          {rule.actions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex flex-col sm:flex-row gap-2 items-center"
            >
              <Select
                value={action.type}
                onValueChange={(value: RuleAction['type']) => handleActionChange(index, 'type', value)}
              >
                <SelectTrigger className="w-full sm:w-[200px] bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="auto-reply">{dict.rules.autoReply}</SelectItem>
                  <SelectItem value="apply-label">{dict.rules.applyLabel}</SelectItem>
                  <SelectItem value="assign-teammate">{dict.rules.assignTeammate}</SelectItem>
                  <SelectItem value="snooze">{dict.rules.snooze}</SelectItem>
                  <SelectItem value="draft-follow-up">{dict.rules.draftFollowUp}</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Value (e.g., 'Welcome Template', 'Sales', '24')"
                value={action.value}
                onChange={(e) => handleActionChange(index, 'value', e.target.value)}
                className="w-full sm:flex-1 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
              />
              <Button variant="ghost" size="icon" onClick={() => handleRemoveAction(index)} aria-label="Remove action">
                <Trash className="h-4 w-4 text-red-500" />
              </Button>
            </motion.div>
          ))}
        </div>
        <Button variant="outline" onClick={handleAddAction} className="w-full border-dashed border-slate-600 text-slate-300 hover:bg-slate-700">
          <Plus className="h-4 w-4 mr-2" />{dict.rules.addAction}
        </Button>
      </Card>

      <div className="flex justify-end gap-3 mt-6">
        <Button variant="outline" onClick={onCancel} className="border-slate-600 text-slate-300 hover:bg-slate-700">
          {dict.rules.cancel}
        </Button>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
          {dict.rules.saveRule}
        </Button>
      </div>
    </motion.div>
  );
}
