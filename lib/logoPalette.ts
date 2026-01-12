import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

// Default palette if logo parsing fails or logo is missing
const DEFAULT_PALETTE = {
  '--brand': '#EF4444', // Red-600
  '--brand-accent': '#3B82F6', // Blue-500
  '--brand-muted': '#475569', // Slate-600
};

export async function getLogoPalette(logoPath: string) {
  try {
    const fullPath = path.join(process.cwd(), 'public', logoPath);
    const svgContent = fs.readFileSync(fullPath, 'utf-8');

    const dom = new JSDOM(svgContent);
    const document = dom.window.document;

    const colors = new Set<string>();
    document.querySelectorAll('*[fill]').forEach(el => {
      const fill = el.getAttribute('fill');
      if (fill && fill !== 'none') colors.add(fill);
    });
    document.querySelectorAll('*[stroke]').forEach(el => {
      const stroke = el.getAttribute('stroke');
      if (stroke && stroke !== 'none') colors.add(stroke);
    });

    const uniqueColors = Array.from(colors);
    
    if (uniqueColors.length >= 3) {
      return {
        '--brand': uniqueColors[0],
        '--brand-accent': uniqueColors[1],
        '--brand-muted': uniqueColors[2],
      };
    } else if (uniqueColors.length === 2) {
        return {
            '--brand': uniqueColors[0],
            '--brand-accent': uniqueColors[1],
            '--brand-muted': uniqueColors[0], // Use brand as muted if only two colors
        };
    } else if (uniqueColors.length === 1) {
        return {
            '--brand': uniqueColors[0],
            '--brand-accent': uniqueColors[0],
            '--brand-muted': uniqueColors[0],
        };
    }

    console.warn(`Insufficient colors found in ${logoPath}. Using default palette.`);
    return DEFAULT_PALETTE;

  } catch (error) {
    console.error(`Failed to parse logo palette from ${logoPath}:`, error);
    console.info("Note: Please ensure /public/logo.svg exists and is a valid SVG. Using default palette.");
    return DEFAULT_PALETTE;
  }
}

// Placeholder for logo.svg if it doesn't exist. This will be automatically generated if needed.
// The user will be prompted to replace it.
const placeholderSvgContent = `
<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#EF4444"/>
  <circle cx="100" cy="100" r="80" fill="#3B82F6"/>
  <path d="M50 100L80 130L150 70" stroke="#475569" stroke-width="10"/>
</svg>
`;

export async function ensurePlaceholderLogo() {
    const logoPath = path.join(process.cwd(), 'public', 'logo.svg');
    if (!fs.existsSync(logoPath)) {
        fs.writeFileSync(logoPath, placeholderSvgContent);
        console.info("Created placeholder /public/logo.svg. Please replace it with your actual logo.");
    }
}
