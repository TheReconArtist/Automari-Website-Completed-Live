"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Script from "next/script";

interface NeuralNetworkProps {
  className?: string;
  showControls?: boolean;
}

export default function NeuralNetwork({ className = "", showControls = false }: NeuralNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeTheme, setActiveTheme] = useState<number>(0);
  const [density, setDensity] = useState<number>(100);

  const densityFactor = useMemo(() => density / 100, [density]);

  useEffect(() => {
    (window as any).__NN_CONFIG__ = {
      activeTheme,
      densityFactor,
    };
    window.dispatchEvent(new CustomEvent("nn-config-change"));
  }, [activeTheme, densityFactor]);

  const sliderStyle = useMemo(
    () => ({ ["--val" as any]: `${density}%` }),
    [density]
  );

  return (
    <div className={`relative w-full h-full ${className}`}>
      <style jsx global>{`
        :root {
          --nn-glass-bg: rgba(255, 255, 255, 0.03);
          --nn-glass-border: rgba(255, 255, 255, 0.08);
          --nn-glass-highlight: rgba(255, 255, 255, 0.2);
          --nn-text-main: rgba(255, 255, 255, 0.9);
          --nn-text-muted: rgba(255, 255, 255, 0.6);
        }
        #neural-network-canvas {
          display: block;
          width: 100%;
          height: 100%;
          cursor: crosshair;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
        }
        .nn-glass-panel {
          backdrop-filter: blur(24px) saturate(120%);
          -webkit-backdrop-filter: blur(24px) saturate(120%);
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.05) 0%,
            rgba(255, 255, 255, 0.01) 100%
          );
          border: 1px solid var(--nn-glass-border);
          border-top: 1px solid var(--nn-glass-highlight);
          border-left: 1px solid var(--nn-glass-highlight);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4),
            inset 0 0 20px rgba(255, 255, 255, 0.02);
          border-radius: 24px;
          color: var(--nn-text-main);
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
          position: absolute;
          z-index: 10;
          overflow: hidden;
        }
        .nn-glass-panel::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.05),
            transparent
          );
          transform: skewX(-15deg);
          transition: 0.5s;
          pointer-events: none;
        }
        .nn-glass-panel:hover {
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.08) 0%,
            rgba(255, 255, 255, 0.02) 100%
          );
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5),
            inset 0 0 20px rgba(255, 255, 255, 0.05);
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.15);
        }
        .nn-glass-panel:hover::before {
          left: 150%;
          transition: 0.7s ease-in-out;
        }
        .nn-theme-button {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          position: relative;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3),
            inset 0 2px 4px rgba(255, 255, 255, 0.4),
            inset 0 -2px 4px rgba(0, 0, 0, 0.2);
        }
        .nn-theme-1 {
          background: radial-gradient(circle at 30% 30%, #a78bfa, #4c1d95);
        }
        .nn-theme-2 {
          background: radial-gradient(circle at 30% 30%, #fb7185, #9f1239);
        }
        .nn-theme-3 {
          background: radial-gradient(circle at 30% 30%, #38bdf8, #0c4a6e);
        }
        .nn-theme-button::after {
          content: "";
          position: absolute;
          top: -3px;
          left: -3px;
          right: -3px;
          bottom: -3px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.8);
          opacity: 0;
          transform: scale(1.1);
          transition: all 0.3s ease;
        }
        .nn-theme-button:hover {
          transform: scale(1.15) translateY(-2px);
        }
        .nn-theme-button.active::after {
          opacity: 1;
          transform: scale(1);
          border-color: rgba(255, 255, 255, 0.9);
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
        }
        .nn-density-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          outline: none;
        }
        .nn-density-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #fff;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
          transition: all 0.2s ease;
        }
        .nn-density-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        .nn-control-button {
          backdrop-filter: blur(20px) saturate(140%);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-top: 1px solid rgba(255, 255, 255, 0.25);
          color: var(--nn-text-main);
          padding: 10px 20px;
          border-radius: 50px;
          cursor: pointer;
          font-family: inherit;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }
        .nn-control-button:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-2px);
        }
      `}</style>

      {/* Controls - only show if enabled */}
      {showControls && (
        <>
          <div className="nn-glass-panel" style={{ top: 20, right: 20, padding: 16, width: 180 }}>
            <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-3">Theme</div>
            <div className="flex gap-3 justify-center mb-4">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  className={`nn-theme-button nn-theme-${i + 1} ${activeTheme === i ? "active" : ""}`}
                  onClick={(e) => { e.stopPropagation(); setActiveTheme(i); }}
                  aria-label={`Theme ${i + 1}`}
                />
              ))}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-2">Density</div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={30}
                max={100}
                value={density}
                className="nn-density-slider flex-1"
                style={sliderStyle as React.CSSProperties}
                onChange={(e) => setDensity(parseInt(e.currentTarget.value, 10))}
              />
              <span className="text-xs text-white font-medium w-8">{density}%</span>
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            <button id="change-formation-btn" className="nn-control-button">Morph</button>
            <button id="pause-play-btn" className="nn-control-button">Freeze</button>
            <button id="reset-camera-btn" className="nn-control-button">Reset</button>
          </div>
        </>
      )}

      <canvas id="neural-network-canvas" ref={canvasRef} />

      <Script
        id="neural-network-module"
        type="module"
        strategy="afterInteractive"
      >{`
        import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.162.0/build/three.module.js";
        import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.162.0/examples/jsm/controls/OrbitControls.js";
        import { EffectComposer } from "https://cdn.jsdelivr.net/npm/three@0.162.0/examples/jsm/postprocessing/EffectComposer.js";
        import { RenderPass } from "https://cdn.jsdelivr.net/npm/three@0.162.0/examples/jsm/postprocessing/RenderPass.js";
        import { UnrealBloomPass } from "https://cdn.jsdelivr.net/npm/three@0.162.0/examples/jsm/postprocessing/UnrealBloomPass.js";
        import { OutputPass } from "https://cdn.jsdelivr.net/npm/three@0.162.0/examples/jsm/postprocessing/OutputPass.js";

        if (window.__NN_INITIALIZED__) return;
        window.__NN_INITIALIZED__ = true;

        const config = {
          paused: false,
          activePaletteIndex: 0,
          currentFormation: 0,
          numFormations: 3,
          densityFactor: 1
        };

        const colorPalettes = [
          [new THREE.Color(0x667eea), new THREE.Color(0x764ba2), new THREE.Color(0xf093fb), new THREE.Color(0x9d50bb), new THREE.Color(0x6e48aa)],
          [new THREE.Color(0xf857a6), new THREE.Color(0xff5858), new THREE.Color(0xfeca57), new THREE.Color(0xff6348), new THREE.Color(0xff9068)],
          [new THREE.Color(0x4facfe), new THREE.Color(0x00f2fe), new THREE.Color(0x43e97b), new THREE.Color(0x38f9d7), new THREE.Color(0x4484ce)]
        ];

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.002);

        const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 8, 28);

        const canvasElement = document.getElementById("neural-network-canvas");
        if (!canvasElement) { console.error("Canvas not found"); return; }

        const renderer = new THREE.WebGLRenderer({ canvas: canvasElement, antialias: true, powerPreference: "high-performance", alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;

        function createStarfield() {
          const count = 6000;
          const positions = [], colors = [], sizes = [];
          for (let i = 0; i < count; i++) {
            const r = THREE.MathUtils.randFloat(50, 150);
            const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
            const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
            positions.push(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
            const c = Math.random();
            if (c < 0.7) colors.push(1, 1, 1);
            else if (c < 0.85) colors.push(0.7, 0.8, 1);
            else colors.push(1, 0.9, 0.8);
            sizes.push(THREE.MathUtils.randFloat(0.1, 0.25));
          }
          const geo = new THREE.BufferGeometry();
          geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
          geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
          geo.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));
          const mat = new THREE.ShaderMaterial({
            uniforms: { uTime: { value: 0 } },
            vertexShader: \`attribute float size; attribute vec3 color; varying vec3 vColor; uniform float uTime;
              void main() { vColor = color; vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              float twinkle = sin(uTime * 2.0 + position.x * 100.0) * 0.3 + 0.7;
              gl_PointSize = size * twinkle * (300.0 / -mvPosition.z); gl_Position = projectionMatrix * mvPosition; }\`,
            fragmentShader: \`varying vec3 vColor; void main() { vec2 center = gl_PointCoord - 0.5; float dist = length(center);
              if (dist > 0.5) discard; float alpha = 1.0 - smoothstep(0.0, 0.5, dist); gl_FragColor = vec4(vColor, alpha * 0.8); }\`,
            transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
          });
          return new THREE.Points(geo, mat);
        }
        const starField = createStarfield();
        scene.add(starField);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; controls.dampingFactor = 0.05; controls.rotateSpeed = 0.6;
        controls.minDistance = 8; controls.maxDistance = 80; controls.autoRotate = true; controls.autoRotateSpeed = 0.15; controls.enablePan = false;

        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
        const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.5, 0.8);
        composer.addPass(bloomPass);
        composer.addPass(new OutputPass());

        const pulseUniforms = {
          uTime: { value: 0.0 },
          uPulsePositions: { value: [new THREE.Vector3(1e3,1e3,1e3), new THREE.Vector3(1e3,1e3,1e3), new THREE.Vector3(1e3,1e3,1e3)] },
          uPulseTimes: { value: [-1e3, -1e3, -1e3] },
          uPulseColors: { value: [new THREE.Color(1,1,1), new THREE.Color(1,1,1), new THREE.Color(1,1,1)] },
          uPulseSpeed: { value: 18.0 }, uBaseNodeSize: { value: 0.6 }
        };

        const noiseFunctions = \`vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}float snoise(vec3 v){const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=mod289(i);vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}\`;

        const nodeShader = {
          vertexShader: \`\${noiseFunctions}
            attribute float nodeSize;attribute float nodeType;attribute vec3 nodeColor;attribute float distanceFromRoot;
            uniform float uTime;uniform vec3 uPulsePositions[3];uniform float uPulseTimes[3];uniform float uPulseSpeed;uniform float uBaseNodeSize;
            varying vec3 vColor;varying float vNodeType;varying vec3 vPosition;varying float vPulseIntensity;varying float vDistanceFromRoot;varying float vGlow;
            float getPulseIntensity(vec3 worldPos,vec3 pulsePos,float pulseTime){if(pulseTime<0.0)return 0.0;float t=uTime-pulseTime;if(t<0.0||t>4.0)return 0.0;float r=t*uPulseSpeed;float d=distance(worldPos,pulsePos);return smoothstep(3.0,0.0,abs(d-r))*smoothstep(4.0,0.0,t);}
            void main(){vNodeType=nodeType;vColor=nodeColor;vDistanceFromRoot=distanceFromRoot;vec3 worldPos=(modelMatrix*vec4(position,1.0)).xyz;vPosition=worldPos;float totalP=0.0;for(int i=0;i<3;i++)totalP+=getPulseIntensity(worldPos,uPulsePositions[i],uPulseTimes[i]);vPulseIntensity=min(totalP,1.0);float breathe=sin(uTime*0.7+distanceFromRoot*0.15)*0.15+0.85;float baseSize=nodeSize*breathe;float pulseSize=baseSize*(1.0+vPulseIntensity*2.5);vGlow=0.5+0.5*sin(uTime*0.5+distanceFromRoot*0.2);vec3 modPos=position;if(nodeType>0.5){float n=snoise(position*0.08+uTime*0.08);modPos+=normal*n*0.15;}vec4 mvPos=modelViewMatrix*vec4(modPos,1.0);gl_PointSize=pulseSize*uBaseNodeSize*(1000.0/-mvPos.z);gl_Position=projectionMatrix*mvPos;}\`,
          fragmentShader: \`uniform float uTime;uniform vec3 uPulseColors[3];varying vec3 vColor;varying float vNodeType;varying vec3 vPosition;varying float vPulseIntensity;varying float vDistanceFromRoot;varying float vGlow;
            void main(){vec2 c=2.0*gl_PointCoord-1.0;float d=length(c);if(d>1.0)discard;float g1=1.0-smoothstep(0.0,0.5,d);float g2=1.0-smoothstep(0.0,1.0,d);float gs=pow(g1,1.2)+g2*0.3;float bc=0.9+0.1*sin(uTime*0.6+vDistanceFromRoot*0.25);vec3 baseCol=vColor*bc;vec3 finalCol=baseCol;if(vPulseIntensity>0.0){vec3 pc=mix(vec3(1.0),uPulseColors[0],0.4);finalCol=mix(baseCol,pc,vPulseIntensity*0.8);finalCol*=(1.0+vPulseIntensity*1.2);gs*=(1.0+vPulseIntensity);}float cb=smoothstep(0.4,0.0,d);finalCol+=vec3(1.0)*cb*0.3;float a=gs*(0.95-0.3*d);float camD=length(vPosition-cameraPosition);float df=smoothstep(100.0,15.0,camD);if(vNodeType>0.5){finalCol*=1.1;a*=0.9;}finalCol*=(1.0+vGlow*0.1);gl_FragColor=vec4(finalCol,a*df);}\`
        };

        const connectionShader = {
          vertexShader: \`\${noiseFunctions}
            attribute vec3 startPoint;attribute vec3 endPoint;attribute float connectionStrength;attribute float pathIndex;attribute vec3 connectionColor;
            uniform float uTime;uniform vec3 uPulsePositions[3];uniform float uPulseTimes[3];uniform float uPulseSpeed;
            varying vec3 vColor;varying float vConnectionStrength;varying float vPulseIntensity;varying float vPathPosition;varying float vDistanceFromCamera;
            float getPulseIntensity(vec3 worldPos,vec3 pulsePos,float pulseTime){if(pulseTime<0.0)return 0.0;float t=uTime-pulseTime;if(t<0.0||t>4.0)return 0.0;float r=t*uPulseSpeed;float d=distance(worldPos,pulsePos);return smoothstep(3.0,0.0,abs(d-r))*smoothstep(4.0,0.0,t);}
            void main(){float t=position.x;vPathPosition=t;vec3 midP=mix(startPoint,endPoint,0.5);float pOff=sin(t*3.14159)*0.15;vec3 perp=normalize(cross(normalize(endPoint-startPoint),vec3(0.0,1.0,0.0)));if(length(perp)<0.1)perp=vec3(1.0,0.0,0.0);midP+=perp*pOff;vec3 p0=mix(startPoint,midP,t);vec3 p1=mix(midP,endPoint,t);vec3 finalPos=mix(p0,p1,t);float nT=uTime*0.15;float n=snoise(vec3(pathIndex*0.08,t*0.6,nT));finalPos+=perp*n*0.12;vec3 worldPos=(modelMatrix*vec4(finalPos,1.0)).xyz;float totalP=0.0;for(int i=0;i<3;i++)totalP+=getPulseIntensity(worldPos,uPulsePositions[i],uPulseTimes[i]);vPulseIntensity=min(totalP,1.0);vColor=connectionColor;vConnectionStrength=connectionStrength;vDistanceFromCamera=length(worldPos-cameraPosition);gl_Position=projectionMatrix*modelViewMatrix*vec4(finalPos,1.0);}\`,
          fragmentShader: \`uniform float uTime;uniform vec3 uPulseColors[3];varying vec3 vColor;varying float vConnectionStrength;varying float vPulseIntensity;varying float vPathPosition;varying float vDistanceFromCamera;
            void main(){float f1=sin(vPathPosition*25.0-uTime*4.0)*0.5+0.5;float f2=sin(vPathPosition*15.0-uTime*2.5+1.57)*0.5+0.5;float cf=(f1+f2*0.5)/1.5;vec3 baseCol=vColor*(0.8+0.2*sin(uTime*0.6+vPathPosition*12.0));float fi=0.4*cf*vConnectionStrength;vec3 finalCol=baseCol;if(vPulseIntensity>0.0){vec3 pc=mix(vec3(1.0),uPulseColors[0],0.3);finalCol=mix(baseCol,pc*1.2,vPulseIntensity*0.7);fi+=vPulseIntensity*0.8;}finalCol*=(0.7+fi+vConnectionStrength*0.5);float baseA=0.7*vConnectionStrength;float flowA=cf*0.3;float a=baseA+flowA;a=mix(a,min(1.0,a*2.5),vPulseIntensity);float df=smoothstep(100.0,15.0,vDistanceFromCamera);gl_FragColor=vec4(finalCol,a*df);}\`
        };

        class Node{constructor(pos,lvl=0,type=0){this.position=pos;this.connections=[];this.level=lvl;this.type=type;this.size=type===0?THREE.MathUtils.randFloat(0.8,1.4):THREE.MathUtils.randFloat(0.5,1.0);this.distanceFromRoot=0;}addConnection(n,s=1.0){if(!this.isConnectedTo(n)){this.connections.push({node:n,strength:s});n.connections.push({node:this,strength:s});}}isConnectedTo(n){return this.connections.some(c=>c.node===n);}}

        function generateNeuralNetwork(formIdx,df=1.0){let nodes=[];let rootNode;
          function genSphere(){rootNode=new Node(new THREE.Vector3(0,0,0),0,0);rootNode.size=2.0;nodes.push(rootNode);const layers=5,gr=(1+Math.sqrt(5))/2;for(let l=1;l<=layers;l++){const r=l*4,np=Math.floor(l*12*df);for(let i=0;i<np;i++){const phi=Math.acos(1-2*(i+0.5)/np),theta=(2*Math.PI*i)/gr;const pos=new THREE.Vector3(r*Math.sin(phi)*Math.cos(theta),r*Math.sin(phi)*Math.sin(theta),r*Math.cos(phi));const isLeaf=l===layers||Math.random()<0.3;const n=new Node(pos,l,isLeaf?1:0);n.distanceFromRoot=r;nodes.push(n);if(l>1){const prev=nodes.filter(x=>x.level===l-1&&x!==rootNode).sort((a,b)=>pos.distanceTo(a.position)-pos.distanceTo(b.position));for(let j=0;j<Math.min(3,prev.length);j++){const d=pos.distanceTo(prev[j].position);n.addConnection(prev[j],Math.max(0.3,1.0-d/(r*2)));}}else{rootNode.addConnection(n,0.9);}}const ln=nodes.filter(x=>x.level===l&&x!==rootNode);for(let i=0;i<ln.length;i++){const n=ln[i];const nearby=ln.filter(x=>x!==n).sort((a,b)=>n.position.distanceTo(a.position)-n.position.distanceTo(b.position)).slice(0,5);for(const nn of nearby){const d=n.position.distanceTo(nn.position);if(d<r*0.8&&!n.isConnectedTo(nn))n.addConnection(nn,0.6);}}}}
          function genHelix(){rootNode=new Node(new THREE.Vector3(0,0,0),0,0);rootNode.size=1.8;nodes.push(rootNode);const nh=4,h=30,mr=12,nph=Math.floor(50*df),ha=[];for(let hx=0;hx<nh;hx++){const hp=(hx/nh)*Math.PI*2,hn=[];for(let i=0;i<nph;i++){const t=i/(nph-1),y=(t-0.5)*h,rs=Math.sin(t*Math.PI)*0.7+0.3,r=mr*rs,ang=hp+t*Math.PI*6;const pos=new THREE.Vector3(r*Math.cos(ang),y,r*Math.sin(ang));const lvl=Math.ceil(t*5),isL=i>nph-5||Math.random()<0.25;const n=new Node(pos,lvl,isL?1:0);n.distanceFromRoot=Math.sqrt(r*r+y*y);nodes.push(n);hn.push(n);}ha.push(hn);rootNode.addConnection(hn[0],1.0);for(let i=0;i<hn.length-1;i++)hn[i].addConnection(hn[i+1],0.85);}for(let hx=0;hx<nh;hx++){const cur=ha[hx],nxt=ha[(hx+1)%nh];for(let i=0;i<cur.length;i+=5){const t=i/(cur.length-1);const ti=Math.round(t*(nxt.length-1));if(ti<nxt.length)cur[i].addConnection(nxt[ti],0.7);}}}
          function genFractal(){rootNode=new Node(new THREE.Vector3(0,0,0),0,0);rootNode.size=1.6;nodes.push(rootNode);const br=6,md=4;function cb(sn,dir,d,st,sc){if(d>md)return;const bl=5*sc;const ep=new THREE.Vector3().copy(sn.position).add(dir.clone().multiplyScalar(bl));const isL=d===md||Math.random()<0.3;const nn=new Node(ep,d,isL?1:0);nn.distanceFromRoot=rootNode.position.distanceTo(ep);nodes.push(nn);sn.addConnection(nn,st);if(d<md){const sb=3;for(let i=0;i<sb;i++){const ang=(i/sb)*Math.PI*2;const pd1=new THREE.Vector3(-dir.y,dir.x,0).normalize();const pd2=dir.clone().cross(pd1).normalize();const nd=new THREE.Vector3().copy(dir).add(pd1.clone().multiplyScalar(Math.cos(ang)*0.7)).add(pd2.clone().multiplyScalar(Math.sin(ang)*0.7)).normalize();cb(nn,nd,d+1,st*0.7,sc*0.75);}}}for(let i=0;i<br;i++){const phi=Math.acos(1-2*(i+0.5)/br),theta=Math.PI*(1+Math.sqrt(5))*i;const dir=new THREE.Vector3(Math.sin(phi)*Math.cos(theta),Math.sin(phi)*Math.sin(theta),Math.cos(phi)).normalize();cb(rootNode,dir,1,0.9,1.0);}}
          switch(formIdx%3){case 0:genSphere();break;case 1:genHelix();break;case 2:genFractal();break;}
          if(df<1.0){const tc=Math.ceil(nodes.length*Math.max(0.3,df));const keep=new Set([rootNode]);const sn=nodes.filter(n=>n!==rootNode).sort((a,b)=>(b.connections.length*(1/(b.distanceFromRoot+1)))-(a.connections.length*(1/(a.distanceFromRoot+1))));for(let i=0;i<Math.min(tc-1,sn.length);i++)keep.add(sn[i]);nodes=nodes.filter(n=>keep.has(n));nodes.forEach(n=>{n.connections=n.connections.filter(c=>keep.has(c.node));});}
          return{nodes,rootNode};}

        let neuralNetwork=null,nodesMesh=null,connectionsMesh=null;
        function createVis(formIdx,df=1.0){if(nodesMesh){scene.remove(nodesMesh);nodesMesh.geometry.dispose();nodesMesh.material.dispose();}if(connectionsMesh){scene.remove(connectionsMesh);connectionsMesh.geometry.dispose();connectionsMesh.material.dispose();}neuralNetwork=generateNeuralNetwork(formIdx,df);if(!neuralNetwork||neuralNetwork.nodes.length===0)return;const ng=new THREE.BufferGeometry();const np=[],nt=[],ns=[],nc=[],dfr=[];const pal=colorPalettes[config.activePaletteIndex];neuralNetwork.nodes.forEach(n=>{np.push(n.position.x,n.position.y,n.position.z);nt.push(n.type);ns.push(n.size);dfr.push(n.distanceFromRoot);const ci=Math.min(n.level,pal.length-1);const bc=pal[ci%pal.length].clone();bc.offsetHSL(THREE.MathUtils.randFloatSpread(0.03),THREE.MathUtils.randFloatSpread(0.08),THREE.MathUtils.randFloatSpread(0.08));nc.push(bc.r,bc.g,bc.b);});ng.setAttribute("position",new THREE.Float32BufferAttribute(np,3));ng.setAttribute("nodeType",new THREE.Float32BufferAttribute(nt,1));ng.setAttribute("nodeSize",new THREE.Float32BufferAttribute(ns,1));ng.setAttribute("nodeColor",new THREE.Float32BufferAttribute(nc,3));ng.setAttribute("distanceFromRoot",new THREE.Float32BufferAttribute(dfr,1));const nm=new THREE.ShaderMaterial({uniforms:THREE.UniformsUtils.clone(pulseUniforms),vertexShader:nodeShader.vertexShader,fragmentShader:nodeShader.fragmentShader,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});nodesMesh=new THREE.Points(ng,nm);scene.add(nodesMesh);const cg=new THREE.BufferGeometry();const cc=[],cs=[],cp=[],sp=[],ep=[],pi=[];const pc=new Set();let pidx=0;neuralNetwork.nodes.forEach((n,ni)=>{n.connections.forEach(conn=>{const cn=conn.node;const ci=neuralNetwork.nodes.indexOf(cn);if(ci===-1)return;const k=[Math.min(ni,ci),Math.max(ni,ci)].join("-");if(pc.has(k))return;pc.add(k);const spt=n.position,ept=cn.position;const ns=20;for(let i=0;i<ns;i++){const t=i/(ns-1);cp.push(t,0,0);sp.push(spt.x,spt.y,spt.z);ep.push(ept.x,ept.y,ept.z);pi.push(pidx);cs.push(conn.strength);const al=Math.min(Math.floor((n.level+cn.level)/2),pal.length-1);const bc=pal[al%pal.length].clone();bc.offsetHSL(THREE.MathUtils.randFloatSpread(0.03),THREE.MathUtils.randFloatSpread(0.08),THREE.MathUtils.randFloatSpread(0.08));cc.push(bc.r,bc.g,bc.b);}pidx++;});});cg.setAttribute("position",new THREE.Float32BufferAttribute(cp,3));cg.setAttribute("startPoint",new THREE.Float32BufferAttribute(sp,3));cg.setAttribute("endPoint",new THREE.Float32BufferAttribute(ep,3));cg.setAttribute("connectionStrength",new THREE.Float32BufferAttribute(cs,1));cg.setAttribute("connectionColor",new THREE.Float32BufferAttribute(cc,3));cg.setAttribute("pathIndex",new THREE.Float32BufferAttribute(pi,1));const cm=new THREE.ShaderMaterial({uniforms:THREE.UniformsUtils.clone(pulseUniforms),vertexShader:connectionShader.vertexShader,fragmentShader:connectionShader.fragmentShader,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});connectionsMesh=new THREE.LineSegments(cg,cm);scene.add(connectionsMesh);pal.forEach((c,i)=>{if(i<3){cm.uniforms.uPulseColors.value[i].copy(c);nm.uniforms.uPulseColors.value[i].copy(c);}});}

        function updateTheme(pi){config.activePaletteIndex=pi;if(!nodesMesh||!connectionsMesh||!neuralNetwork)return;const pal=colorPalettes[pi];const nca=nodesMesh.geometry.attributes.nodeColor;for(let i=0;i<nca.count;i++){const n=neuralNetwork.nodes[i];if(!n)continue;const ci=Math.min(n.level,pal.length-1);const bc=pal[ci%pal.length].clone();bc.offsetHSL(THREE.MathUtils.randFloatSpread(0.03),THREE.MathUtils.randFloatSpread(0.08),THREE.MathUtils.randFloatSpread(0.08));nca.setXYZ(i,bc.r,bc.g,bc.b);}nca.needsUpdate=true;const cc=[];const pc=new Set();neuralNetwork.nodes.forEach((n,ni)=>{n.connections.forEach(conn=>{const cn=conn.node;const ci=neuralNetwork.nodes.indexOf(cn);if(ci===-1)return;const k=[Math.min(ni,ci),Math.max(ni,ci)].join("-");if(pc.has(k))return;pc.add(k);const ns=20;for(let i=0;i<ns;i++){const al=Math.min(Math.floor((n.level+cn.level)/2),pal.length-1);const bc=pal[al%pal.length].clone();bc.offsetHSL(THREE.MathUtils.randFloatSpread(0.03),THREE.MathUtils.randFloatSpread(0.08),THREE.MathUtils.randFloatSpread(0.08));cc.push(bc.r,bc.g,bc.b);}});});connectionsMesh.geometry.setAttribute("connectionColor",new THREE.Float32BufferAttribute(cc,3));connectionsMesh.geometry.attributes.connectionColor.needsUpdate=true;pal.forEach((c,i)=>{if(i<3){nodesMesh.material.uniforms.uPulseColors.value[i].copy(c);connectionsMesh.material.uniforms.uPulseColors.value[i].copy(c);}});}

        const raycaster=new THREE.Raycaster();const pointer=new THREE.Vector2();const iPlane=new THREE.Plane(new THREE.Vector3(0,0,1),0);const iPoint=new THREE.Vector3();let lpi=0;const clock=new THREE.Clock();

        function triggerPulse(cx,cy){pointer.x=(cx/window.innerWidth)*2-1;pointer.y=-(cy/window.innerHeight)*2+1;raycaster.setFromCamera(pointer,camera);iPlane.normal.copy(camera.position).normalize();iPlane.constant=-iPlane.normal.dot(camera.position)+camera.position.length()*0.5;if(raycaster.ray.intersectPlane(iPlane,iPoint)){const t=clock.getElapsedTime();if(nodesMesh&&connectionsMesh){lpi=(lpi+1)%3;nodesMesh.material.uniforms.uPulsePositions.value[lpi].copy(iPoint);nodesMesh.material.uniforms.uPulseTimes.value[lpi]=t;connectionsMesh.material.uniforms.uPulsePositions.value[lpi].copy(iPoint);connectionsMesh.material.uniforms.uPulseTimes.value[lpi]=t;const pal=colorPalettes[config.activePaletteIndex];const rc=pal[Math.floor(Math.random()*pal.length)];nodesMesh.material.uniforms.uPulseColors.value[lpi].copy(rc);connectionsMesh.material.uniforms.uPulseColors.value[lpi].copy(rc);}}}

        renderer.domElement.addEventListener("click",(e)=>{if(e.target.closest(".nn-glass-panel,#control-buttons"))return;if(!config.paused)triggerPulse(e.clientX,e.clientY);});
        renderer.domElement.addEventListener("touchstart",(e)=>{if(e.target.closest(".nn-glass-panel,#control-buttons"))return;e.preventDefault();if(e.touches.length>0&&!config.paused)triggerPulse(e.touches[0].clientX,e.touches[0].clientY);},{passive:false});

        const cfb=document.getElementById("change-formation-btn"),ppb=document.getElementById("pause-play-btn"),rcb=document.getElementById("reset-camera-btn");
        if(cfb)cfb.addEventListener("click",(e)=>{e.stopPropagation();config.currentFormation=(config.currentFormation+1)%config.numFormations;createVis(config.currentFormation,config.densityFactor);controls.autoRotate=false;setTimeout(()=>{controls.autoRotate=true;},2500);});
        if(ppb)ppb.addEventListener("click",(e)=>{e.stopPropagation();config.paused=!config.paused;const sp=ppb.querySelector("span");if(sp)sp.textContent=config.paused?"Play":"Freeze";controls.autoRotate=!config.paused;});
        if(rcb)rcb.addEventListener("click",(e)=>{e.stopPropagation();controls.reset();controls.autoRotate=false;setTimeout(()=>{controls.autoRotate=true;},2000);});

        function applyConfig(){const wc=window.__NN_CONFIG__||{};const nt=typeof wc.activeTheme==="number"?wc.activeTheme:config.activePaletteIndex;const nd=typeof wc.densityFactor==="number"?wc.densityFactor:config.densityFactor;const tc=nt!==config.activePaletteIndex;const dc=nd!==config.densityFactor;config.densityFactor=nd;if(tc)updateTheme(nt);if(dc)createVis(config.currentFormation,config.densityFactor);}
        window.addEventListener("nn-config-change",applyConfig);

        function onResize(){camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();renderer.setSize(window.innerWidth,window.innerHeight);composer.setSize(window.innerWidth,window.innerHeight);bloomPass.resolution.set(window.innerWidth,window.innerHeight);}
        window.addEventListener("resize",onResize);

        function animate(){requestAnimationFrame(animate);const t=clock.getElapsedTime();if(!config.paused){if(nodesMesh){nodesMesh.material.uniforms.uTime.value=t;nodesMesh.rotation.y=Math.sin(t*0.04)*0.05;}if(connectionsMesh){connectionsMesh.material.uniforms.uTime.value=t;connectionsMesh.rotation.y=Math.sin(t*0.04)*0.05;}}starField.rotation.y+=0.0002;starField.material.uniforms.uTime.value=t;controls.update();composer.render();}

        const wc=window.__NN_CONFIG__||{};if(typeof wc.activeTheme==="number")config.activePaletteIndex=wc.activeTheme;if(typeof wc.densityFactor==="number")config.densityFactor=wc.densityFactor;createVis(config.currentFormation,config.densityFactor);animate();
      `}</Script>
    </div>
  );
}

