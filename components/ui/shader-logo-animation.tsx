"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function ShaderLogoAnimation() {
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

    // Vertex shader
    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `

    // Fragment shader - Adapted for Automari.ai with cyan/blue colors and circular patterns
    const fragmentShader = `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359

      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time * 0.05;
        
        // Center coordinates for circular effect
        vec2 center = vec2(0.0);
        float dist = length(uv - center);
        float angle = atan(uv.y - center.y, uv.x - center.x);

        // Automari brand colors: cyan (#67e8f9) and blue (#3b82f6)
        vec3 color1 = vec3(0.404, 0.910, 0.976); // #67e8f9 - cyan
        vec3 color2 = vec3(0.231, 0.506, 0.965); // #3b82f6 - blue
        vec3 color3 = vec3(0.024, 0.714, 0.831); // #06b6d4 - darker cyan

        vec3 color = vec3(0.0);
        float lineWidth = 0.003;
        
        // Create circular animated patterns
        for(int j = 0; j < 3; j++){
          for(int i = 0; i < 5; i++){
            float offset = float(j) * 0.3 + float(i) * 0.15;
            float pattern = fract(t * 0.5 - offset) * 3.0;
            
            // Radial waves
            float radial = abs(pattern - dist * 2.0 + mod(angle * 2.0, 0.4));
            
            // Circular rings
            float rings = abs(pattern - mod(dist * 4.0 + angle, 0.5));
            
            // Spiral effect
            float spiral = abs(pattern - mod(angle * 3.0 + dist * 2.0, 0.6));
            
            float intensity = lineWidth * float(i + 1) / (radial + rings * 0.5 + spiral * 0.3 + 0.02);
            
            // Mix colors based on layer with smooth transitions
            vec3 layerColor = mix(color1, color2, float(j) * 0.5);
            layerColor = mix(layerColor, color3, float(i) * 0.2);
            color += intensity * layerColor;
          }
        }

        // Add pulsing glow effect
        float glow = sin(t * 1.5) * 0.15 + 0.85;
        color *= glow;
        
        // Fade out at edges for smooth circular boundary
        float edgeFade = 1.0 - smoothstep(0.85, 1.0, dist);
        color *= edgeFade;
        
        // Enhance brightness and contrast
        color = pow(color, vec3(0.75));
        color = min(color, vec3(1.0));
        
        gl_FragColor = vec4(color, 1.0);
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
    }

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
    // Set initial size
    const width = container.clientWidth || 100
    const height = container.clientHeight || 100
    renderer.setSize(width, height)
    uniforms.resolution.value.x = width
    uniforms.resolution.value.y = height

    container.appendChild(renderer.domElement)
    
    // Style the canvas to be contained
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.top = '0'
    renderer.domElement.style.left = '0'

    // Handle window resize
    const onWindowResize = () => {
      const width = container.clientWidth || 100
      const height = container.clientHeight || 100
      renderer.setSize(width, height)
      uniforms.resolution.value.x = width
      uniforms.resolution.value.y = height
    }

    // Initial resize
    onWindowResize()
    window.addEventListener("resize", onWindowResize, false)

    // Animation loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate)
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

    // Start animation
    animate()

    // Cleanup function
    return () => {
      window.removeEventListener("resize", onWindowResize)

      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId)

        if (container && sceneRef.current.renderer.domElement) {
          container.removeChild(sceneRef.current.renderer.domElement)
        }

        sceneRef.current.renderer.dispose()
        geometry.dispose()
        material.dispose()
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 rounded-full"
      style={{
        overflow: "hidden",
        mixBlendMode: "screen",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  )
}

