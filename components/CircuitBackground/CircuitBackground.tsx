'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { init as initCircuitDraw } from './drawCircuit';

interface CircuitBackgroundProps {
  intensity?: number;   // default 0.18 (global alpha)
  speed?: number;       // default 1.0 (multiplier)
  interactive?: boolean;// default true
}

const CircuitBackground: React.FC<CircuitBackgroundProps> = ({
  intensity = 0.18,
  speed = 1.0,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const circuitDrawInstance = useRef<ReturnType<typeof initCircuitDraw> | null>(null);

  const getCssVar = useCallback((name: string, fallback: string) => {
    if (typeof window === 'undefined') return fallback;
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  }, []);

  // Throttled resize handler
  const resizeObserver = useRef<ResizeObserver | null>(null);
  const resizeTimeout = useRef<NodeJS.Timeout | null>(null);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setContext(ctx);

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Initialize drawCircuit module
    if (!circuitDrawInstance.current) {
      circuitDrawInstance.current = initCircuitDraw(ctx, canvas, {
        dpr,
        width: rect.width,
        height: rect.height,
        intensity,
        speed,
        interactive,
        prefersReducedMotion,
        colors: {
          brand: getCssVar('--auto-brand', '#5DE7FE'),
          accent: getCssVar('--auto-accent', '#00E7FF'),
          muted: getCssVar('--auto-muted', '#1D5F83'),
          deep: getCssVar('--auto-deep', '#0A1B22'),
        },
        mobileCaps: true,
      });
    } else {
      // If instance exists, just update its options and redraw (for resize or prop changes)
      circuitDrawInstance.current.updateOptions({
        dpr,
        width: rect.width,
        height: rect.height,
        intensity,
        speed,
        interactive,
        prefersReducedMotion,
        colors: {
          brand: getCssVar('--auto-brand', '#5DE7FE'),
          accent: getCssVar('--auto-accent', '#00E7FF'),
          muted: getCssVar('--auto-muted', '#1D5F83'),
          deep: getCssVar('--auto-deep', '#0A1B22'),
        },
      });
      circuitDrawInstance.current.draw();
    }
  }, [intensity, speed, interactive, prefersReducedMotion, getCssVar]);

  // Animation loop
  useEffect(() => {
    if (!context || prefersReducedMotion) return;

    let frameCount = 0;
    let lastFrameTime = performance.now();

    const animate = () => {
      const now = performance.now();
      const deltaTime = now - lastFrameTime;
      lastFrameTime = now;
      frameCount++;

      if (circuitDrawInstance.current) {
        circuitDrawInstance.current.animate(deltaTime); // Pass deltaTime to the animate function
      }
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [context, prefersReducedMotion]);

  useEffect(() => {
    if (typeof window === 'undefined') return; // Ensure window is defined

    resizeObserver.current = new ResizeObserver(() => {
      if (resizeTimeout.current) clearTimeout(resizeTimeout.current);
      resizeTimeout.current = setTimeout(() => {
        setupCanvas();
      }, 200); // Throttle resize updates
    });

    if (canvasRef.current) {
      resizeObserver.current.observe(canvasRef.current);
    }

    setupCanvas(); // Initial setup

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current); // Cancel animation frame on unmount
      if (resizeTimeout.current) clearTimeout(resizeTimeout.current);
      if (resizeObserver.current && canvasRef.current) {
        resizeObserver.current.unobserve(canvasRef.current);
      }
    };
  }, [setupCanvas]);

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden"> {/* Changed z-[1] to z-[-1] */}
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
    </div>
  );
};

export default CircuitBackground;
