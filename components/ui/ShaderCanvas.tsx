"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

interface ShaderCanvasProps {
  isMobile: boolean
}

export default function ShaderCanvas({ isMobile }: ShaderCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    camera: THREE.Camera
    scene: THREE.Scene
    renderer: THREE.WebGLRenderer
    uniforms: any
    animationId: number
  } | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    // Adaptive shader based on device
    const iterations = isMobile ? 2 : 3
    const innerIterations = isMobile ? 3 : 5

    // Vertex shader
    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `

    // Fragment shader - Optimized for mobile
    const fragmentShader = `
      precision ${isMobile ? 'mediump' : 'highp'} float;
      uniform vec2 resolution;
      uniform float time;
      uniform int iterations;
      uniform int innerIterations;

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time * 0.05;
        float lineWidth = 0.002;

        vec3 color = vec3(0.0);
        for(int j = 0; j < ${iterations}; j++){
          for(int i = 0; i < ${innerIterations}; i++){
            color[j] += lineWidth * float(i * i) / abs(fract(t - 0.01 * float(j) + float(i) * 0.01) * 5.0 - length(uv) + mod(uv.x + uv.y, 0.2));
          }
        }
        
        gl_FragColor = vec4(color[0], color[1], color[2], 1.0);
      }
    `

    // Initialize Three.js scene
    const camera = new THREE.Camera()
    camera.position.z = 1

    const scene = new THREE.Scene()
    const geometry = new THREE.PlaneGeometry(2, 2)

    const uniforms = {
      time: { type: "f", value: 1.0 },
      resolution: { type: "v2", value: new THREE.Vector2() },
      iterations: { type: "i", value: iterations },
      innerIterations: { type: "i", value: innerIterations },
    }

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Performance optimizations - Aggressive for mobile
    const pixelRatio = isMobile 
      ? Math.min(window.devicePixelRatio, 1.0) 
      : Math.min(window.devicePixelRatio, 2)
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: !isMobile,
      powerPreference: "high-performance",
      alpha: false,
      stencil: false,
      depth: false,
      preserveDrawingBuffer: false,
      failIfMajorPerformanceCaveat: false,
    })
    renderer.setPixelRatio(pixelRatio)
    renderer.setSize(container.clientWidth, container.clientHeight)

    container.appendChild(renderer.domElement)
    
    // Style the canvas for performance
    const canvas = renderer.domElement
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.display = 'block'
    canvas.style.willChange = 'contents'

    // Throttled resize with debounce
    let resizeTimeout: NodeJS.Timeout
    let rafId: number | null = null
    const onWindowResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        if (rafId) cancelAnimationFrame(rafId)
        rafId = requestAnimationFrame(() => {
          const width = container.clientWidth
          const height = container.clientHeight
          renderer.setSize(width, height)
          uniforms.resolution.value.x = renderer.domElement.width
          uniforms.resolution.value.y = renderer.domElement.height
          rafId = null
        })
      }, 150)
    }

    // Initial resize
    uniforms.resolution.value.x = renderer.domElement.width
    uniforms.resolution.value.y = renderer.domElement.height

    window.addEventListener("resize", onWindowResize, { passive: true })

    // Adaptive frame rate limiting
    let lastFrameTime = 0
    const targetFPS = isMobile ? 30 : 60
    const frameInterval = 1000 / targetFPS
    let frameSkip = 0

    // Optimized animation loop
    const animate = (currentTime: number) => {
      const animationId = requestAnimationFrame(animate)
      
      // Frame rate limiting with skip for mobile
      if (isMobile) {
        frameSkip++
        if (frameSkip % 2 !== 0) {
          if (sceneRef.current) {
            sceneRef.current.animationId = animationId
          }
          return
        }
      }

      const elapsed = currentTime - lastFrameTime
      if (elapsed < frameInterval) {
        if (sceneRef.current) {
          sceneRef.current.animationId = animationId
        }
        return
      }
      lastFrameTime = currentTime - (elapsed % frameInterval)

      uniforms.time.value += 0.05
      renderer.render(scene, camera)

      if (sceneRef.current) {
        sceneRef.current.animationId = animationId
      }
    }

    // Store scene references for cleanup
    sceneRef.current = {
      camera,
      scene,
      renderer,
      uniforms,
      animationId: 0,
    }

    // Start animation with slight delay for better initial load
    const initialTime = performance.now()
    setTimeout(() => {
      animate(initialTime)
    }, 50)

    // Cleanup function
    return () => {
      clearTimeout(resizeTimeout)
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener("resize", onWindowResize)

      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId)

        if (container && sceneRef.current.renderer.domElement) {
          try {
            container.removeChild(sceneRef.current.renderer.domElement)
          } catch (e) {
            // Element already removed
          }
        }

        sceneRef.current.renderer.dispose()
        geometry.dispose()
        material.dispose()
      }
    }
  }, [isMobile])

  return <div ref={containerRef} className="absolute inset-0 w-full h-full" />
}

