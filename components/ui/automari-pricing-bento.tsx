'use client';

import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle, Sparkles, TrendingUp, Crown, ArrowRight, X, Zap, Calendar, MessageSquare, BarChart3, Users, Settings, Shield, Clock, Phone, Mail, Database, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';

// Reusable BentoItem component with mouse tracking
const BentoItem = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const item = itemRef.current;
    if (!item) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      item.style.setProperty('--mouse-x', `${x}px`);
      item.style.setProperty('--mouse-y', `${y}px`);
    };

    item.addEventListener('mousemove', handleMouseMove);
    return () => {
      item.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={itemRef} className={`bento-item ${className || ''}`}>
      {children}
    </div>
  );
};

// Growth illustration components
const SeedIllustration = () => (
  <div className="w-full h-32 flex items-center justify-center mb-4">
    <svg viewBox="0 0 200 120" className="w-full h-full">
      <defs>
        <linearGradient id="seedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {/* Ground */}
      <rect x="0" y="100" width="200" height="20" fill="#1e293b" />
      {/* Seed */}
      <ellipse cx="100" cy="95" rx="8" ry="12" fill="url(#seedGradient)" />
      {/* Small sprout */}
      <path d="M 100 95 Q 95 85 100 80 Q 105 85 100 95" fill="#67e8f9" opacity="0.7" />
      <path d="M 100 95 Q 102 88 100 82 Q 98 88 100 95" fill="#3b82f6" opacity="0.5" />
      {/* Growth lines */}
      <motion.circle
        cx="100"
        cy="95"
        r="15"
        fill="none"
        stroke="#67e8f9"
        strokeWidth="1"
        opacity="0.3"
        initial={{ scale: 0.8, opacity: 0.3 }}
        animate={{ scale: 1.2, opacity: 0 }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      />
    </svg>
  </div>
);

const TreeIllustration = () => (
  <div className="w-full h-32 flex items-center justify-center mb-4">
    <svg viewBox="0 0 200 120" className="w-full h-full">
      <defs>
        <linearGradient id="treeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#1e40af" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      {/* Ground */}
      <rect x="0" y="100" width="200" height="20" fill="#1e293b" />
      {/* Trunk */}
      <rect x="95" y="70" width="10" height="30" fill="#3b82f6" opacity="0.8" />
      {/* Branches */}
      <ellipse cx="100" cy="60" rx="25" ry="20" fill="url(#treeGradient)" />
      <ellipse cx="85" cy="55" rx="18" ry="15" fill="url(#treeGradient)" />
      <ellipse cx="115" cy="55" rx="18" ry="15" fill="url(#treeGradient)" />
      {/* Growth glow */}
      <motion.circle
        cx="100"
        cy="60"
        r="30"
        fill="none"
        stroke="#67e8f9"
        strokeWidth="1"
        opacity="0.2"
        initial={{ scale: 0.9, opacity: 0.2 }}
        animate={{ scale: 1.1, opacity: 0 }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
      />
    </svg>
  </div>
);

const ForestIllustration = () => (
  <div className="w-full h-32 flex items-center justify-center mb-4">
    <svg viewBox="0 0 200 120" className="w-full h-full">
      <defs>
        <linearGradient id="forestGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#67e8f9" stopOpacity="1" />
          <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#1e40af" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      {/* Ground */}
      <rect x="0" y="100" width="200" height="20" fill="#1e293b" />
      {/* Multiple trees */}
      {/* Tree 1 */}
      <rect x="40" y="60" width="8" height="40" fill="#3b82f6" opacity="0.8" />
      <ellipse cx="44" cy="50" rx="20" ry="18" fill="url(#forestGradient)" />
      {/* Tree 2 (center, tallest) */}
      <rect x="95" y="50" width="10" height="50" fill="#3b82f6" opacity="0.9" />
      <ellipse cx="100" cy="40" rx="28" ry="25" fill="url(#forestGradient)" />
      <ellipse cx="85" cy="35" rx="20" ry="18" fill="url(#forestGradient)" />
      <ellipse cx="115" cy="35" rx="20" ry="18" fill="url(#forestGradient)" />
      {/* Tree 3 */}
      <rect x="150" y="65" width="8" height="35" fill="#3b82f6" opacity="0.8" />
      <ellipse cx="154" cy="55" rx="18" ry="16" fill="url(#forestGradient)" />
      {/* Forest glow */}
      <motion.circle
        cx="100"
        cy="40"
        r="50"
        fill="none"
        stroke="#67e8f9"
        strokeWidth="1"
        opacity="0.15"
        initial={{ scale: 0.8, opacity: 0.15 }}
        animate={{ scale: 1.2, opacity: 0 }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
      />
    </svg>
  </div>
);

interface PricingTier {
  id: string;
  name: string;
  tagline: string;
  icon: React.ElementType;
  illustration: React.ComponentType;
  quickStart: {
    price: string;
    description: string;
  };
  smartStart: {
    price: string;
    oneTime: string;
    savings: string;
    recommended: boolean;
  };
  benefits: string[];
  trustNote: string;
  gradient: string;
  glowColor: string;
  detailedInfo: {
    title: string;
    description: string;
    features: Array<{
      icon: React.ElementType;
      title: string;
      description: string;
    }>;
    roi: {
      timeToValue: string;
      typicalResults: string[];
      costComparison: string;
    };
    included: string[];
    nextSteps: string[];
  };
}

const pricingTiers: PricingTier[] = [
  {
    id: 'seed',
    name: 'Seed',
    tagline: 'Built to Book',
    icon: Sparkles,
    illustration: SeedIllustration,
    quickStart: {
      price: '$1,097',
      description: 'No upfront • Go live today',
    },
    smartStart: {
      price: '$397',
      oneTime: '$2,497',
      savings: 'Save $9,600 in Year 1',
      recommended: true,
    },
    benefits: [
      '24/7 AI receptionist (voice)',
      'Booking to your Google Calendar',
      'Text confirms for you and the client',
      'Simple monthly report',
    ],
    trustNote: 'Launch in 7 days or we comp a month.',
    gradient: 'from-cyan-500/20 via-blue-500/20 to-cyan-600/20',
    glowColor: 'rgba(93, 231, 254, 0.3)',
    detailedInfo: {
      title: 'Seed Plan - Your Foundation for Growth',
      description: 'Perfect for businesses ready to automate their booking and communication. Start small, grow big.',
      features: [
        {
          icon: Phone,
          title: '24/7 AI Receptionist (Voice)',
          description: 'Never miss a call. Our AI handles incoming calls, answers questions, and books appointments 24/7. Natural conversation flow that customers love.',
        },
        {
          icon: Calendar,
          title: 'Smart Calendar Integration',
          description: 'Automatic booking to your Google Calendar. Real-time sync, conflict prevention, and instant availability updates.',
        },
        {
          icon: MessageSquare,
          title: 'Automated Text Confirmations',
          description: 'Send confirmation texts to both you and your clients automatically. Reduces no-shows by up to 40% and keeps everyone informed.',
        },
        {
          icon: BarChart3,
          title: 'Monthly Performance Reports',
          description: 'Simple, clear reports showing bookings, call volume, and conversion rates. Know exactly how your automation is performing.',
        },
      ],
      roi: {
        timeToValue: '7 days',
        typicalResults: [
          '40% reduction in missed calls',
          '30% increase in bookings',
          '15-20 hours saved per week',
          'Average ROI: 300% in first year',
        ],
        costComparison: 'Hiring a receptionist costs $3,000-4,000/month. Seed costs $397/month (Smart Start) - save $32,000+ annually.',
      },
      included: [
        'Unlimited incoming calls handled',
        'Natural language AI conversation',
        'Google Calendar integration',
        'SMS confirmations (unlimited)',
        'Monthly analytics dashboard',
        'Email support',
        '7-day setup guarantee',
        'No long-term contracts',
      ],
      nextSteps: [
        'Schedule a 15-minute discovery call',
        'We configure your AI in 7 days',
        'Go live and start booking automatically',
        'Track results in your dashboard',
      ],
    },
  },
  {
    id: 'tree',
    name: 'Tree',
    tagline: 'Scale Your Pipeline',
    icon: TrendingUp,
    illustration: TreeIllustration,
    quickStart: {
      price: '$1,697',
      description: 'No upfront • Go live today',
    },
    smartStart: {
      price: '$697',
      oneTime: '$3,497',
      savings: 'Save $11,976 in Year 1',
      recommended: true,
    },
    benefits: [
      'Everything in Seed',
      'Auto follow-ups that don\'t feel spammy',
      'CRM updates done for you',
      'Priority chat support',
    ],
    trustNote: 'Typical clients see more shows in 30 to 60 days.',
    gradient: 'from-blue-500/20 via-cyan-500/20 to-blue-600/20',
    glowColor: 'rgba(0, 231, 255, 0.3)',
    detailedInfo: {
      title: 'Tree Plan - Scale Your Business Operations',
      description: 'Everything in Seed, plus advanced automation that nurtures leads and keeps your pipeline full.',
      features: [
        {
          icon: Zap,
          title: 'Intelligent Follow-Up Sequences',
          description: 'Automated follow-ups that feel personal. AI analyzes conversation context to send timely, relevant messages that convert without feeling spammy.',
        },
        {
          icon: Database,
          title: 'Automatic CRM Updates',
          description: 'Every interaction automatically updates your CRM. No manual data entry. Leads, notes, and status changes sync in real-time.',
        },
        {
          icon: Users,
          title: 'Priority Support & Success Manager',
          description: 'Dedicated chat support with faster response times. Plus a success manager to help optimize your automation for maximum results.',
        },
        {
          icon: TrendingUp,
          title: 'Advanced Analytics & Insights',
          description: 'Deep dive into your pipeline health. Track conversion rates, lead quality, follow-up effectiveness, and revenue attribution.',
        },
      ],
      roi: {
        timeToValue: '30-60 days',
        typicalResults: [
          '50% increase in qualified leads',
          '35% improvement in conversion rates',
          '25-30 hours saved per week',
          'Average ROI: 400% in first year',
        ],
        costComparison: 'Hiring a sales coordinator + receptionist costs $5,000-6,000/month. Tree costs $697/month (Smart Start) - save $50,000+ annually.',
      },
      included: [
        'Everything in Seed plan',
        'Unlimited follow-up sequences',
        'CRM integration (HubSpot, Salesforce, etc.)',
        'Lead scoring and qualification',
        'Advanced pipeline analytics',
        'Priority chat support (2-hour response)',
        'Dedicated success manager',
        'Custom automation workflows',
        'A/B testing for messages',
      ],
      nextSteps: [
        'Schedule a 30-minute strategy session',
        'We map your sales process',
        'Configure advanced automations',
        'Launch in 10-14 days',
        'Optimize based on real results',
      ],
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    tagline: 'Own the Desk',
    icon: Crown,
    illustration: ForestIllustration,
    quickStart: {
      price: '$3,297',
      description: 'No upfront • Go live today',
    },
    smartStart: {
      price: '$1,297',
      oneTime: '$6,497',
      savings: 'Save $23,976 in Year 1',
      recommended: true,
    },
    benefits: [
      'Everything in Tree',
      'Multi-location & round-robin',
      'Snapshot dashboard for owners',
      'White-label options',
    ],
    trustNote: 'Rollout plan included for teams.',
    gradient: 'from-cyan-600/20 via-blue-600/20 to-cyan-700/20',
    glowColor: 'rgba(93, 231, 254, 0.4)',
    detailedInfo: {
      title: 'Forest Plan - Enterprise-Grade Automation',
      description: 'Complete automation ecosystem for multi-location businesses and teams. Own your entire customer experience.',
      features: [
        {
          icon: Globe,
          title: 'Multi-Location & Round-Robin Routing',
          description: 'Manage multiple locations from one dashboard. Intelligent routing distributes calls and leads based on location, availability, and expertise.',
        },
        {
          icon: BarChart3,
          title: 'Executive Dashboard & Analytics',
          description: 'Real-time snapshot of all locations, revenue, bookings, and performance metrics. Make data-driven decisions instantly.',
        },
        {
          icon: Shield,
          title: 'White-Label & Custom Branding',
          description: 'Fully branded experience with your logo, colors, and voice. Customers never know they\'re talking to AI.',
        },
        {
          icon: Settings,
          title: 'Custom Integrations & Workflows',
          description: 'Connect with any system. Custom API integrations, advanced workflows, and enterprise-grade security.',
        },
      ],
      roi: {
        timeToValue: '60-90 days',
        typicalResults: [
          '200% increase in total bookings across locations',
          '60% reduction in operational overhead',
          '40-50 hours saved per week per location',
          'Average ROI: 500%+ in first year',
        ],
        costComparison: 'Hiring full teams (receptionists, coordinators, managers) costs $12,000-15,000/month per location. Forest costs $1,297/month - save $120,000+ annually per location.',
      },
      included: [
        'Everything in Tree plan',
        'Unlimited locations',
        'Round-robin and intelligent routing',
        'Multi-location analytics dashboard',
        'White-label branding',
        'Custom API integrations',
        'Advanced security & compliance',
        '24/7 priority support',
        'Dedicated account manager',
        'Quarterly strategy reviews',
        'Team training & onboarding',
        'Rollout plan for new locations',
      ],
      nextSteps: [
        'Schedule a 60-minute enterprise consultation',
        'We audit your multi-location operations',
        'Design custom automation architecture',
        'Phased rollout plan (30-60 days)',
        'Ongoing optimization & support',
      ],
    },
  },
];

export const AutomariPricingBento = () => {
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCalculateSavings = (tier: PricingTier) => {
    setSelectedTier(tier);
    setIsDialogOpen(true);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/50 to-slate-900 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
              Choose Your Automation Tier
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Select the perfect plan to transform your business operations with AI-powered automation
          </p>
        </div>

        {/* Bento Grid */}
        <div className="bento-grid">
          {pricingTiers.map((tier, index) => {
            const Icon = tier.icon;
            const Illustration = tier.illustration;
            return (
              <BentoItem key={tier.id} className="col-span-1 row-span-1">
                <div className="relative h-full p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 border border-slate-700/50 backdrop-blur-xl overflow-hidden group">
                  {/* Animated gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${tier.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    style={{
                      background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${tier.glowColor}, transparent 70%)`,
                    }}
                  />

                  {/* Glow effect */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                    style={{
                      background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${tier.glowColor}, transparent 50%)`,
                    }}
                  />

                  <div className="relative z-10 flex flex-col h-full">
                    {/* Growth Illustration */}
                    <div className="mb-4">
                      <Illustration />
                    </div>

                    {/* Tier Header */}
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                          <Icon className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white">{tier.name}</h2>
                          <p className="text-sm text-cyan-400/80">{tier.tagline}</p>
                        </div>
                      </div>
                    </div>

                    {/* Pricing Options */}
                    <div className="space-y-4 mb-6">
                      {/* Quick Start */}
                      <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                        <div className="flex items-baseline justify-between mb-1">
                          <span className="text-sm text-gray-400">Option A: Quick Start</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-white">{tier.quickStart.price}</span>
                          <span className="text-sm text-gray-400">/month</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{tier.quickStart.description}</p>
                      </div>

                      {/* Smart Start - Recommended */}
                      <div className="p-4 rounded-lg bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-cyan-600/10 border-2 border-cyan-500/30 relative overflow-hidden">
                        <div className="absolute top-2 right-2">
                          <span className="px-2 py-1 text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full">
                            RECOMMENDED
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between mb-1">
                          <span className="text-sm text-cyan-300">Option B: Smart Start</span>
                        </div>
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-2xl font-bold text-white">{tier.smartStart.price}</span>
                          <span className="text-sm text-gray-400">/month</span>
                        </div>
                        <p className="text-xs text-cyan-400/80 mb-2">
                          {tier.smartStart.oneTime} one-time deployment fee
                        </p>
                        <p className="text-xs font-semibold text-green-400">{tier.smartStart.savings}</p>
                      </div>
                    </div>

                    {/* Benefits */}
                    <div className="flex-1 mb-6">
                      <h3 className="text-sm font-semibold text-gray-300 mb-3">What's Included:</h3>
                      <ul className="space-y-2">
                        {tier.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-300">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Trust Note */}
                    <div className="mb-6 p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                      <p className="text-xs text-cyan-400/90 italic">{tier.trustNote}</p>
                    </div>

                    {/* CTA Button */}
                    <Button
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-6 rounded-lg transition-all duration-300 group/btn"
                      onClick={() => handleCalculateSavings(tier)}
                    >
                      <span className="flex items-center justify-center gap-2">
                        Calculate Your Savings
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </div>
                </div>
              </BentoItem>
            );
          })}
        </div>
      </div>

      {/* Detailed Savings Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700 text-white">
          {selectedTier && (
            <>
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {selectedTier.detailedInfo.title}
                </DialogTitle>
                <DialogDescription className="text-gray-300 text-lg mt-2">
                  {selectedTier.detailedInfo.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-8 mt-6">
                {/* Key Features */}
                <div>
                  <h3 className="text-xl font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    What You're Getting
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {selectedTier.detailedInfo.features.map((feature, idx) => {
                      const FeatureIcon = feature.icon;
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/50 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                              <FeatureIcon className="w-5 h-5 text-cyan-400" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                              <p className="text-sm text-gray-300">{feature.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* ROI Section */}
                <div className="p-6 rounded-lg bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-green-600/10 border border-green-500/30">
                  <h3 className="text-xl font-semibold text-green-400 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Your Return on Investment
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Time to Value</p>
                      <p className="text-2xl font-bold text-white">{selectedTier.detailedInfo.roi.timeToValue}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Cost Comparison</p>
                      <p className="text-sm text-gray-300">{selectedTier.detailedInfo.roi.costComparison}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-green-400 mb-2">Typical Results:</p>
                    <ul className="space-y-2">
                      {selectedTier.detailedInfo.roi.typicalResults.map((result, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Everything Included */}
                <div>
                  <h3 className="text-xl font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Everything Included
                  </h3>
                  <div className="grid md:grid-cols-2 gap-2">
                    {selectedTier.detailedInfo.included.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded bg-slate-800/30">
                        <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Steps */}
                <div className="p-6 rounded-lg bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-blue-600/10 border border-blue-500/30">
                  <h3 className="text-xl font-semibold text-blue-400 mb-4 flex items-center gap-2">
                    <ArrowRight className="w-5 h-5" />
                    How It Works
                  </h3>
                  <ol className="space-y-3">
                    {selectedTier.detailedInfo.nextSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold flex items-center justify-center text-sm">
                          {idx + 1}
                        </div>
                        <span className="text-gray-300 pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-6"
                    onClick={() => {
                      window.location.href = 'tel:561-201-4365';
                    }}
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Call Us: 561-201-4365
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 font-semibold py-6"
                    onClick={() => {
                      window.location.href = 'mailto:contactautomari@gmail.com';
                    }}
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Email Us
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <style jsx>{`
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
          width: 100%;
        }

        .bento-item {
          position: relative;
          transition: transform 0.3s ease;
        }

        .bento-item:hover {
          transform: translateY(-4px);
        }

        @media (min-width: 768px) {
          .bento-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 767px) {
          .bento-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
