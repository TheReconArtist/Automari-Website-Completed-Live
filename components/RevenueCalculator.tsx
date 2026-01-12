'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, DollarSign, Clock, Users, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export function RevenueCalculator() {
  const [dailyCalls, setDailyCalls] = useState(20);
  const [missedCallRate, setMissedCallRate] = useState(34);
  const [avgCallValue, setAvgCallValue] = useState(300);
  const [businessHours, setBusinessHours] = useState(8);

  const calculateRevenue = () => {
    const monthlyCalls = dailyCalls * 22; // Business days
    const missedCalls = Math.floor(monthlyCalls * (missedCallRate / 100));
    const potentialRevenue = missedCalls * avgCallValue;
    const annualRevenue = potentialRevenue * 12;
    
    return {
      monthlyCalls,
      missedCalls,
      potentialRevenue,
      annualRevenue,
      capturedRevenue: Math.floor(potentialRevenue * 0.85), // 85% capture rate
    };
  };

  const results = calculateRevenue();

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
          Calculate Your <span className="bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text text-transparent">Revenue Opportunity</span>
        </h2>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Discover how much revenue you're losing from missed opportunities and see what Automari can recover for your business.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-md border border-slate-600/30 p-8">
          <div className="space-y-6">
            <div>
              <Label className="text-white mb-2 block">Average Daily Calls</Label>
              <Input
                type="number"
                value={dailyCalls}
                onChange={(e) => setDailyCalls(Number(e.target.value))}
                className="bg-slate-700/50 border-slate-600 text-white"
                min="1"
              />
            </div>

            <div>
              <Label className="text-white mb-2 block">Missed Call Rate (%)</Label>
              <Input
                type="number"
                value={missedCallRate}
                onChange={(e) => setMissedCallRate(Number(e.target.value))}
                className="bg-slate-700/50 border-slate-600 text-white"
                min="0"
                max="100"
              />
              <p className="text-xs text-slate-400 mt-1">Industry average: 30-40%</p>
            </div>

            <div>
              <Label className="text-white mb-2 block">Average Call Value ($)</Label>
              <Input
                type="number"
                value={avgCallValue}
                onChange={(e) => setAvgCallValue(Number(e.target.value))}
                className="bg-slate-700/50 border-slate-600 text-white"
                min="1"
              />
              <p className="text-xs text-slate-400 mt-1">Revenue per converted call</p>
            </div>

            <div>
              <Label className="text-white mb-2 block">Business Hours Per Day</Label>
              <Input
                type="number"
                value={businessHours}
                onChange={(e) => setBusinessHours(Number(e.target.value))}
                className="bg-slate-700/50 border-slate-600 text-white"
                min="1"
                max="24"
              />
            </div>
          </div>
        </Card>

        {/* Results Section */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-red-600/20 to-blue-600/20 backdrop-blur-md border border-red-500/30 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">Monthly Opportunity</h3>
                <DollarSign className="h-8 w-8 text-red-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">
                ${results.potentialRevenue.toLocaleString()}
              </div>
              <p className="text-slate-300 text-sm">
                {results.missedCalls} missed calls × ${avgCallValue} avg value
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-blue-600/20 to-slate-600/20 backdrop-blur-md border border-blue-500/30 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">Annual Opportunity</h3>
                <TrendingUp className="h-8 w-8 text-blue-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">
                ${results.annualRevenue.toLocaleString()}
              </div>
              <p className="text-slate-300 text-sm">
                Potential revenue recovery per year
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-md border border-green-500/30 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">With Automari</h3>
                <Calculator className="h-8 w-8 text-green-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">
                ${results.capturedRevenue.toLocaleString()}/mo
              </div>
              <p className="text-slate-300 text-sm">
                Estimated revenue capture with our AI agents
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="pt-4"
          >
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <Card className="bg-slate-800/40 backdrop-blur-md border border-slate-600/30 p-6 text-center">
          <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
          <div className="text-3xl font-bold text-white mb-1">{results.monthlyCalls}</div>
          <div className="text-slate-400 text-sm">Monthly Calls</div>
        </Card>
        <Card className="bg-slate-800/40 backdrop-blur-md border border-slate-600/30 p-6 text-center">
          <Clock className="h-8 w-8 text-red-400 mx-auto mb-2" />
          <div className="text-3xl font-bold text-white mb-1">{results.missedCalls}</div>
          <div className="text-slate-400 text-sm">Missed Opportunities</div>
        </Card>
        <Card className="bg-slate-800/40 backdrop-blur-md border border-slate-600/30 p-6 text-center">
          <DollarSign className="h-8 w-8 text-green-400 mx-auto mb-2" />
          <div className="text-3xl font-bold text-white mb-1">
            ${(results.capturedRevenue / results.missedCalls || 0).toFixed(0)}
          </div>
          <div className="text-slate-400 text-sm">Per Captured Call</div>
        </Card>
      </div>
    </div>
  );
}

