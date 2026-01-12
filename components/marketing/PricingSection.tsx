'use client';

import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

const tiers: PricingTier[] = [
  {
    name: 'Starter',
    price: '$497',
    period: '/month',
    description: 'Perfect for small businesses ready to automate.',
    features: [
      '1 AI Agent (Support or Scheduling)',
      'Up to 500 conversations/month',
      'Email & chat integration',
      'Basic analytics dashboard',
      'Email support',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Professional',
    price: '$997',
    period: '/month',
    description: 'For growing teams that need more automation.',
    features: [
      '3 AI Agents of your choice',
      'Unlimited conversations',
      'CRM & calendar integrations',
      'Advanced analytics & reporting',
      'Priority support + Slack channel',
      'Custom training on your data',
    ],
    cta: 'Book a Call',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Full automation suite for larger operations.',
    features: [
      'Unlimited AI Agents',
      'Unlimited conversations',
      'Custom integrations',
      'Dedicated success manager',
      'SLA & uptime guarantee',
      'White-label options',
      'On-site training available',
    ],
    cta: 'Contact Sales',
  },
];

interface PricingSectionProps {
  onBookCall?: () => void;
}

export function PricingSection({ onBookCall }: PricingSectionProps) {
  return (
    <section id="pricing" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-cyan-400 text-sm font-medium uppercase tracking-wider">
            Simple Pricing
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white">
            Plans that scale with your business
          </h2>
          <p className="mt-4 text-slate-400">
            No hidden fees. No long-term contracts. Cancel anytime after 90 days.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-6">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              className={`relative rounded-2xl p-8 ${
                tier.popular
                  ? 'bg-gradient-to-b from-cyan-500/10 to-slate-900 border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/50 border border-slate-800'
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-cyan-500 text-slate-950 text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Tier Header */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white">{tier.name}</h3>
                <p className="text-sm text-slate-400 mt-1">{tier.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">{tier.price}</span>
                <span className="text-slate-400">{tier.period}</span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={onBookCall}
                className={`w-full py-3 px-6 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                  tier.popular
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                }`}
              >
                {tier.cta}
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Trust line */}
        <motion.p
          className="text-center text-sm text-slate-500 mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          All plans include a 14-day money-back guarantee • Setup included • No credit card required for demo
        </motion.p>
      </div>
    </section>
  );
}

