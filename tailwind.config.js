/** @type {import('tailwindcss').Config} */

// --- Refined theme -----------------------------------------------------------
// The app was written against Tailwind's stock palette (slate / blue / emerald /
// amber / rose). Instead of touching class names across every component, we
// remap those families here to the "Refined" system:
//   ground  #FAFAF8   ink #1E1C18 / #514C43 / #736D62
//   accent  evergreen #2C5850     amber #9A6F27   red #A64A43
// Structure and logic are untouched; only the visual tokens change.

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // warm neutrals -> replaces every slate-* usage
        slate: {
          50:  '#FAFAF8',
          100: '#F1EEE6',
          200: '#E4E0D8',
          300: '#D8D3C7',
          400: '#A79F92',
          500: '#8B8477',
          600: '#736D62',
          700: '#514C43',
          800: '#332F29',
          900: '#1E1C18',
        },
        // primary accent -> replaces every blue-* usage (evergreen)
        blue: {
          50:  '#E9F0ED',
          100: '#DCE8E3',
          500: '#357063',
          600: '#2C5850',
          700: '#244942',
        },
        // "paid / positive" -> emerald, kept a touch brighter than the accent
        emerald: {
          50:  '#EAF2EC',
          100: '#DBEBDF',
          500: '#3E8564',
          600: '#316B52',
          700: '#285742',
        },
        // "pending / unpaid" -> amber (calm ochre, not alarm)
        amber: {
          50:  '#F7F0DF',
          100: '#F0E6CC',
          500: '#A97D2E',
          600: '#9A6F27',
          700: '#7E5A1E',
        },
        // "overdue / destructive" -> rose (muted brick)
        rose: {
          50:  '#F7EAE8',
          100: '#EFD9D4',
          500: '#B4544C',
          600: '#A64A43',
        },
        // transfer chip -> muted slate-blue
        indigo: {
          50:  '#ECEFF3',
          600: '#4C5A6C',
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
