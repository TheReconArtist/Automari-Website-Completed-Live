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
  Building2,
  MapPinned,
  Wrench,
  PhoneCall,
  Scale,
  FileSearch,
  HeartPulse,
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
  {
    id: 10,
    title: 'Real Estate Off-Market Deal Finder',
    icon: MapPinned,
    description: 'Find, score, and nurture seller opportunities before they hit the market.',
    benefit: 'Earlier deal flow',
    gradient: 'from-cyan-500/10 to-sky-500/10',
    iconBg: 'bg-gradient-to-br from-cyan-500 to-sky-600',
    painPoints: [
      'Public records, probate, absentee owner, expired listing, and FSBO data sitting unused',
      'No scoring system for seller motivation, equity, timing, or property fit',
      'Manual outreach slowing down investor and agent teams',
      'Hot off-market conversations getting lost across calls, SMS, forms, and CRMs',
      'Follow-up stops before owners are ready to sell',
    ],
  },
  {
    id: 11,
    title: 'Real Estate Showing & Transaction Concierge',
    icon: Building2,
    description: 'Qualify buyers, book showings, follow up after tours, and chase transaction deadlines.',
    benefit: 'More showings booked',
    gradient: 'from-blue-500/10 to-cyan-500/10',
    iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    painPoints: [
      'Buyer leads need budget, location, timeline, financing, and intent sorted immediately',
      'Showing requests arrive after hours and lose momentum by morning',
      'Agents forget post-showing follow-up when the day gets busy',
      'Inspection, disclosure, appraisal, and document reminders require constant chasing',
      'Clients expect fast answers without sacrificing licensed human oversight',
    ],
  },
  {
    id: 12,
    title: 'HVAC Emergency Dispatch Agent',
    icon: PhoneCall,
    description: 'Answer calls 24/7, triage urgency, route jobs, and protect the schedule during peak demand.',
    benefit: 'Faster job booking',
    gradient: 'from-orange-500/10 to-amber-500/10',
    iconBg: 'bg-gradient-to-br from-orange-500 to-amber-600',
    painPoints: [
      'No-cool and no-heat calls need emergency triage, not generic chatbot replies',
      'Dispatchers manually match jobs by location, technician skill, and availability',
      'After-hours calls are expensive to miss and hard to recover',
      'ServiceTitan, Housecall Pro, FieldEdge, or CRM notes are not always updated cleanly',
      'Maintenance-plan customers need priority routing without disrupting the whole board',
    ],
  },
  {
    id: 13,
    title: 'HVAC Quote & Maintenance Plan Agent',
    icon: Wrench,
    description: 'Turn photos, symptoms, invoices, and service history into faster estimates and rebooking loops.',
    benefit: 'Higher repeat revenue',
    gradient: 'from-amber-500/10 to-yellow-500/10',
    iconBg: 'bg-gradient-to-br from-amber-500 to-yellow-600',
    painPoints: [
      'Manual quote prep slows replacements, repairs, ductwork, and tune-up offers',
      'Technicians forget to document photos, notes, parts, and next-step recommendations',
      'Customers do not understand why maintenance plans matter until equipment fails',
      'Seasonal campaigns are not tied to install age, service history, or warranty status',
      'Unsold estimates never get intelligent follow-up',
    ],
  },
  {
    id: 14,
    title: 'Legal Intake & Case Qualification Agent',
    icon: Scale,
    description: 'Screen new matters, collect facts, conflict-check inputs, and route qualified leads fast.',
    benefit: 'Cleaner case intake',
    gradient: 'from-indigo-500/10 to-blue-500/10',
    iconBg: 'bg-gradient-to-br from-indigo-500 to-blue-600',
    painPoints: [
      'High-value legal leads abandon when intake is slow or confusing',
      'Staff spend hours gathering facts that could be collected before consultation',
      'Wrong-fit matters consume attorney time before they are screened out',
      'Consultation prep lacks timelines, documents, parties, damages, and urgency notes',
      'Sensitive conversations need clear escalation instead of risky unsupervised advice',
    ],
  },
  {
    id: 15,
    title: 'Legal Research & Document Review Agent',
    icon: FileSearch,
    description: 'Summarize discovery, compare documents, extract obligations, and prepare attorney review packets.',
    benefit: 'Hours reclaimed',
    gradient: 'from-slate-500/10 to-indigo-500/10',
    iconBg: 'bg-gradient-to-br from-slate-500 to-indigo-600',
    painPoints: [
      'Contracts, pleadings, transcripts, and discovery files take too long to review manually',
      'Teams need issue spotting, chronology building, and clause comparison without losing context',
      'Research requests require source-backed summaries and attorney approval workflows',
      'Deadlines, missing documents, and follow-up tasks get buried across matters',
      'Firms need productivity gains while preserving professional judgment and compliance',
    ],
  },
  {
    id: 16,
    title: 'Med Spa Revenue Front Desk Agent',
    icon: HeartPulse,
    description: 'Capture leads, recommend safe service pathways, book deposits, and drive protocol-based rebooking.',
    benefit: 'More booked consults',
    gradient: 'from-pink-500/10 to-rose-500/10',
    iconBg: 'bg-gradient-to-br from-pink-500 to-rose-600',
    painPoints: [
      'High-intent leads ask about Botox, filler, lasers, facials, and weight-loss services after hours',
      'Front desks lose revenue when questions, deposits, reminders, and forms are handled manually',
      'Clients need the right consultation path without the AI giving medical advice',
      'Zenoti, Boulevard, Aesthetic Record, or CRM workflows need clean booking and notes',
      'No-shows, cancellations, and missed rebooking windows quietly drain revenue',
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
                  className={`relative h-full overflow-hidden rounded-2xl bg-gradient-to-br ${agent.gradient} border border-cyan-300/14 bg-white/[0.045] shadow-[0_22px_70px_rgba(8,47,73,0.24),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-2xl transition-all duration-300 hover:border-cyan-300/30 hover:bg-white/[0.065]`}
                >
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-300/10 via-white/[0.035] to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/50 to-transparent" />

                  {/* Main Content */}
                  <div className="relative z-10 p-6 sm:p-8">
                    {/* Icon */}
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${agent.iconBg} shadow-[0_12px_34px_rgba(34,211,238,0.18),inset_0_1px_0_rgba(255,255,255,0.28)] mb-5 border border-white/15`}
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
                        <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-2 border-t border-cyan-300/12 bg-white/[0.025]">
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
                            className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-cyan-500/90 to-blue-600/90 hover:from-cyan-400 hover:to-blue-500 transition-all group/link shadow-[0_12px_34px_rgba(6,182,212,0.22),inset_0_1px_0_rgba(255,255,255,0.18)] border border-cyan-100/20 backdrop-blur-xl"
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
          <div className="mx-auto mb-8 max-w-2xl rounded-3xl border border-cyan-300/12 bg-white/[0.04] px-6 py-6 text-center shadow-[0_24px_70px_rgba(8,47,73,0.22),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-2xl">
            <div className="mx-auto mb-5 h-px max-w-sm bg-gradient-to-r from-transparent via-cyan-200/50 to-transparent" />
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Roll the dice and take a chance with AI
            </h3>
            <p className="text-slate-400 max-w-xl mx-auto">
              In business, luck is where preparation meets opportunity. Roll the dice, but let AI stack the odds in your favor.
            </p>
          </div>
          
          {/* Dice Roller */}
          <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-cyan-300/12 bg-white/[0.035] p-3 shadow-[0_28px_90px_rgba(8,47,73,0.25),inset_0_1px_0_rgba(255,255,255,0.10)] backdrop-blur-2xl">
            <DiceRoller className="mx-auto max-w-2xl" />
          </div>
          
          {/* Bottom CTA */}
          <div className="mx-auto mt-8 max-w-lg rounded-2xl border border-cyan-300/12 bg-white/[0.04] px-6 py-6 text-center shadow-[0_18px_60px_rgba(8,47,73,0.18),inset_0_1px_0_rgba(255,255,255,0.10)] backdrop-blur-xl">
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
