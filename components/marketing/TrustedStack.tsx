'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, FileCheck } from 'lucide-react';

// Curated list of 8 key technology partners (no duplicates)
const techStack = [
  { name: 'OpenAI', logo: '🤖' },
  { name: 'Google Cloud', logo: '☁️' },
  { name: 'AWS', logo: '⚡' },
  { name: 'Zapier', logo: '🔗' },
  { name: 'Twilio', logo: '📱' },
  { name: 'Stripe', logo: '💳' },
  { name: 'Slack', logo: '💬' },
  { name: 'HubSpot', logo: '🎯' },
];

const securityFeatures = [
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'SOC 2 Type II compliant infrastructure',
  },
  {
    icon: Lock,
    title: 'Data Privacy',
    description: 'Your data never trains public models',
  },
  {
    icon: FileCheck,
    title: 'Compliance Ready',
    description: 'GDPR, CCPA, and HIPAA compatible',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function TrustedStack() {
  return (
    <section className="relative py-20 sm:py-24 overflow-hidden bg-slate-950">
      {/* Subtle background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-950" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo Cloud Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-medium text-cyan-400 uppercase tracking-wider mb-4">
            Trusted Technology Stack
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-3">
            Built on industry-leading platforms
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            We integrate with the tools you already use. Powered by the same AI that runs Fortune 500 companies.
          </p>
        </motion.div>

        {/* Logo Grid */}
        <motion.div
          className="grid grid-cols-4 sm:grid-cols-8 gap-4 sm:gap-6 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {techStack.map((tech, index) => (
            <motion.div
              key={tech.name}
              variants={itemVariants}
              className="group flex flex-col items-center justify-center p-4 sm:p-6 rounded-xl bg-slate-900/50 border border-slate-800/50 hover:border-cyan-500/30 hover:bg-slate-800/50 transition-all duration-300"
            >
              <span className="text-3xl sm:text-4xl mb-2 grayscale group-hover:grayscale-0 transition-all duration-300">
                {tech.logo}
              </span>
              <span className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors text-center">
                {tech.name}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
          <span className="text-xs text-slate-600 uppercase tracking-widest">Security & Compliance</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
        </div>

        {/* Security Features - 3 Columns */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {securityFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="flex items-start gap-4 p-5 rounded-xl bg-slate-900/30 border border-slate-800/30"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                  <IconComponent className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">{feature.title}</h3>
                  <p className="text-sm text-slate-400">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom credibility line */}
        <motion.p
          className="text-center text-sm text-slate-500 mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          Trusted by <span className="text-slate-400">50+ businesses</span> across South Florida • 
          <span className="text-slate-400"> 99.9% uptime</span> • 
          <span className="text-slate-400"> 24/7 support</span>
        </motion.p>
      </div>
    </section>
  );
}

