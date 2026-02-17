/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
        // YUCA Luxury Nature-Inspired Brand Colors
        blanket: {
          DEFAULT: '#F2E0CF',
          50: '#faf7f3',
          100: '#f2e0cf',
          200: '#e8d0b5',
          300: '#ddbf9b',
          400: '#d3ae81',
          500: '#c99d67',
          600: '#bf8c4d',
          700: '#b57b33',
          800: '#ab6a19',
          900: '#a15900',
        },
        autumnFern: {
          DEFAULT: '#854628',
          50: '#f7f0ed',
          100: '#ecd8ce',
          200: '#d9b49e',
          300: '#c6906e',
          400: '#b36c3e',
          500: '#a0480e',
          600: '#854628',
          700: '#6a3820',
          800: '#4f2a18',
          900: '#341c10',
        },
        oak: {
          DEFAULT: '#5C4736', // Dark Walnut (Replaces Gold)
          50: '#f6f4f2',
          100: '#e8e3df',
          200: '#d5ccc3',
          300: '#bcaea0',
          400: '#9d8b7a',
          500: '#806e5d',
          600: '#675647',
          700: '#5C4736',
          800: '#4a3a2e',
          900: '#3d3027',
        },
        khakiMoss: {
          DEFAULT: '#222E1B', // Black Forest Green
          100: '#e3e6e1',
          200: '#c6cebf',
          300: '#a3b098',
          400: '#839575',
          500: '#657855',
          600: '#4e5d41',
          700: '#3D4D33',
          800: '#303D24',
          900: '#222E1B',
        },
        mushroom: {
          DEFAULT: '#D4C7B4',
          50: '#faf8f6',
          100: '#f2ede7',
          200: '#e8ddd0',
          300: '#decdb9',
          400: '#d4c7b4',
          500: '#cab7a2',
          600: '#c0a790',
          700: '#b6977e',
          800: '#ac876c',
          900: '#a2775a',
        },
        kimber: {
          DEFAULT: '#2D2D23',
          50: '#f5f5f4',
          100: '#e7e7e5',
          200: '#cfcfcb',
          300: '#b7b7b1',
          400: '#9f9f97',
          500: '#87877d',
          600: '#6f6f63',
          700: '#575749',
          800: '#3f3f2f',
          900: '#2d2d23',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Lato', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Merriweather', 'serif'],
        butler: ['Butler', 'serif'],
      },
      fontWeight: {
        'ultralight': '200',
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
        'black': '900',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'shimmer': 'shimmer 2s infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};