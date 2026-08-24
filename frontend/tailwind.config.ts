import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        nepal: {
          blue: '#003893',        // Primary Nepal Blue
          dark: '#001F54',        // Midnight Canvas
          surface: '#0A2540',     // Elevated Dark Card Surface
        },
        crimson: {
          DEFAULT: '#DC143C',     // Nepal Flag Red (Primary CTAs)
          hover: '#B80D30',       // Darker Crimson on hover
          subtle: '#FFF1F2',      // Soft Rose container for light cards
        },
        sakura: {
          light: '#FFF0F3',       // Ultra-light Cherry Blossom for badges
          DEFAULT: '#FFB7C5',     // Cherry Blossom Accent
          border: 'rgba(255, 183, 197, 0.25)', // Subtle glass borders
        },
        canvas: {
          light: '#F8FAFC',       // Clean Alabaster for light sections
          card: '#FFFFFF',        // Pure White card surface
          border: '#E2E8F0',      // Neutral gray borders
        },
      },
    },
  },
  plugins: [],
};
export default config;
