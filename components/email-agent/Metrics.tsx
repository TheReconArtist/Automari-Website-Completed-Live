'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { BarChart2, Mail, Clock, Percent, Zap } from 'lucide-react';
import { getDictionary } from '@/lib/i18n';
import { Metric, Locale } from '@/lib/types';

const generateSparklineData = (length: number) => {
  const data = [];
  for (let i = 0; i < length; i++) {
    data.push(Math.floor(Math.random() * 50) + 20);
  }
  return data;
};

const mockMetrics: Metric[] = [
  {
    id: 'processed-emails',
    title: 'Processed Emails',
    value: '1,234',
    sparklineData: generateSparklineData(7),
    unit: 'emails',
  },
  {
    id: 'avg-response-time',
    title: 'Avg. Response Time',
    value: '2.3',
    sparklineData: generateSparklineData(7).map(d => Math.round(d / 10)),
    unit: 'min',
  },
  {
    id: 'auto-reply-rate',
    title: 'Auto-Reply Rate',
    value: '65',
    sparklineData: generateSparklineData(7).map(d => Math.round(d * 1.5)),
    unit: '%',
  },
  {
    id: 'saved-minutes',
    title: 'Saved Minutes',
    value: '8,765',
    sparklineData: generateSparklineData(7).map(d => d * 10),
    unit: 'min',
  },
];

const MetricCard = ({ metric, dict }: { metric: Metric; dict: ReturnType<typeof getDictionary> }) => {
  const Icon = {
    'processed-emails': Mail,
    'avg-response-time': Clock,
    'auto-reply-rate': Percent,
    'saved-minutes': Zap,
  }[metric.id] || BarChart2;

  return (
    <Card className="bg-slate-800 border-slate-700 p-4 flex flex-col justify-between">
      <div className="flex items-center space-x-3 mb-4">
        <Icon className="h-6 w-6 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">{metric.title}</h3>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-4xl font-bold text-red-400">{metric.value}</p>
          <p className="text-sm text-slate-400">{metric.unit}</p>
        </div>
        {/* Simple Sparkline (for visual demo, not actual chart lib) */}
        <div className="flex flex-col items-center">
          <p className="text-xs text-slate-500 mb-1">{dict.metrics.last7Days}</p>
          <div className="flex h-10 space-x-0.5">
            {metric.sparklineData.map((value, index) => (
              <div
                key={index}
                className="w-2 bg-blue-600/50 rounded-sm"
                style={{ height: `${value}px`, transform: `translateY(${50 - value}px)` }}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export function Metrics() {
  const dict = getDictionary('en');
  const [metrics, setMetrics] = useState<Metric[]>(mockMetrics);

  // In a real app, you'd fetch live metrics here.

  return (
    <motion.div
      className="p-4 h-full overflow-y-auto custom-scrollbar bg-slate-900"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
        <BarChart2 className="h-6 w-6 mr-2 text-green-400" />{dict.metrics.metricsTitle}
      </h2>
      <p className="text-slate-400 mb-6">{dict.metrics.rulesBuilderSubtitle}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} dict={dict} />
        ))}
      </div>
    </motion.div>
  );
}
