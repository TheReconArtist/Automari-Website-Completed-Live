'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles, TrendingUp, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';

// Lazy load the Neural Network for better initial load
const NeuralNetwork = dynamic(() => import('@/components/NeuralNetwork/NeuralNetwork'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-slate-950" />,
});

interface HeroSectionProps {
  onStartAssessment: () => void;
}

export function HeroSection({ onStartAssessment }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen bg-slate-950 overflow-hidden">
      {/* Neural Network Background */}
      <div className="absolute inset-0 z-0">
        <NeuralNetwork showControls={false} />
      </div>

      {/* Gradient Overlay for readability */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 lg:pt-40 pb-20 pointer-events-none">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left pointer-events-auto">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-8 backdrop-blur-sm"
            >
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-300">
                South Florida&apos;s Premier AI Agency
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
            >
              <span className="text-white drop-shadow-lg">Your Business,</span>
              <br />
              <span
                className="inline-block drop-shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #67e8f9 0%, #3b82f6 40%, #06b6d4 80%, #22d3ee 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Powered by AI
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg sm:text-xl lg:text-2xl text-slate-300 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed drop-shadow-md"
            >
              We build custom AI agents that handle your customer service, 
              scheduling, and operations. Never miss another opportunity.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              {/* Primary CTA */}
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  onClick={onStartAssessment}
                  size="lg"
                  className="relative px-8 py-6 text-lg font-semibold text-white rounded-xl overflow-hidden group"
                  style={{
                    background: 'linear-gradient(135deg, #0891b2 0%, #3b82f6 100%)',
                    boxShadow: '0 8px 32px rgba(6, 182, 212, 0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
                  }}
                >
                  {/* Animated shine */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <span className="relative flex items-center gap-2">
                    Start Free Assessment
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </Button>
              </motion.div>

              {/* Secondary CTA */}
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg font-medium border-slate-600 bg-slate-900/70 backdrop-blur-sm text-white hover:bg-slate-800/70 hover:border-slate-500 rounded-xl"
                asChild
              >
                <a href="#agents" className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  See Our Agents
                </a>
              </Button>
            </motion.div>

            {/* Value Stats - Mobile visible */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12 grid grid-cols-3 gap-4 lg:hidden"
            >
              {[
                { value: '$15K+', label: 'Saved Yearly' },
                { value: '500+', label: 'Hours Saved' },
                { value: '99%', label: 'Satisfaction' },
              ].map((stat, i) => (
                <div key={i} className="text-center p-3 rounded-xl bg-slate-900/60 backdrop-blur-sm border border-slate-700/50">
                  <div className="text-xl font-bold text-cyan-400">{stat.value}</div>
                  <div className="text-xs text-slate-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column - Value Cards (Desktop only) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative hidden lg:block pointer-events-auto"
          >
            {/* Floating Value Card */}
            <div className="relative p-8 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 shadow-2xl">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Average Client Savings</h3>
                <p className="text-slate-400">What businesses like yours typically save</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: TrendingUp, value: '$15,000+', label: 'Annual labor savings', color: 'text-cyan-400' },
                  { icon: Clock, value: '500+', label: 'Hours saved yearly', color: 'text-green-400' },
                  { icon: Shield, value: '99%', label: 'Client satisfaction', color: 'text-amber-400' },
                  { icon: Sparkles, value: '24/7', label: 'Always available', color: 'text-purple-400' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/30 hover:border-slate-600/50 transition-colors"
                  >
                    <item.icon className={`h-7 w-7 ${item.color} mb-3`} />
                    <div className="text-2xl font-bold text-white mb-1">{item.value}</div>
                    <div className="text-sm text-slate-400">{item.label}</div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700/50 text-center">
                <p className="text-slate-400 text-sm">
                  Custom solutions tailored to your business needs
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Interaction hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none"
      >
        <p className="text-xs text-slate-500 bg-slate-900/50 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-800/50">
          Click anywhere to interact with the neural network
        </p>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none z-[3]" />
    </section>
  );
}
