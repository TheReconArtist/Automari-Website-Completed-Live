'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { animate as animateMotion, motion, useInView, useMotionValue, useTransform } from 'framer-motion';
import { ArrowRight, Play, Sparkles, TrendingUp, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';

// Lazy load the Neural Network for better initial load
const NeuralNetwork = dynamic(() => import('@/components/NeuralNetwork/NeuralNetwork'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-slate-950" />,
});

interface HeroSectionProps {
  onStartAssessment: () => void;
}

const heroMorphTexts = ['Your Business', 'Powered by AI'];
const heroSubheadline =
  'We build custom agentic AI solutions that streamline business operations for just about everything in a company. Yes, just about everything.';
const morphTime = 1.5;
const cooldownTime = 0.5;
const revealBandHalf = 17;
const revealStart = -revealBandHalf;
const revealEnd = 100 + revealBandHalf;

function useMorphingText(texts: string[]) {
  const textIndexRef = useRef(0);
  const morphRef = useRef(0);
  const cooldownRef = useRef(0);
  const timeRef = useRef(new Date());
  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);

  const setStyles = useCallback(
    (fraction: number) => {
      const [current1, current2] = [text1Ref.current, text2Ref.current];
      if (!current1 || !current2 || texts.length === 0) return;

      current2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      current2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      const invertedFraction = 1 - fraction;
      current1.style.filter = `blur(${Math.min(8 / invertedFraction - 8, 100)}px)`;
      current1.style.opacity = `${Math.pow(invertedFraction, 0.4) * 100}%`;

      current1.textContent = texts[textIndexRef.current % texts.length];
      current2.textContent = texts[(textIndexRef.current + 1) % texts.length];
    },
    [texts]
  );

  const doMorph = useCallback(() => {
    morphRef.current -= cooldownRef.current;
    cooldownRef.current = 0;

    let fraction = morphRef.current / morphTime;

    if (fraction > 1) {
      cooldownRef.current = cooldownTime;
      fraction = 1;
    }

    setStyles(fraction);

    if (fraction === 1) {
      textIndexRef.current++;
    }
  }, [setStyles]);

  const doCooldown = useCallback(() => {
    morphRef.current = 0;
    const [current1, current2] = [text1Ref.current, text2Ref.current];
    if (current1 && current2) {
      current2.style.filter = 'none';
      current2.style.opacity = '100%';
      current1.style.filter = 'none';
      current1.style.opacity = '0%';
    }
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const newTime = new Date();
      const dt = (newTime.getTime() - timeRef.current.getTime()) / 1000;
      timeRef.current = newTime;

      cooldownRef.current -= dt;

      if (cooldownRef.current <= 0) doMorph();
      else doCooldown();
    };

    animate();
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [doMorph, doCooldown]);

  return { text1Ref, text2Ref };
}

function MorphingText({ texts, className }: { texts: string[]; className?: string }) {
  const { text1Ref, text2Ref } = useMorphingText(texts);

  return (
    <div
      className={cn(
        'relative h-16 w-full max-w-xl font-sans text-4xl font-bold leading-none tracking-tight text-cyan-300 [filter:url(#hero-threshold)_blur(0.6px)] [text-shadow:0_0_28px_rgba(34,211,238,0.55),0_0_72px_rgba(59,130,246,0.28)] sm:h-20 sm:text-5xl lg:h-24 lg:text-6xl xl:text-7xl',
        className
      )}
    >
      <span className="absolute inset-x-0 top-0 inline-block w-full" ref={text1Ref} />
      <span className="absolute inset-x-0 top-0 inline-block w-full" ref={text2Ref} />
      <svg className="hidden" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <filter id="hero-threshold">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

function buildRevealGradient(pos: number, colors: string[], textColor: string) {
  const bandStart = pos - revealBandHalf;
  const bandEnd = pos + revealBandHalf;

  if (bandStart >= 100) {
    return `linear-gradient(90deg, ${textColor}, ${textColor})`;
  }

  const parts: string[] = [];

  if (bandStart > 0) {
    parts.push(`${textColor} 0%`, `${textColor} ${bandStart.toFixed(2)}%`);
  }

  colors.forEach((color, index) => {
    const pct =
      colors.length === 1
        ? pos
        : bandStart + (index / (colors.length - 1)) * revealBandHalf * 2;

    parts.push(`${color} ${pct.toFixed(2)}%`);
  });

  if (bandEnd < 100) {
    parts.push(`${textColor} ${bandEnd.toFixed(2)}%`, `${textColor} 100%`);
  }

  return `linear-gradient(90deg, ${parts.join(', ')})`;
}

function DiaTextReveal({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const spanRef = useRef<HTMLSpanElement | null>(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const inView = useInView(spanRef, { once: true, amount: 0.35 });
  const sweepPos = useMotionValue(revealStart);
  const backgroundImage = useTransform(sweepPos, (pos) =>
    buildRevealGradient(
      pos,
      ['#38bdf8', '#22d3ee', '#60a5fa', '#0ea5e9', '#bae6fd'],
      'rgba(226, 232, 240, 0.92)'
    )
  );

  useEffect(() => {
    if (!inView || hasPlayed) return;
    setHasPlayed(true);

    const controls = animateMotion(sweepPos, revealEnd, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1],
    });

    return () => controls.stop();
  }, [hasPlayed, inView, sweepPos]);

  const contentStyle = useMemo(
    () => ({
      backgroundImage,
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent',
    }),
    [backgroundImage]
  );

  return (
    <motion.span
      ref={spanRef}
      className={cn(
        'inline leading-relaxed drop-shadow-[0_0_24px_rgba(14,165,233,0.28)]',
        className
      )}
      style={contentStyle}
    >
      {text}
    </motion.span>
  );
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
              className="mb-6 flex justify-center lg:justify-start"
            >
              <span className="relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-cyan-300/25 bg-white/[0.055] px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-cyan-100/90 shadow-[0_0_34px_rgba(34,211,238,0.16),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-2xl before:absolute before:inset-x-4 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/70 before:to-transparent">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.85)]" />
                South Florida&apos;s Premier AI Agency
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mb-6"
            >
              <h1 className="sr-only">Your Business Powered by AI</h1>
              <MorphingText texts={heroMorphTexts} className="mx-auto lg:mx-0" />
            </motion.div>

            {/* Subheadline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-xl mx-auto lg:mx-0 mb-8"
            >
              <p className="relative overflow-hidden rounded-2xl border border-cyan-300/20 bg-white/[0.055] px-5 py-4 text-lg font-medium leading-relaxed text-slate-100/90 shadow-[0_0_52px_rgba(8,145,178,0.16),inset_0_1px_0_rgba(255,255,255,0.16),inset_0_-1px_0_rgba(14,165,233,0.08)] backdrop-blur-2xl before:absolute before:inset-x-6 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-cyan-100/70 before:to-transparent after:absolute after:-right-12 after:-top-16 after:h-32 after:w-32 after:rounded-full after:bg-cyan-300/10 after:blur-2xl sm:text-xl lg:text-2xl">
                <DiaTextReveal text={heroSubheadline} />
              </p>
            </motion.div>

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
                  className="relative overflow-hidden rounded-xl border border-cyan-200/20 px-8 py-6 text-lg font-semibold text-white shadow-[0_12px_42px_rgba(6,182,212,0.30),inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-xl group"
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
                className="rounded-xl border-cyan-300/20 bg-white/[0.055] px-8 py-6 text-lg font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-2xl hover:border-cyan-300/35 hover:bg-white/[0.085]"
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
                { value: '$40K+', label: 'Saved Yearly' },
                { value: '20-50', label: 'Hrs/Week Saved' },
                { value: '99%', label: 'Satisfaction' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden text-center p-3 rounded-xl border border-cyan-300/20 bg-white/[0.055] backdrop-blur-2xl shadow-[0_0_34px_rgba(8,145,178,0.18),inset_0_1px_0_rgba(255,255,255,0.16),inset_0_-1px_0_rgba(14,165,233,0.08)]"
                >
                  <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
                  <div className="text-xl font-extrabold tracking-tight text-cyan-300 drop-shadow-[0_0_16px_rgba(34,211,238,0.72)]">
                    {stat.value}
                  </div>
                  <div className="text-xs font-medium text-slate-300/85">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column - Floating Value Cards (Desktop only) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative hidden min-h-[640px] lg:block pointer-events-auto"
          >
            <div className="absolute left-10 top-2 max-w-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-200/70">
                Average Client Savings
              </p>
              <p className="mt-2 text-sm text-slate-300/75">
                Floating impact cards that keep the particle field visible.
              </p>
            </div>

            <div className="absolute inset-0 [perspective:1200px]">
              <svg
                className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible opacity-70"
                viewBox="0 0 560 640"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M170 190 C 250 220, 295 230, 390 258"
                  stroke="url(#savingsConnectorGradient)"
                  strokeWidth="1.5"
                  strokeDasharray="7 9"
                  className="drop-shadow-[0_0_10px_rgba(34,211,238,0.55)]"
                />
                <path
                  d="M395 315 C 320 350, 255 365, 190 386"
                  stroke="url(#savingsConnectorGradient)"
                  strokeWidth="1.5"
                  strokeDasharray="7 9"
                  className="drop-shadow-[0_0_10px_rgba(34,211,238,0.55)]"
                />
                <path
                  d="M195 440 C 280 462, 325 485, 405 516"
                  stroke="url(#savingsConnectorGradient)"
                  strokeWidth="1.5"
                  strokeDasharray="7 9"
                  className="drop-shadow-[0_0_10px_rgba(34,211,238,0.55)]"
                />
                {[170, 390, 190, 405].map((x, i) => (
                  <circle
                    key={i}
                    cx={x}
                    cy={[190, 258, 386, 516][i]}
                    r="4"
                    fill="rgb(103 232 249)"
                    className="drop-shadow-[0_0_12px_rgba(103,232,249,0.9)]"
                  />
                ))}
                <defs>
                  <linearGradient id="savingsConnectorGradient" x1="120" y1="180" x2="450" y2="520" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#22d3ee" stopOpacity="0" />
                    <stop offset="0.48" stopColor="#67e8f9" stopOpacity="0.75" />
                    <stop offset="1" stopColor="#a78bfa" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>

              {[
                {
                  icon: TrendingUp,
                  value: '$40,000+',
                  label: 'Annual labor savings',
                  color: 'text-cyan-300',
                  className: 'left-0 top-28 z-40 -rotate-3 -skew-y-[4deg]',
                },
                {
                  icon: Clock,
                  value: '20-50',
                  label: 'Hours saved weekly',
                  color: 'text-emerald-300',
                  className: 'right-2 top-[13.5rem] z-30 rotate-2 -skew-y-[4deg]',
                },
                {
                  icon: Shield,
                  value: '99%',
                  label: 'Client satisfaction',
                  color: 'text-amber-300',
                  className: 'left-10 top-[21rem] z-20 rotate-2 -skew-y-[4deg]',
                },
                {
                  icon: Sparkles,
                  value: '24/7',
                  label: 'Always available',
                  color: 'text-purple-300',
                  className: 'right-10 top-[28.5rem] z-10 -rotate-2 -skew-y-[4deg]',
                },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 28, rotateX: -10 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.65 + i * 0.12, duration: 0.7 }}
                  whileHover={{ y: -12, scale: 1.03, rotate: 0, skewY: 0 }}
                  className={cn(
                    'absolute flex h-[7rem] w-[15.75rem] select-none flex-col justify-between rounded-2xl border border-cyan-200/18 bg-slate-950/40 px-5 py-4 shadow-[0_18px_55px_rgba(8,47,73,0.24),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-md transition-all duration-500 hover:border-cyan-200/35 hover:bg-slate-950/55 hover:shadow-[0_22px_70px_rgba(34,211,238,0.18),inset_0_1px_0_rgba(255,255,255,0.22)]',
                    'before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/[0.09] before:via-transparent before:to-cyan-300/[0.06] before:content-[""]',
                    item.className,
                  )}
                >
                  <div className="relative flex items-center gap-3">
                    <span className="inline-flex rounded-full bg-cyan-400/10 p-2 ring-1 ring-cyan-200/20">
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                    </span>
                    <span className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-300/85">
                      {item.label}
                    </span>
                  </div>
                  <div className="relative text-3xl font-extrabold tracking-tight text-cyan-100 drop-shadow-[0_0_18px_rgba(34,211,238,0.42)]">
                    {item.value}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none z-[3]" />
    </section>
  );
}
