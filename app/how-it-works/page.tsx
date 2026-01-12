'use client';

import { motion } from 'framer-motion';
import { 
  MessageSquare,
  Mail,
  Calendar,
  Brain,
  Settings,
  BarChart3,
  Link as LinkIcon,
  ArrowRight,
  CheckCircle,
  Clock,
  Zap,
  Bot
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const automationFeatures = [
  {
    icon: MessageSquare,
    title: 'Customer Support Agent',
    subtitle: '24/7/365',
    description: 'Intelligent customer support automation that handles inquiries instantly with natural language understanding and sentiment analysis.',
    metrics: [
      { label: 'Response Time', value: '2 seconds', color: 'text-green-400' },
      { label: 'Availability', value: '24/7/365', color: 'text-blue-400' },
      { label: 'Missed Inquiries', value: '0%', color: 'text-purple-400' },
    ],
    value: '$3,600',
    highlight: 'Handles complex conversations naturally',
    color: 'from-red-600 to-red-800',
  },
  {
    icon: Mail,
    title: 'Email Management Agent',
    subtitle: 'Automatic',
    description: 'Smart email categorization, priority filtering, and automated responses that streamline your communication workflow.',
    metrics: [
      { label: 'Processing Speed', value: 'Instant', color: 'text-green-400' },
      { label: 'Categorization', value: 'AI-Powered', color: 'text-blue-400' },
      { label: 'Auto-Responses', value: 'Intelligent', color: 'text-purple-400' },
    ],
    value: '$2,200',
    highlight: 'Never miss an important email again',
    color: 'from-blue-600 to-blue-800',
  },
  {
    icon: Calendar,
    title: 'Scheduling Automation',
    subtitle: 'Intelligent',
    description: 'Automated appointment booking with conflict resolution, timezone management, and smart calendar synchronization.',
    metrics: [
      { label: 'Booking Speed', value: '30 seconds', color: 'text-green-400' },
      { label: 'Calendar Sync', value: 'Real-time', color: 'text-blue-400' },
      { label: 'Reminders', value: 'Automatic', color: 'text-purple-400' },
    ],
    value: '$1,997',
    highlight: 'Eliminates double bookings completely',
    color: 'from-slate-600 to-slate-800',
  },
  {
    icon: Brain,
    title: 'Business Intelligence Training',
    subtitle: 'Custom AI',
    description: 'We train our AI agents on your business knowledge, processes, and communication style to respond exactly like your best team member.',
    metrics: [
      { label: 'Training Time', value: '10-20 hours', color: 'text-green-400' },
      { label: 'Custom Knowledge', value: 'Unlimited', color: 'text-blue-400' },
      { label: 'Learning Capability', value: 'Continuous', color: 'text-purple-400' },
    ],
    value: '$1,500',
    highlight: 'Learns your business inside and out',
    color: 'from-green-600 to-green-800',
  },
  {
    icon: Settings,
    title: 'Complete Setup Service',
    subtitle: 'White-Glove',
    description: 'Our expert team handles everything from integration to configuration. Zero effort required on your end.',
    metrics: [
      { label: 'Setup Time', value: '48 hours', color: 'text-green-400' },
      { label: 'Your Effort', value: 'Zero', color: 'text-blue-400' },
      { label: 'Integration', value: 'Included', color: 'text-purple-400' },
    ],
    value: '$750',
    highlight: 'We handle every detail for you',
    color: 'from-purple-600 to-purple-800',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    subtitle: 'Real-Time',
    description: 'Comprehensive performance tracking with real-time insights, ROI measurement, and detailed reporting on all automation activities.',
    metrics: [
      { label: 'Updates', value: 'Real-time', color: 'text-green-400' },
      { label: 'Tracking', value: 'Every action', color: 'text-blue-400' },
      { label: 'ROI Reports', value: 'Instant', color: 'text-purple-400' },
    ],
    value: '$500',
    highlight: 'Track every opportunity captured',
    color: 'from-orange-600 to-orange-800',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950/90 via-blue-950/80 to-slate-900/90 text-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-red-400 via-slate-200 to-blue-400 bg-clip-text text-transparent">
              The Complete Automation Solution
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Everything you need to transform your business operations and never miss another opportunity.
          </p>
        </motion.div>

        {/* Total Value */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-16"
        >
          <Card className="bg-gradient-to-r from-red-600/20 via-purple-600/20 to-blue-600/20 backdrop-blur-md border-2 border-red-500/30 p-8 inline-block shadow-xl">
            <div className="text-6xl font-bold text-white mb-2">
              $15,000+ <span className="text-3xl text-slate-300">Annual Savings</span>
            </div>
            <div className="text-2xl text-slate-300 mb-4">
              Average client ROI in year one
            </div>
            <p className="text-sm text-slate-400">Complete automation system • Custom solutions • Zero risk guarantee</p>
          </Card>
        </motion.div>

        {/* Automation Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {automationFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-md border border-slate-600/40 p-6 hover:border-slate-500/60 transition-all group relative overflow-hidden">
                  {/* Background gradient effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                      <IconComponent className="h-7 w-7 text-white" />
                    </div>
                    
                    {/* Title and Subtitle */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-white mb-1">{feature.title}</h3>
                      <p className="text-sm text-slate-400 font-medium">{feature.subtitle}</p>
                    </div>

                    {/* Description */}
                    <p className="text-slate-300 text-sm mb-4 leading-relaxed">{feature.description}</p>

                    {/* Metrics */}
                    <div className="space-y-2 mb-4">
                      {feature.metrics.map((metric, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">{metric.label}:</span>
                          <span className={`font-semibold ${metric.color}`}>{metric.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Value */}
                    <div className="border-t border-slate-600/30 pt-4 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Value:</span>
                        <span className="text-2xl font-bold text-green-400">{feature.value}</span>
                      </div>
                    </div>

                    {/* Highlight */}
                    <div className="flex items-start gap-2 bg-slate-700/30 rounded-lg p-3 border border-green-500/20">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-200">{feature.highlight}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Process Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            How We Get You Started
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Consultation', desc: 'We understand your needs', icon: Zap },
              { step: '2', title: 'Customization', desc: 'Train AI on your business', icon: Brain },
              { step: '3', title: 'Integration', desc: 'Connect your systems', icon: LinkIcon },
              { step: '4', title: 'Launch', desc: 'Go live in 48 hours', icon: CheckCircle },
            ].map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <Card
                  key={idx}
                  className="bg-slate-800/40 backdrop-blur-md border border-slate-600/30 p-6 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-600 to-blue-600 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">{item.step}</span>
                  </div>
                  <IconComponent className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                  <h4 className="text-lg font-semibold text-white mb-1">{item.title}</h4>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </Card>
              );
            })}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white px-12 py-6 text-lg"
          >
            Get Your $8,347 Value System
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-slate-400 mt-4 text-sm">
            Complete system setup • Zero risk with our guarantee
          </p>
        </motion.div>
      </div>
    </div>
  );
}

