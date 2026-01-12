'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export const TubesCursor = () => {
  useEffect(() => {
    // Create canvas if it doesn't exist
    if (typeof window !== 'undefined' && !document.getElementById('tubes-bg-canvas')) {
      const canvas = document.createElement('canvas');
      canvas.id = 'tubes-bg-canvas';
      canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 1;
        pointer-events: auto;
      `;
      // Insert at the beginning of body so it's behind everything
      document.body.insertBefore(canvas, document.body.firstChild);
    }
  }, []);

  return (
    <Script
      id="tubes-cursor-init"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          // Wait for canvas to be ready
          function initTubesCursor() {
            let canvas = document.getElementById('tubes-bg-canvas');
            if (!canvas) {
              // Create canvas if not exists
              canvas = document.createElement('canvas');
              canvas.id = 'tubes-bg-canvas';
              canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:1;pointer-events:auto;';
              document.body.insertBefore(canvas, document.body.firstChild);
            }
            
            // Load the module
            import("https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js")
              .then((module) => {
                const TubesCursor = module.default;
                const app = TubesCursor(canvas, {
                  tubes: {
                    colors: ["#f967fb", "#53bc28", "#6958d5"],
                    lights: {
                      intensity: 200,
                      colors: ["#83f36e", "#fe8a2e", "#ff008a", "#60aed5"]
                    }
                  }
                });

                window.__tubesApp = app;

                function randomColors(count) {
                  return new Array(count)
                    .fill(0)
                    .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
                }

                document.body.addEventListener('click', () => {
                  if (window.__tubesApp && window.__tubesApp.tubes) {
                    const colors = randomColors(3);
                    const lightsColors = randomColors(4);
                    console.log('New colors:', colors, lightsColors);
                    window.__tubesApp.tubes.setColors(colors);
                    window.__tubesApp.tubes.setLightsColors(lightsColors);
                  }
                });
              })
              .catch((err) => console.error('TubesCursor failed to load:', err));
          }
          
          if (document.readyState === 'complete') {
            initTubesCursor();
          } else {
            window.addEventListener('load', initTubesCursor);
          }
        `,
      }}
    />
  );
};

export default TubesCursor;
