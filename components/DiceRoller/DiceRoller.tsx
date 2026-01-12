'use client';

import { motion } from 'framer-motion';

interface DiceRollerProps {
  className?: string;
}

export default function DiceRoller({ className = '' }: DiceRollerProps) {
  return (
    <motion.div 
      className={`relative ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="w-full h-[450px] rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl shadow-cyan-500/10">
        <iframe
          src="/dice-roller.html"
          className="w-full h-full border-0"
          title="Interactive Dice Roller"
          allow="accelerometer; autoplay"
        />
      </div>
    </motion.div>
  );
}
