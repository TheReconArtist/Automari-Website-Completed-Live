'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Clock, DollarSign, ArrowRight } from 'lucide-react';

interface CaseStudy {
  company: string;
  industry: string;
  challenge: string;
  results: {
    label: string;
    value: string;
    icon: typeof TrendingUp;
  }[];
  quote: string;
}

const caseStudies: CaseStudy[] = [
  {
    company: 'Thompson Legal Services',
    industry: 'Legal Services',
    challenge: 'Missed 40% of after-hours client inquiries',
    results: [
      { label: 'Response Time', value: '2 min', icon: Clock },
      { label: 'Leads Captured', value: '+185%', icon: TrendingUp },
      { label: 'Monthly Revenue', value: '+$47K', icon: DollarSign },
    ],
    quote: 'Automari handles 80% of inquiries automatically. It\'s like having an extra 24/7 assistant.',
  },
  {
    company: 'Vals Salon LLC',
    industry: 'Beauty & Wellness',
    challenge: 'Double-bookings and scheduling chaos',
    results: [
      { label: 'Booking Errors', value: '0%', icon: Clock },
      { label: 'No-Shows', value: '-65%', icon: TrendingUp },
      { label: 'Time Saved', value: '15 hrs/wk', icon: Clock },
    ],
    quote: 'We eliminated double bookings completely. The AI manages everything without me lifting a finger.',
  },
  {
    company: 'Chen\'s Restaurant Group',
    industry: 'Hospitality',
    challenge: 'Inventory waste and stockouts',
    results: [
      { label: 'Waste Reduced', value: '-40%', icon: TrendingUp },
      { label: 'Stockouts', value: '-90%', icon: DollarSign },
      { label: 'Annual Savings', value: '$38K', icon: DollarSign },
    ],
    quote: 'The inventory AI has saved us thousands. Mike understood our unique needs.',
  },
];

export function CaseStudies() {
  return (
    <section className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-cyan-400 text-sm font-medium uppercase tracking-wider">
            Proven Results
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white">
            Real businesses. Real numbers.
          </h2>
          <p className="mt-4 text-slate-400">
            See how South Florida companies transformed their operations in 45-90 days.
          </p>
        </motion.div>

        {/* Case Study Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.company}
              className="group relative bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-slate-800 p-6 hover:border-cyan-500/30 transition-colors"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Header */}
              <div className="mb-6">
                <p className="text-xs text-cyan-400 font-medium uppercase tracking-wider mb-1">
                  {study.industry}
                </p>
                <h3 className="text-xl font-semibold text-white">{study.company}</h3>
                <p className="text-sm text-slate-500 mt-1">Challenge: {study.challenge}</p>
              </div>

              {/* Metrics */}
              <div className="space-y-3 mb-6">
                {study.results.map((result, idx) => {
                  const IconComponent = result.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50"
                    >
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm text-slate-400">{result.label}</span>
                      </div>
                      <span className="text-lg font-bold text-white">{result.value}</span>
                    </div>
                  );
                })}
              </div>

              {/* Quote */}
              <blockquote className="text-sm text-slate-300 italic border-l-2 border-cyan-500/50 pl-4">
                &ldquo;{study.quote}&rdquo;
              </blockquote>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <a
            href="tel:561-201-4365"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium transition-colors group"
          >
            Call us: 561-201-4365
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

