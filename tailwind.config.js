/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },

    screens: {
      xs: "450px",
      // => @media (min-width: 450px) { ... }

      sm: "575px",
      // => @media (min-width: 576px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "992px",
      // => @media (min-width: 992px) { ... }

      xl: "1200px",
      // => @media (min-width: 1200px) { ... }

      "2xl": "1400px",
      // => @media (min-width: 1400px) { ... }
    },
    extend: {
      colors: {
        current: "currentColor",
        transparent: "transparent",
        white: "#FFFFFF",
        black: "#121723",
        dark: "#1D2430",
        primary: {
          DEFAULT: "#FA812F",
          50: "#FEF3E2",
          100: "#FEF3E2",
          200: "#FAB12F",
          300: "#FA812F",
          400: "#FA812F",
          500: "#FA812F",
          600: "#E55A2B",
          700: "#C74A23",
          800: "#A93D1F",
          900: "#8B331D",
        },
        secondary: {
          DEFAULT: "#DD0303",
          50: "#FEF3E2",
          100: "#FEF3E2",
          200: "#FAB12F",
          300: "#FA812F",
          400: "#DD0303",
          500: "#DD0303",
          600: "#C40203",
          700: "#AB0202",
          800: "#920202",
          900: "#790101",
        },
        accent: {
          DEFAULT: "#FAB12F",
          50: "#FEF3E2",
          100: "#FEF3E2",
          200: "#FAB12F",
          300: "#FAB12F",
          400: "#FAB12F",
          500: "#FAB12F",
          600: "#E19F2A",
          700: "#C88D25",
          800: "#AF7B20",
          900: "#96691B",
        },
        background: {
          DEFAULT: "#FEF3E2",
          secondary: "#FFFFFF",
          dark: "#F4E6D1",
          darker: "#F0D9C4",
        },
        yellow: "#FBB040",
        "bg-color-dark": "#171C28",
        "body-color": {
          DEFAULT: "#788293",
          dark: "#959CB1",
        },
        stroke: {
          stroke: "#E3E8EF",
          dark: "#353943",
        },
        gray: {
          ...colors.gray,
          dark: "#1E232E",
          light: "#F0F2F9",
        },
        teal: {
          500: "#14B8A6",
          600: "#0D9488",
        },
        warning: "#FFA800",
        "gray-1": "#F5F5F5",
        "gray-2": "#F9FAFB",
        "gray-dark": "#232323",
      },

      boxShadow: {
        signUp: "0px 5px 10px rgba(4, 10, 34, 0.2)",
        one: "0px 2px 3px rgba(7, 7, 77, 0.05)",
        two: "0px 5px 10px rgba(6, 8, 15, 0.1)",
        three: "0px 5px 15px rgba(6, 8, 15, 0.05)",
        sticky: "inset 0 -1px 0 0 rgba(0, 0, 0, 0.1)",
        "sticky-dark": "inset 0 -1px 0 0 rgba(255, 255, 255, 0.1)",
        "feature-2": "0px 10px 40px rgba(48, 86, 211, 0.12)",
        submit: "0px 5px 20px rgba(4, 10, 34, 0.1)",
        "submit-dark": "0px 5px 20px rgba(4, 10, 34, 0.1)",
        btn: "0px 1px 2px rgba(4, 10, 34, 0.15)",
        "btn-hover": "0px 1px 2px rgba(0, 0, 0, 0.15)",
        "btn-light": "0px 1px 2px rgba(0, 0, 0, 0.1)",
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.01)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.01)',
      },
      dropShadow: {
        three: "0px 5px 15px rgba(6, 8, 15, 0.05)",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'auto',
            color: '#232323',
            mb: '2rem',
            p: {
              color: '#232323',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
            },
            h1: {
              color: '#232323',
            },
            h2: {
              color: '#232323',
            },
            h3: {
              color: '#232323',
            },
            h4: {
              color: '#232323',
            },
            h5: {
              color: '#232323',
            },
            h6: {
              color: '#232323',
            },
            a: {
              color: '#FF5722',
              textDecoration: 'none',
            },
            'a:hover': {
              textDecoration: 'underline',
            },
            pre: {
              backgroundColor: '#F5F5F5',
              color: '#232323',
            },
            code: {
              color: '#232323',
              backgroundColor: '#F5F5F5',
              borderRadius: '0.25rem',
              padding: '0.25rem',
            },
          },
        },
      },
    },
  },
  plugins: [],
};
