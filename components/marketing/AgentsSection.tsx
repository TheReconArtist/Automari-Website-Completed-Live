'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import {
  MessageSquare,
  Mail,
  Calendar,
  Calculator,
  Users,
  Package,
  TrendingUp,
  BarChart3,
  Share2,
  LucideIcon,
  ArrowRight,
  ChevronDown,
  Check,
} from 'lucide-react';

// Dynamically import DiceRoller to avoid SSR issues with Three.js
const DiceRoller = dynamic(() => import('@/components/DiceRoller/DiceRoller'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] rounded-2xl bg-slate-900/50 animate-pulse flex items-center justify-center">
      <span className="text-slate-500">Loading...</span>
    </div>
  ),
});

interface Agent {
  id: number;
  title: string;
  icon: LucideIcon;
  description: string;
  benefit: string;
  gradient: string;
  iconBg: string;
  painPoints: string[];
}

const agents: Agent[] = [
  {
    id: 1,
    title: 'Customer Support',
    icon: MessageSquare,
    description: 'Never miss a customer inquiry. Instant, intelligent responses 24/7.',
    benefit: '90% faster response times',
    gradient: 'from-cyan-500/10 to-blue-500/10',
    iconBg: 'bg-gradient-to-br from-cyan-500 to-blue-600',
    painPoints: [
      'Overwhelmed by repetitive customer questions',
      'Customers waiting hours for responses',
      'Losing leads to slow follow-ups',
      'Staff burnout from high ticket volumes',
      'Inconsistent response quality across team',
    ],
  },
  {
    id: 2,
    title: 'Email Management',
    icon: Mail,
    description: 'Smart inbox zero. Auto-sort, prioritize, and draft responses.',
    benefit: '5+ hours saved weekly',
    gradient: 'from-blue-500/10 to-indigo-500/10',
    iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    painPoints: [
      'Inbox overflowing with hundreds of emails',
      'Important messages getting buried',
      'Hours spent sorting and categorizing',
      'Delayed responses hurting relationships',
      'No time for strategic work',
    ],
  },
  {
    id: 3,
    title: 'Appointment Scheduling',
    icon: Calendar,
    description: 'Eliminate double-bookings. AI handles calendars seamlessly.',
    benefit: 'Zero scheduling conflicts',
    gradient: 'from-violet-500/10 to-purple-500/10',
    iconBg: 'bg-gradient-to-br from-violet-500 to-purple-600',
    painPoints: [
      'Constant back-and-forth to find times',
      'Double bookings embarrassing the team',
      'No-shows costing revenue',
      'Manual calendar management eating hours',
      'Timezone confusion with clients',
    ],
  },
  {
    id: 4,
    title: 'Financial Operations',
    icon: Calculator,
    description: 'Automated bookkeeping, invoicing, and real-time reporting.',
    benefit: '99.9% accuracy rate',
    gradient: 'from-emerald-500/10 to-teal-500/10',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    painPoints: [
      'Invoices piling up unsent',
      'Manual data entry errors',
      'Cash flow blindspots',
      'Late payments hurting revenue',
      'Reconciliation taking days',
    ],
  },
  {
    id: 5,
    title: 'HR & Onboarding',
    icon: Users,
    description: 'Streamlined hiring workflows and frictionless employee onboarding.',
    benefit: '70% faster onboarding',
    gradient: 'from-amber-500/10 to-orange-500/10',
    iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
    painPoints: [
      'New hires waiting weeks to get set up',
      'Paperwork bottlenecks slowing everything',
      'Inconsistent training experiences',
      'HR team buried in admin tasks',
      'Compliance gaps and missed steps',
    ],
  },
  {
    id: 6,
    title: 'Inventory & Supply Chain',
    icon: Package,
    description: 'Real-time stock tracking with predictive reordering.',
    benefit: '40% less stockouts',
    gradient: 'from-rose-500/10 to-pink-500/10',
    iconBg: 'bg-gradient-to-br from-rose-500 to-pink-600',
    painPoints: [
      'Running out of bestsellers at peak times',
      'Overstocking tying up capital',
      'Manual counts eating staff hours',
      'Supplier delays catching you off guard',
      'No visibility into demand trends',
    ],
  },
  {
    id: 7,
    title: 'Lead Generation',
    icon: TrendingUp,
    description: 'Qualify leads instantly. Nurture prospects on autopilot.',
    benefit: '3x more qualified leads',
    gradient: 'from-cyan-500/10 to-teal-500/10',
    iconBg: 'bg-gradient-to-br from-cyan-500 to-teal-600',
    painPoints: [
      'Wasting time on unqualified prospects',
      'Hot leads going cold before follow-up',
      'No consistent nurturing sequence',
      'Sales team chasing dead ends',
      'Missing opportunities in the pipeline',
    ],
  },
  {
    id: 8,
    title: 'Analytics & Insights',
    icon: BarChart3,
    description: 'Transform data into decisions with predictive intelligence.',
    benefit: 'Real-time dashboards',
    gradient: 'from-blue-500/10 to-cyan-500/10',
    iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    painPoints: [
      'Decisions made on gut, not data',
      'Reports taking days to compile',
      'Data scattered across systems',
      'Trends spotted too late to act',
      'No predictive visibility into future',
    ],
  },
  {
    id: 9,
    title: 'Social Media',
    icon: Share2,
    description: 'Schedule, engage, and grow your brand presence automatically.',
    benefit: '2x engagement rate',
    gradient: 'from-purple-500/10 to-violet-500/10',
    iconBg: 'bg-gradient-to-br from-purple-500 to-violet-600',
    painPoints: [
      'Inconsistent posting killing reach',
      'No time to engage with followers',
      'Missing trending conversations',
      'Content calendar always behind',
      'Competitor brands outpacing you',
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function AgentsSection() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section
      id="agents"
      className="relative py-24 sm:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16 sm:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Specialized AI Solutions
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
            AI Agents Built for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Your Business
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-400 leading-relaxed">
            Each agent is custom-trained on your processes, brand voice, and business logic. Delivering
            enterprise-grade automation without the enterprise complexity.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {agents.map((agent) => {
            const IconComponent = agent.icon;
            const isExpanded = expandedId === agent.id;
            return (
              <motion.div
                key={agent.id}
                variants={cardVariants}
                className="group relative"
                layout
              >
                {/* Card */}
                <motion.div
                  layout
                  className={`relative h-full rounded-2xl bg-gradient-to-br ${agent.gradient} backdrop-blur-sm border border-slate-800/50 hover:border-slate-700/50 transition-all duration-300 overflow-hidden`}
                >
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Main Content */}
                  <div className="relative z-10 p-6 sm:p-8">
                    {/* Icon */}
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${agent.iconBg} shadow-lg mb-5`}
                    >
                      <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                      {agent.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-5">
                      {agent.description}
                    </p>

                    {/* Benefit Badge & Expand Button */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-400">
                        <Check className="w-4 h-4" />
                        {agent.benefit}
                      </span>
                      <button
                        onClick={() => toggleExpand(agent.id)}
                        className="flex items-center gap-1 text-slate-500 hover:text-cyan-400 transition-colors duration-300"
                        aria-expanded={isExpanded}
                        aria-label={isExpanded ? 'Collapse pain points' : 'Expand pain points'}
                      >
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="w-5 h-5" />
                        </motion.div>
                      </button>
                    </div>
                  </div>

                  {/* Expandable Pain Points Section */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-2 border-t border-slate-700/50">
                          <p className="text-xs uppercase tracking-wider text-slate-500 mb-3 font-medium">
                            Pain Points We Solve
                          </p>
                          <ul className="space-y-2.5">
                            {agent.painPoints.map((point, index) => (
                              <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-start gap-2.5 text-sm text-slate-300"
                              >
                                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                                {point}
                              </motion.li>
                            ))}
                          </ul>
                          <motion.a
                            href="tel:561-201-4365"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all group/link shadow-lg shadow-cyan-500/20"
                          >
                            Get {agent.title} Agent
                            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                          </motion.a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Interactive Dice Section */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Creative business tagline */}
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Fortune Favors the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Automated</span>
            </h3>
            <p className="text-slate-400 max-w-xl mx-auto">
              In business, luck is where preparation meets opportunity. Roll the dice, but let AI stack the odds in your favor.
            </p>
          </div>
          
          {/* Dice Roller */}
          <DiceRoller className="max-w-2xl mx-auto" />
          
          {/* Bottom CTA */}
          <div className="text-center mt-8">
            <p className="text-sm text-slate-500 mb-4">
              Stop gambling with your growth. Start automating your success.
            </p>
            <a
              href="tel:561-201-4365"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25 group"
            >
              Talk to Our Team
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
