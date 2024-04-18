import { create } from 'twrnc';

const customConfig = {
  mode: 'jit',

  theme: {
    extend: {
      // Extend the default Tailwind theme according to your project's design requirements
      colors: {
        'custom-blue': '#007bff',
        primary: '#4b5563',
        secondary: '#059669',
        background: '#1f2937',
        text: '#e5e7eb',
        textMuted: '#9ca3af',
        error: '#dc2626',
        info: '#3b82f6',
        success: '#10b981',
      },
      // Example: Adding custom spacing
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      // Example: Adding custom font sizes
      fontSize: {
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '4rem',
      },
      transform: {},
      transitionProperty: {},
      transitionTimingFunction: {},
      transitionDuration: {},
      transitionDelay: {},
      transitionColors: {},
    },
  },
  // Add custom variants if needed
  variants: {
    extend: {},
  },
  // Add Tailwind CSS plugins here if needed
  plugins: [],
};

// Create a Tailwind instance with your custom configuration
const tw = create(customConfig);

export default tw;