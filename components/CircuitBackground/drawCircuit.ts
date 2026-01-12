interface CircuitDrawOptions {
  dpr: number;
  width: number;
  height: number;
  intensity: number;
  speed: number;
  interactive: boolean;
  prefersReducedMotion: boolean;
  colors: {
    brand: string;
    accent: string;
    muted: string;
    deep: string;
  };
  mobileCaps: boolean;
}

// Exposed init function for CircuitBackground.tsx
export function init(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, options: CircuitDrawOptions) {
  let currentOptions = { ...options };
  let animationFrameId: number | null = null;

  // Internal animation state
  let mouse = { x: 0, y: 0, velocityX: 0, velocityY: 0, lastX: 0, lastY: 0 };
  let cameraOffset = { x: 0, y: 0 };
  let lastFrameTime = 0; // Initialize lastFrameTime
  const FRAME_BUDGET_MS = 18; // Target 60fps (1000/60 = 16.67ms), allow a bit more for Canvas 2D

  // Offscreen canvas for logo processing and glow compositing
  const offscreenCanvas = document.createElement('canvas');
  const offscreenCtx = offscreenCanvas.getContext('2d')!;

  // Offscreen canvas for edge detection (binary mask)
  const edgeCanvas = document.createElement('canvas');
  const edgeCtx = edgeCanvas.getContext('2d')!;

  // Offscreen canvas for glow compositing (to reduce main canvas redraws of shadows)
  const glowCanvas = document.createElement('canvas');
  const glowCtx = glowCanvas.getContext('2d')!;

  // Placeholder for logo image and processed data
  const logoImage = new Image();
  let logoLoaded = false;
  let edgePoints: { x: number; y: number }[] = [];
  let binaryMask: Uint8ClampedArray | null = null; // Stored binary mask data

  // Primary circuit paths and nodes
  let primaryCircuitPaths: { p1: { x: number; y: number; originalX: number; originalY: number }, cp: { x: number; y: number }, p2: { x: number; y: number; originalX: number; originalY: number }, pulses: { t: number; delay: number; size: number }[] }[] = [];
  let circuitNodes: { x: number; y: number }[] = [];

  // Ambient network nodes and edges
  let ambientNodes: { x: number; y: number; dx: number; dy: number }[] = [];
  let ambientEdges: { start: { x: number; y: number }, end: { x: number; y: number } }[] = [];

  // Pulse animation properties
  const NUM_PULSES_PER_EDGE = 3; // Number of pulses per circuit segment
  const PULSE_SIZE = 2; // Base pulse size
  const PULSE_SPEED_MULTIPLIER = 0.00002; // Drastically slower pulses

  // --- Helper Functions (to be implemented) ---
  const getScaledCanvasSize = () => {
    const rect = canvas.getBoundingClientRect();
    return { scaledWidth: rect.width, scaledHeight: rect.height };
  };

  const loadImageAndProcess = () => {
    logoImage.src = '/automari-logo.png';
    logoImage.onload = () => {
      logoLoaded = true;
      console.info("Logo loaded successfully. Processing...");
      resize(); // Initial resize to draw logo and setup canvases
    };
    logoImage.onerror = () => {
      console.error("Failed to load /public/automari-logo.png. Please ensure it exists.");
      logoLoaded = false; // Mark as failed to prevent further processing attempts
      resize(); // Still call resize to setup canvas even without logo
    };
  };

  const processLogoForEdges = () => {
    if (!logoLoaded || !offscreenCanvas.width || !offscreenCanvas.height) return;

    // Clear and draw logo to offscreen canvas for processing
    offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    offscreenCtx.drawImage(logoImage, 0, 0, offscreenCanvas.width, offscreenCanvas.height);

    const imageData = offscreenCtx.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    const data = imageData.data;
    
    // Simple binary mask: anything with alpha > 0 is considered part of the logo
    binaryMask = new Uint8ClampedArray(offscreenCanvas.width * offscreenCanvas.height);
    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3];
      binaryMask[i / 4] = alpha > 0 ? 1 : 0;
    }

    // Edge detection (8-neighbor edge detect on the binary mask)
    edgePoints = [];
    const width = offscreenCanvas.width;
    const height = offscreenCanvas.height;

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const i = y * width + x;
        if (binaryMask[i] === 1) { // If it's part of the logo
          // Check 8 neighbors
          const isEdge = (
            binaryMask[i - 1] === 0 || // Left
            binaryMask[i + 1] === 0 || // Right
            binaryMask[i - width] === 0 || // Top
            binaryMask[i + width] === 0 || // Bottom
            binaryMask[i - width - 1] === 0 || // Top-left
            binaryMask[i - width + 1] === 0 || // Top-right
            binaryMask[i + width - 1] === 0 || // Bottom-left
            binaryMask[i + width + 1] === 0    // Bottom-right
          );

          if (isEdge) {
            edgePoints.push({ x, y });
          }
        }
      }
    }
  };

  const generatePrimaryCircuitPaths = () => {
    if (!logoLoaded || edgePoints.length === 0) return;

    primaryCircuitPaths = [];
    circuitNodes = [];

    const numPaths = currentOptions.mobileCaps ? 3 : 6; // Further reduced path count for mobile/desktop
    const sampleInterval = Math.floor(edgePoints.length / numPaths);

    for (let i = 0; i < numPaths; i++) {
      let p1 = edgePoints[i * sampleInterval];
      let p2 = edgePoints[(i * sampleInterval + sampleInterval * 0.8) % edgePoints.length]; // Slightly offset p2
      let cp = edgePoints[(i * sampleInterval + sampleInterval * 0.4) % edgePoints.length]; // Control point in between

      if (!p1 || !p2 || !cp) continue; // Ensure points exist

      // Store original (scaled by DPR) positions to accurately calculate distances for pulses
      const originalP1 = { x: p1.x / currentOptions.dpr, y: p1.y / currentOptions.dpr };
      const originalP2 = { x: p2.x / currentOptions.dpr, y: p2.y / currentOptions.dpr };

      const path = {
        p1: { ...p1, originalX: originalP1.x, originalY: originalP1.y },
        cp: { x: cp.x, y: cp.y },
        p2: { ...p2, originalX: originalP2.x, originalY: originalP2.y },
        pulses: Array.from({ length: currentOptions.mobileCaps ? 1 : 2 }).map(() => ({ // Reduced pulses per edge for mobile/desktop
          t: Math.random(), // Initial random position along the path (0 to 1)
          delay: Math.random() * 8000, // Longer random delay before starting animation
          size: PULSE_SIZE * (Math.random() * 0.4 + 0.6), // Smaller, tighter pulse size
        })),
      };
      primaryCircuitPaths.push(path);

      // Add nodes at path start, end, and control point
      circuitNodes.push({ x: p1.x, y: p1.y });
      circuitNodes.push({ x: p2.x, y: p2.y });
      circuitNodes.push({ x: cp.x, y: cp.y });
    }

    // Filter out duplicate nodes
    circuitNodes = circuitNodes.filter((node, index, self) =>
      index === self.findIndex((t) => (t.x === node.x && t.y === node.y))
    );
  };

  const isPixelTransparent = (x: number, y: number): boolean => {
    if (!binaryMask || x < 0 || x >= offscreenCanvas.width || y < 0 || y >= offscreenCanvas.height) {
      return true; // Consider out of bounds as transparent
    }
    const index = y * offscreenCanvas.width + x;
    return binaryMask[index] === 0;
  };

  // Helper to get a point on a quadratic Bézier curve
  const getPointOnQuadraticBezier = (p1: { x: number; y: number }, cp: { x: number; y: number }, p2: { x: number; y: number }, t: number) => {
    const x = (1 - t) * (1 - t) * p1.x + 2 * (1 - t) * t * cp.x + t * t * p2.x;
    const y = (1 - t) * (1 - t) * p1.y + 2 * (1 - t) * t * cp.y + t * t * p2.y;
    return { x, y };
  };

  const generateAmbientNetwork = () => {
    ambientNodes = [];
    ambientEdges = [];

    const numAmbientNodes = currentOptions.mobileCaps ? 30 : 80; // Further reduced ambient nodes for mobile/desktop
    const { scaledWidth, scaledHeight } = getScaledCanvasSize();
    const maxAmbientNodeAttempts = 1000; // Prevent infinite loops

    for (let i = 0; i < numAmbientNodes; i++) {
      let attempts = 0;
      let randomX, randomY;
      do {
        randomX = Math.random() * scaledWidth;
        randomY = Math.random() * scaledHeight;
        attempts++;
      } while (!isPixelTransparent(Math.floor(randomX * currentOptions.dpr), Math.floor(randomY * currentOptions.dpr)) && attempts < maxAmbientNodeAttempts);

      if (attempts === maxAmbientNodeAttempts) continue; // Skip if unable to find transparent spot

      ambientNodes.push({
        x: randomX,
        y: randomY,
        dx: (Math.random() - 0.5) * currentOptions.speed * 0.003, // Even slower drift for ambient
        dy: (Math.random() - 0.5) * currentOptions.speed * 0.003,
      });
    }

    // Generate k-nearest edges for ambient network
    const k = 2; // Connect to 2 nearest neighbors
    for (let i = 0; i < ambientNodes.length; i++) {
      const nodeA = ambientNodes[i];
      const distances: { dist: number; nodeB: typeof nodeA }[] = [];

      for (let j = 0; j < ambientNodes.length; j++) {
        if (i === j) continue;
        const nodeB = ambientNodes[j];
        const dist = Math.hypot(nodeA.x - nodeB.x, nodeA.y - nodeB.y);
        distances.push({ dist, nodeB });
      }

      distances.sort((a, b) => a.dist - b.dist);

      for (let j = 0; j < Math.min(k, distances.length); j++) {
        if (distances[j].dist < scaledWidth / 12) { // Smaller connection range for subtlety
          ambientEdges.push({
            start: { x: nodeA.x, y: nodeA.y },
            end: { x: distances[j].nodeB.x, y: distances[j].nodeB.y },
          });
        }
      }
    }
  };

  const updatePulseAnimations = (deltaTime: number) => {
    primaryCircuitPaths.forEach(path => {
      path.pulses.forEach(pulse => {
        pulse.delay -= deltaTime; // Countdown delay
        if (pulse.delay <= 0) {
          pulse.t += (currentOptions.speed * PULSE_SPEED_MULTIPLIER * deltaTime); // Move pulse along path
          if (pulse.t > 1) {
            pulse.t = 0; // Reset to start
            pulse.delay = Math.random() * 8000; // Longer random delay for next cycle
            pulse.size = PULSE_SIZE * (Math.random() * 0.4 + 0.6); // Smaller, tighter pulse size
          }
        }
      });
    });
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!currentOptions.interactive || currentOptions.prefersReducedMotion) return;
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
  };

  const updateCameraOffset = (deltaTime: number) => {
    mouse.velocityX = (mouse.x - mouse.lastX) / deltaTime;
    mouse.velocityY = (mouse.y - mouse.lastY) / deltaTime;
    mouse.lastX = mouse.x;
    mouse.lastY = mouse.y;

    // Dampen velocity
    mouse.velocityX *= 0.8; // More damping for subtle parallax
    mouse.velocityY *= 0.8;

    // Update camera offset, clamped
    const maxOffset = currentOptions.mobileCaps ? 1 : 3; // Even smaller max offset for parallax
    cameraOffset.x += mouse.velocityX * 0.05; // Less sensitive parallax
    cameraOffset.y += mouse.velocityY * 0.05;

    cameraOffset.x = Math.max(-maxOffset, Math.min(maxOffset, cameraOffset.x));
    cameraOffset.y = Math.max(-maxOffset, Math.min(maxOffset, cameraOffset.y));

    // Further dampen camera offset
    cameraOffset.x *= 0.9; // More aggressive damping
    cameraOffset.y *= 0.9;
  };

  const draw = (deltaTime = 0) => {
    const { scaledWidth, scaledHeight } = getScaledCanvasSize();

    // Clear with translucent fill for gentle trail effect
    ctx.fillStyle = `rgba(${parseInt(currentOptions.colors.deep.slice(1, 3), 16)}, ${parseInt(currentOptions.colors.deep.slice(3, 5), 16)}, ${parseInt(currentOptions.colors.deep.slice(5, 7), 16)}, ${currentOptions.intensity})`; // Use intensity as global alpha
    ctx.fillRect(0, 0, scaledWidth, scaledHeight);

    if (currentOptions.prefersReducedMotion) {
      // Draw static glow and simplified circuits for reduced motion
      ctx.save();
      ctx.globalAlpha = 0.25; // Slightly more visible for static
      ctx.strokeStyle = currentOptions.colors.brand; // Static color
      ctx.lineWidth = 1; 
      ctx.shadowBlur = 12; 
      ctx.shadowColor = currentOptions.colors.brand;

      primaryCircuitPaths.forEach(path => {
        ctx.beginPath();
        ctx.moveTo(path.p1.x, path.p1.y);
        ctx.quadraticCurveTo(path.cp.x, path.cp.y, path.p2.x, path.p2.y);
        ctx.stroke();
      });

      circuitNodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2); // Slightly larger nodes for better visibility
        ctx.fillStyle = currentOptions.colors.brand;
        ctx.fill();
      });
      ctx.restore();
      return;
    }

    const frameStart = performance.now();

    if (currentOptions.interactive) {
      updateCameraOffset(deltaTime);
    }

    // Draw primary circuits
    ctx.save();
    ctx.translate(cameraOffset.x, cameraOffset.y); // Apply parallax offset
    ctx.lineWidth = 2.2; // Slightly thicker lines for primary circuits
    ctx.shadowBlur = 25; // Stronger glow for primary circuits
    ctx.shadowColor = currentOptions.colors.accent; // Use accent for primary glow
    ctx.globalAlpha = 0.9; // Stronger alpha for primary circuits

    primaryCircuitPaths.forEach(path => {
      // Create gradient along the path segment
      const gradient = ctx.createLinearGradient(path.p1.x, path.p1.y, path.p2.x, path.p2.y);
      gradient.addColorStop(0, currentOptions.colors.brand); // Brand blue
      gradient.addColorStop(1, currentOptions.colors.accent); // Accent blue
      ctx.strokeStyle = gradient;

      ctx.beginPath();
      ctx.moveTo(path.p1.x, path.p1.y);
      ctx.quadraticCurveTo(path.cp.x, path.cp.y, path.p2.x, path.p2.y);
      ctx.stroke();

      // Draw pulses
      path.pulses.forEach(pulse => {
        if (pulse.delay <= 0) { // Only draw if delay is over
          const p = getPointOnQuadraticBezier(path.p1, path.cp, path.p2, pulse.t);
          ctx.beginPath();
          ctx.arc(p.x, p.y, pulse.size * currentOptions.speed * 1.5, 0, Math.PI * 2); // Scale pulse size with speed
          ctx.fillStyle = currentOptions.colors.accent; // Pulses are accent color
          ctx.shadowBlur = 35; // Even stronger shadow blur for pulses
          ctx.shadowColor = currentOptions.colors.accent;
          ctx.globalAlpha = currentOptions.intensity * 2.0; // Even stronger alpha for pulses
          ctx.fill();
        }
      });
    });
    ctx.restore();

    // Draw ambient network (only if frame budget allows, or if not in mobileCaps for full ambient on desktop)
    if (performance.now() - frameStart < FRAME_BUDGET_MS || !currentOptions.mobileCaps) { 
      ctx.save();
      ctx.translate(cameraOffset.x, cameraOffset.y); // Apply parallax offset
      ctx.globalAlpha = 0.25; // Increased opacity for ambient network
      ctx.lineWidth = 1; // Thicker lines for ambient network
      ctx.strokeStyle = currentOptions.colors.muted; // Muted blue for ambient
      ctx.shadowBlur = 10; // Subtle shadow for ambient
      ctx.shadowColor = currentOptions.colors.muted;

      ambientEdges.forEach(edge => {
        ctx.beginPath();
        ctx.moveTo(edge.start.x, edge.start.y);
        ctx.lineTo(edge.end.x, edge.end.y);
        ctx.stroke();
      });

      ambientNodes.forEach(node => {
        // Animate ambient nodes (very slow drift)
        node.x += node.dx * deltaTime;
        node.y += node.dy * deltaTime;

        // Wrap around if out of bounds
        const { scaledWidth, scaledHeight } = getScaledCanvasSize();
        if (node.x < 0) node.x = scaledWidth;
        if (node.x > scaledWidth) node.x = 0;
        if (node.y < 0) node.y = scaledHeight;
        if (node.y > scaledHeight) node.y = 0;

        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2); // Slightly larger ambient nodes
        ctx.fillStyle = currentOptions.colors.muted;
        ctx.fill();
      });
      ctx.restore();
    }

    // Draw circuit nodes (static glow on junctions)
    ctx.save();
    ctx.translate(cameraOffset.x, cameraOffset.y); // Apply parallax offset
    ctx.globalAlpha = 1.0; // Ensure nodes are fully opaque within their glow
    circuitNodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 4, 0, Math.PI * 2); // Larger nodes for junctions
      ctx.fillStyle = currentOptions.colors.accent; // Accent color for nodes
      ctx.shadowBlur = 30; // Stronger glow for junctions
      ctx.shadowColor = currentOptions.colors.accent;
      ctx.fill();
    });
    ctx.restore();
  };

  const animate = (deltaTime: number) => {
    if (currentOptions.prefersReducedMotion) return;
    updatePulseAnimations(deltaTime);
    draw(deltaTime);
  };

  const updateOptions = (newOptions: Partial<CircuitDrawOptions>) => {
    currentOptions = { ...currentOptions, ...newOptions };
    resize(); // Re-evaluate canvas size and drawing parameters on option update
  };

  const resize = () => {
    const { scaledWidth, scaledHeight } = getScaledCanvasSize();
    offscreenCanvas.width = scaledWidth;
    offscreenCanvas.height = scaledHeight;
    edgeCanvas.width = scaledWidth;
    edgeCanvas.height = scaledHeight;

    // Re-process logo and regenerate paths/network if canvas size changes significantly
    if (logoLoaded) {
      processLogoForEdges(); // Re-process edges if canvas size changes
      generatePrimaryCircuitPaths(); // Re-generate primary paths
      generateAmbientNetwork();
    }
    draw();
  };

  // Event Listeners
  canvas.addEventListener('mousemove', handleMouseMove);

  // Initial setup
  loadImageAndProcess();

  return {
    animate, // Exposed for requestAnimationFrame loop
    updateOptions, // Exposed for prop updates and resize
    draw, // Exposed for initial draw or static redraw
  };
}
