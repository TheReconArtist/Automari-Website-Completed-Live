'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How long does setup take?',
    answer: 'Most businesses are fully operational within 48-72 hours. We handle all the technical integration, training, and testing. You just provide access to your systems and answer a few questions about your business.',
  },
  {
    question: 'Will AI make mistakes with my customers?',
    answer: 'Our agents are trained specifically on your business data, brand voice, and escalation rules. They know when to hand off to a human. Most clients see 99%+ accuracy after the first week of learning.',
  },
  {
    question: 'What if I already use [CRM/tool]?',
    answer: 'We integrate with 200+ platforms including Salesforce, HubSpot, Zendesk, Calendly, and more. If you use it, we can likely connect to it. And if not, we will build a custom integration.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We\'re SOC 2 Type II compliant, your data never trains public AI models, and we support HIPAA, GDPR, and CCPA requirements. Enterprise-grade security is standard, not optional.',
  },
  {
    question: 'What\'s the ROI timeline?',
    answer: 'Most clients see positive ROI within 30-45 days. The average business saves 15-20 hours per week and captures 40% more leads they were previously missing. We provide real-time dashboards so you can track every metric.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes. We offer month-to-month contracts after the initial 90-day onboarding period. No long-term lock-ins. We keep clients by delivering results, not contracts.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-cyan-400 text-sm font-medium uppercase tracking-wider">
            Common Questions
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white">
            Frequently Asked Questions
          </h2>
        </motion.div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-800/30 transition-colors"
                >
                  <span className="font-medium text-white pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 pb-5 text-slate-400 text-sm leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

