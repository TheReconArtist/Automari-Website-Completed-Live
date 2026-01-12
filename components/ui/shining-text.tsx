'use client';

import { motion } from 'framer-motion';

interface ShiningTextProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
}

export const ShiningText = ({ children, className = '', size = '3xl' }: ShiningTextProps) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl sm:text-4xl',
    '4xl': 'text-4xl sm:text-5xl',
    '5xl': 'text-5xl sm:text-6xl md:text-7xl',
  };

  return (
    <>
      <style jsx>{`
        @keyframes electricBolt1 {
          0% {
            transform: translate3d(-15%, 0, 0);
            opacity: 0;
          }
          20% {
            opacity: 0;
          }
          25% {
            opacity: 0.15;
          }
          30% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
          70% {
            opacity: 0.3;
          }
          75% {
            opacity: 0.15;
          }
          80% {
            opacity: 0;
          }
          100% {
            transform: translate3d(115%, 0, 0);
            opacity: 0;
          }
        }

        @keyframes electricBolt2 {
          0% {
            transform: translate3d(-15%, 0, 0);
            opacity: 0;
          }
          25% {
            opacity: 0;
          }
          30% {
            opacity: 0.1;
          }
          35% {
            opacity: 0.25;
          }
          55% {
            opacity: 0.5;
          }
          75% {
            opacity: 0.25;
          }
          80% {
            opacity: 0.1;
          }
          85% {
            opacity: 0;
          }
          100% {
            transform: translate3d(115%, 0, 0);
            opacity: 0;
          }
        }

        @keyframes electricSpark {
          0%, 100% {
            opacity: 0;
            transform: translate3d(0, 0, 0) scaleY(0.2);
          }
          25% {
            opacity: 0.4;
            transform: translate3d(0, 0, 0) scaleY(1);
          }
          50% {
            opacity: 0.3;
            transform: translate3d(0, 0, 0) scaleY(0.6);
          }
          75% {
            opacity: 0;
            transform: translate3d(0, 0, 0) scaleY(0.2);
          }
        }

        @keyframes electricPulse {
          0%, 100% {
            transform: scaleX(0.8);
            opacity: 0.2;
          }
          50% {
            transform: scaleX(1.2);
            opacity: 0.5;
          }
        }

        @keyframes electricWave {
          0% {
            transform: translate3d(-150%, 0, 0);
            opacity: 0;
          }
          25% {
            opacity: 0;
          }
          30% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.3;
          }
          70% {
            opacity: 0.1;
          }
          75% {
            opacity: 0;
          }
          100% {
            transform: translate3d(250%, 0, 0);
            opacity: 0;
          }
        }

        @keyframes glowPulse {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }

        @keyframes fieldPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.25;
          }
        }

        .electric-bolt-1 {
          animation: electricBolt1 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          animation-delay: 0s;
        }

        .electric-bolt-2 {
          animation: electricBolt2 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          animation-delay: 1s;
        }

        .electric-spark {
          animation: electricSpark 0.6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        .electric-pulse {
          animation: electricPulse 2.5s ease-in-out infinite;
        }

        .electric-wave {
          animation: electricWave 4s ease-in-out infinite;
          animation-delay: 2.5s;
        }

        .glow-pulse {
          animation: glowPulse 2s ease-in-out infinite;
        }

        .field-pulse {
          animation: fieldPulse 3s ease-in-out infinite;
        }
      `}</style>

      <motion.h2
        className={`${sizeClasses[size]} font-bold relative inline-block ${className}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ 
          duration: 0.8,
          ease: [0.25, 0.1, 0.25, 1] // Professional cubic-bezier easing
        }}
        style={{ willChange: 'transform, opacity' }}
      >
        {/* Base text with gradient - visible text */}
        <span 
          className="relative z-20 inline-block"
          style={{
            background: 'linear-gradient(to right, #67e8f9, #3b82f6, #06b6d4, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: 'inline-block',
            willChange: 'auto',
          }}
        >
          {children}
        </span>

        {/* Professional GPU-accelerated Electricity Animation */}
        <span
          className="absolute inset-0 pointer-events-none z-30 overflow-hidden"
          style={{
            mixBlendMode: 'screen',
            willChange: 'transform',
            maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
          }}
        >
          {/* Main lightning bolt - GPU accelerated with smooth fade */}
          <div
            className="electric-bolt-1 absolute"
            style={{
              width: '2px',
              height: '120%',
              top: '-10%',
              left: 0,
              background: 'linear-gradient(to bottom, transparent 0%, transparent 10%, rgba(93, 231, 254, 0.1) 20%, rgba(59, 130, 246, 0.3) 40%, rgba(93, 231, 254, 0.2) 50%, rgba(59, 130, 246, 0.3) 60%, rgba(93, 231, 254, 0.1) 80%, transparent 90%, transparent 100%)',
              boxShadow: `
                0 0 4px rgba(93, 231, 254, 0.4),
                0 0 8px rgba(59, 130, 246, 0.3),
                -1px 0 2px rgba(93, 231, 254, 0.3),
                1px 0 2px rgba(59, 130, 246, 0.3)
              `,
              filter: 'blur(0.8px)',
              willChange: 'transform, opacity',
            }}
          />

          {/* Secondary lightning bolt with smooth fade */}
          <div
            className="electric-bolt-2 absolute"
            style={{
              width: '1.5px',
              height: '110%',
              top: '-5%',
              left: 0,
              background: 'linear-gradient(to bottom, transparent 0%, transparent 15%, rgba(59, 130, 246, 0.15) 25%, rgba(93, 231, 254, 0.25) 40%, rgba(59, 130, 246, 0.2) 50%, rgba(93, 231, 254, 0.25) 60%, rgba(59, 130, 246, 0.15) 75%, transparent 85%, transparent 100%)',
              boxShadow: `
                0 0 3px rgba(59, 130, 246, 0.3),
                0 0 6px rgba(93, 231, 254, 0.25),
                -1px 0 2px rgba(59, 130, 246, 0.25),
                1px 0 2px rgba(93, 231, 254, 0.25)
              `,
              filter: 'blur(0.6px)',
              willChange: 'transform, opacity',
            }}
          />

          {/* Electric sparks - optimized and subtle */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="electric-spark absolute"
              style={{
                width: '0.5px',
                height: '70%',
                top: '15%',
                left: `${20 + i * 25}%`,
                background: 'linear-gradient(to bottom, transparent, rgba(93, 231, 254, 0.5), rgba(59, 130, 246, 0.4), transparent)',
                boxShadow: '0 0 3px rgba(93, 231, 254, 0.4), 0 0 6px rgba(59, 130, 246, 0.3)',
                animationDelay: `${2 + i * 1.2}s`,
                willChange: 'transform, opacity',
              }}
            />
          ))}

          {/* Electric energy pulse waves - subtle */}
          <div
            className="electric-pulse absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 100% 50% at 50% 50%, rgba(93, 231, 254, 0.1) 0%, transparent 60%)',
              willChange: 'transform, opacity',
            }}
          />

          {/* Electric field distortion - subtle */}
          <div
            className="electric-wave absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.08), rgba(93, 231, 254, 0.1), rgba(59, 130, 246, 0.08), transparent)',
              filter: 'blur(3px)',
              willChange: 'transform, opacity',
            }}
          />
        </span>

        {/* Electric energy glow behind - GPU optimized */}
        <span
          className="glow-pulse absolute inset-0 pointer-events-none z-0"
          style={{
            background: 'linear-gradient(to right, #06b6d4, #3b82f6, #06b6d4, #67e8f9, #3b82f6)',
            filter: 'blur(25px) drop-shadow(0 0 20px rgba(93, 231, 254, 0.5))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            willChange: 'opacity',
          }}
        >
          {children}
        </span>

        {/* Additional electric field effect */}
        <span
          className="field-pulse absolute inset-0 pointer-events-none z-10"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(93, 231, 254, 0.2) 0%, transparent 50%)',
            filter: 'blur(15px)',
            willChange: 'transform, opacity',
          }}
        />
      </motion.h2>
    </>
  );
};

