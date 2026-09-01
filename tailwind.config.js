/** @type {import('tailwindcss').Config} */

// --- Refined theme -----------------------------------------------------------
// The app was written against Tailwind's stock palette (slate / blue / emerald /
// amber / rose). Instead of touching class names across every component, we
// remap those families here to the "Refined" system:
//   ground  #F6F7F9   ink #1C2331 / #5B6472 / #8A92A0
//   accent  slate-blue #2A4B8D    green #1F7A54   amber #9C6B1A   red #B43B31
// Structure and logic are untouched; only the visual tokens change.

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // cool neutrals -> replaces every slate-* usage
        slate: {
          50:  '#F6F7F9',
          100: '#EEF0F4',
          200: '#E4E7ED',
          300: '#D3D8E1',
          400: '#9EA6B4',
          500: '#79828F',
          600: '#5B6472',
          700: '#3D4552',
          800: '#2A313D',
          900: '#1C2331',
        },
        // primary accent -> replaces every blue-* usage (slate blue)
        blue: {
          50:  '#EDF1F9',
          100: '#DDE5F3',
          500: '#345BB0',
          600: '#2A4B8D',
          700: '#223D73',
        },
        // "paid / positive" -> emerald (kept clearly distinct from the accent)
        emerald: {
          50:  '#E8F3ED',
          100: '#D5EADF',
          500: '#2E9160',
          600: '#1F7A54',
          700: '#186445',
        },
        // "pending / unpaid" -> amber (calm ochre, not alarm)
        amber: {
          50:  '#F8F0DF',
          100: '#F1E6C9',
          500: '#B07A21',
          600: '#9C6B1A',
          700: '#7E5615',
        },
        // "overdue / destructive" -> rose (muted brick)
        rose: {
          50:  '#F9EAE8',
          100: '#F2D7D3',
          500: '#C0463D',
          600: '#B43B31',
        },
        // transfer chip -> muted blue-slate, distinct from the accent
        indigo: {
          50:  '#EEF1F6',
          600: '#4B5568',
        },
      },
      fontFamily: {
        sans: ['"Helvetica Neue"', 'Helvetica', 'Arial', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      // dial back the shouty weights the app leans on everywhere
      fontWeight: {
        extrabold: '600',
        black: '700',
      },
      letterSpacing: {
        widest: '0.06em',
      },
      // calmer corners
      borderRadius: {
        lg: '0.5rem',
        xl: '0.625rem',
        '2xl': '0.75rem',
        '3xl': '0.875rem',
      },
      // flatten the heavy stacked shadows
      boxShadow: {
        sm: '0 1px 2px rgba(30, 28, 24, 0.04)',
        DEFAULT: '0 1px 2px rgba(30, 28, 24, 0.05)',
        md: '0 1px 3px rgba(30, 28, 24, 0.06)',
        lg: '0 1px 3px rgba(30, 28, 24, 0.06)',
        xl: '0 2px 8px rgba(30, 28, 24, 0.06)',
        '2xl': '0 8px 28px -12px rgba(30, 28, 24, 0.14)',
        inner: 'inset 0 1px 2px rgba(30, 28, 24, 0.04)',
      },
    },
  },
  plugins: [],
}
