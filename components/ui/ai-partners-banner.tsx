'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShiningText } from '@/components/ui/shining-text';

// Reusable BentoItem component with mouse tracking
const BentoItem = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const item = itemRef.current;
    if (!item) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      item.style.setProperty('--mouse-x', `${x}px`);
      item.style.setProperty('--mouse-y', `${y}px`);
    };

    item.addEventListener('mousemove', handleMouseMove);
    return () => {
      item.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={itemRef} className={`bento-item ${className || ''}`}>
      {children}
    </div>
  );
};

interface AIPartner {
  name: string;
  logo: string; // We'll use text/emoji for now, or you can add image paths later
  category: string;
}

const aiPartners: AIPartner[] = [
  { name: 'Zapier', logo: '⚡', category: 'Automation' },
  { name: 'Make', logo: '🔧', category: 'Automation' },
  { name: 'Bardeen', logo: '🎯', category: 'Automation' },
  { name: 'ChatGPT', logo: '💬', category: 'AI Assistant' },
  { name: 'Gemini', logo: '✨', category: 'AI Assistant' },
  { name: 'Bing', logo: '🔍', category: 'AI Assistant' },
  { name: 'Copilot X', logo: '🤖', category: 'Development' },
  { name: 'AskCodi', logo: '💻', category: 'Development' },
  { name: 'Code Whisperer', logo: '⌨️', category: 'Development' },
  { name: 'Opus Clip', logo: '🎬', category: 'Video' },
  { name: 'Cohesive', logo: '🎨', category: 'Content' },
  { name: 'Synthesia', logo: '🎭', category: 'Video' },
  { name: 'Midjourney', logo: '🖼️', category: 'Image' },
  { name: 'Adobe Firefly', logo: '🔥', category: 'Image' },
  { name: 'Microsoft Designer', logo: '🎨', category: 'Design' },
  { name: 'Tome', logo: '📄', category: 'Content' },
  { name: 'Decktopus', logo: '📊', category: 'Presentation' },
  { name: 'Gamma', logo: '📈', category: 'Presentation' },
  { name: 'Notion AI', logo: '📝', category: 'Productivity' },
  { name: 'Taskade', logo: '✅', category: 'Productivity' },
  { name: 'MeetGeek', logo: '🎤', category: 'Meeting' },
  { name: 'Runway', logo: '🎥', category: 'Video' },
  { name: 'Pictory', logo: '🎞️', category: 'Video' },
  { name: 'Descript', logo: '✂️', category: 'Video' },
  { name: '10Web', logo: '🌐', category: 'Web' },
  { name: 'Durable', logo: '🏗️', category: 'Web' },
  { name: 'Imagica', logo: '🖼️', category: 'Image' },
];

export const AIPartnersBanner = () => {
  return (
    <div className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-4">
            <ShiningText size="5xl" className="text-center">
              Powered by Industry-Leading AI
            </ShiningText>
          </div>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            We integrate with the world's most advanced AI platforms to deliver unparalleled automation solutions
          </p>
        </div>

        {/* Animated Sliding Banner */}
        <div className="relative overflow-hidden py-8">
          {/* Gradient overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-slate-950 via-slate-950/90 to-transparent z-10 pointer-events-none" />

          {/* Infinite scroll container */}
          <div className="flex gap-6 animate-scroll">
            {/* First set */}
            {aiPartners.map((partner, idx) => (
              <BentoItem key={`first-${idx}`} className="flex-shrink-0">
                <motion.div
                  className="relative h-36 w-56 rounded-xl bg-gradient-to-br from-slate-800/90 via-slate-800/70 to-slate-900/90 border-2 border-cyan-500/30 backdrop-blur-md overflow-hidden group hover:border-cyan-500/60 transition-all duration-300 shadow-lg shadow-cyan-500/10"
                  whileHover={{ scale: 1.08, y: -6 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                >
                  {/* Animated glow effect */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(93, 231, 254, 0.3), transparent 70%)`,
                    }}
                  />

                  {/* Subtle background pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(93,231,254,0.1)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]" />
                  </div>

                  <div className="relative z-10 h-full flex flex-col items-center justify-center p-5">
                    {/* Logo/Icon */}
                    <div className="text-5xl mb-3 filter drop-shadow-lg">{partner.logo}</div>
                    
                    {/* Partner Name */}
                    <div className="text-base font-bold text-white text-center mb-1 drop-shadow-sm">
                      {partner.name}
                    </div>
                    
                    {/* Category Badge */}
                    <div className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30">
                      <div className="text-xs font-medium text-cyan-300">{partner.category}</div>
                    </div>
                  </div>

                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  </div>
                </motion.div>
              </BentoItem>
            ))}

            {/* Duplicate set for seamless infinite loop */}
            {aiPartners.map((partner, idx) => (
              <BentoItem key={`second-${idx}`} className="flex-shrink-0">
                <motion.div
                  className="relative h-36 w-56 rounded-xl bg-gradient-to-br from-slate-800/90 via-slate-800/70 to-slate-900/90 border-2 border-cyan-500/30 backdrop-blur-md overflow-hidden group hover:border-cyan-500/60 transition-all duration-300 shadow-lg shadow-cyan-500/10"
                  whileHover={{ scale: 1.08, y: -6 }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(93, 231, 254, 0.3), transparent 70%)`,
                    }}
                  />

                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(93,231,254,0.1)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]" />
                  </div>

                  <div className="relative z-10 h-full flex flex-col items-center justify-center p-5">
                    <div className="text-5xl mb-3 filter drop-shadow-lg">{partner.logo}</div>
                    <div className="text-base font-bold text-white text-center mb-1 drop-shadow-sm">
                      {partner.name}
                    </div>
                    <div className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30">
                      <div className="text-xs font-medium text-cyan-300">{partner.category}</div>
                    </div>
                  </div>

                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  </div>
                </motion.div>
              </BentoItem>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50% - 1.5rem));
          }
        }

        .animate-scroll {
          animation: scroll 80s linear infinite;
          display: flex;
          width: fit-content;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }

        .bento-item {
          position: relative;
          --mouse-x: 50%;
          --mouse-y: 50%;
        }
      `}</style>
    </div>
  );
};

