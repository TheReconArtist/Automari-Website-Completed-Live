'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface NavigationProps {
  onStartAssessment?: () => void;
}

const navLinks = [
  { label: 'Our Agents', href: '#agents' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Results', href: '#results' },
];

export function Navigation({ onStartAssessment }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      if (isMenuOpen && window.scrollY > 100) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMenuOpen]);

  return (
    <>
      {/* Top Contact Bar - Hidden on scroll for cleaner look */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[60] bg-slate-950/95 border-b border-slate-800/50"
        initial={{ y: 0 }}
        animate={{ y: isScrolled ? -40 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10 text-sm">
            <div className="hidden sm:flex items-center gap-6">
              <a
                href="tel:561-201-4365"
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
              >
                <Phone className="h-3.5 w-3.5 text-cyan-400 group-hover:text-cyan-300" />
                <span>561-201-4365</span>
              </a>
              <a
                href="mailto:contactautomari@gmail.com"
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
              >
                <Mail className="h-3.5 w-3.5 text-cyan-400 group-hover:text-cyan-300" />
                <span>contactautomari@gmail.com</span>
              </a>
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-amber-400">★</span>
                ))}
                <span className="text-amber-400 font-semibold ml-1">Five Star Rated Agency</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Navigation */}
      <motion.nav
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'top-0 bg-slate-950/98 backdrop-blur-xl border-b border-cyan-500/10 shadow-lg shadow-cyan-500/5'
            : 'top-10 bg-slate-950/80 backdrop-blur-md'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <motion.a
              href="/"
              className="flex items-center gap-3 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative w-11 h-11 lg:w-12 lg:h-12">
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/40 to-blue-600/40 blur-lg opacity-60 group-hover:opacity-100 transition-opacity" />
                {/* Logo container */}
                <div className="relative w-full h-full rounded-xl bg-slate-900/90 border border-cyan-500/30 group-hover:border-cyan-400/50 transition-colors overflow-hidden p-1.5">
                  <Image
                    src="/automari-logo.png"
                    alt="Automari"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span
                  className="text-xl lg:text-2xl font-bold tracking-tight"
                  style={{
                    background: 'linear-gradient(135deg, #67e8f9 0%, #3b82f6 50%, #06b6d4 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Automari
                </span>
                <span className="text-[10px] lg:text-xs text-slate-500 font-medium tracking-widest uppercase -mt-0.5">
                  AI Agency
                </span>
              </div>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-all"
                  whileHover={{ y: -1 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Secondary CTA */}
              <Button
                variant="ghost"
                className="text-slate-300 hover:text-white hover:bg-white/5 font-medium"
                asChild
              >
                <a href="/pricing">View Pricing</a>
              </Button>

              {/* Primary CTA */}
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  onClick={onStartAssessment}
                  className="relative px-6 py-2.5 font-semibold text-white overflow-hidden group"
                  style={{
                    background: 'linear-gradient(135deg, #0891b2 0%, #3b82f6 100%)',
                    boxShadow: '0 4px 20px rgba(6, 182, 212, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                  }}
                >
                  {/* Shine effect */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative flex items-center gap-2">
                    Book a Call
                    <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                  </span>
                </Button>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-3">
              <Button
                onClick={onStartAssessment}
                size="sm"
                className="text-xs px-3 font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #0891b2 0%, #3b82f6 100%)',
                }}
              >
                Book Call
              </Button>
              <motion.button
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                whileTap={{ scale: 0.95 }}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5 text-white" />
                ) : (
                  <Menu className="h-5 w-5 text-white" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="lg:hidden absolute top-full left-0 right-0 bg-slate-950/98 backdrop-blur-xl border-b border-slate-800/50"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="max-w-7xl mx-auto px-4 py-6 space-y-1">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    className="block px-4 py-3 text-base font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </motion.a>
                ))}

                <div className="pt-4 mt-4 border-t border-slate-800/50 space-y-3">
                  <a
                    href="tel:561-201-4365"
                    className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white transition-colors"
                  >
                    <Phone className="h-4 w-4 text-cyan-400" />
                    <span>561-201-4365</span>
                  </a>
                  <a
                    href="mailto:contactautomari@gmail.com"
                    className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white transition-colors"
                  >
                    <Mail className="h-4 w-4 text-cyan-400" />
                    <span>contactautomari@gmail.com</span>
                  </a>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onStartAssessment?.();
                    }}
                    className="w-full py-3 font-semibold"
                    style={{
                      background: 'linear-gradient(135deg, #0891b2 0%, #3b82f6 100%)',
                    }}
                  >
                    Start Free Assessment
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}

