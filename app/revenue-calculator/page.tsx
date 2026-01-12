'use client';

import { RevenueCalculator } from '@/components/RevenueCalculator';
import { motion } from 'framer-motion';

export default function RevenueCalculatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950/90 via-blue-950/80 to-slate-900/90 text-white pt-24 pb-16">
      <RevenueCalculator />
    </div>
  );
}

