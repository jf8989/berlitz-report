// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: [
    // Root directory
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // Src directory
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // Enables dark mode with class strategy
  theme: {
    extend: {
      colors: {
        // System colors for light/dark mode
        background: "var(--background)",
        foreground: "var(--foreground)",

        // Extended system colors
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        popover: "var(--popover)",
        "popover-foreground": "var(--popover-foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        destructive: "var(--destructive)",
        "destructive-foreground": "var(--destructive-foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",

        // Common color scheme
        primary: {
          DEFAULT: "#4A90E2",
          hover: "#3A7BC8",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },

        // Professional color palette
        navy: {
          100: "#E6E8ED",
          200: "#BFC5D4",
          300: "#99A3BA",
          400: "#4D5E80",
          500: "#273B60",
          600: "#1E2E4D",
          700: "#16223A",
          800: "#0E1627",
          900: "#070B13",
        },
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
        sky: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        beige: {
          50: "#fff5e6",
          100: "#ffeeda",
          200: "#ffe7cb",
          300: "#f7d6b8",
          400: "#eec4a5",
          500: "#e5b292",
          600: "#d69f7f",
          700: "#c78c6c",
          800: "#b8795a",
          900: "#a96747",
        },
        // Adding additional semantic colors
        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        error: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["Georgia", "serif"],
        mono: ["var(--font-geist-mono)", "Menlo", "monospace"], // Prioritize Geist Mono if available

        inter: ["var(--font-inter)", "sans-serif"],
        poppins: ["var(--font-poppins)", "sans-serif"],
        montserrat: ["var(--font-montserrat)", "sans-serif"],
        roboto: ["var(--font-roboto)", "sans-serif"],
        openSans: ["var(--font-open-sans)", "sans-serif"],
        lato: ["var(--font-lato)", "sans-serif"],
        raleway: ["var(--font-raleway)", "sans-serif"],
        geist: ["var(--font-geist-sans)", "sans-serif"],
        geistMono: ["var(--font-geist-mono)", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        fadeIn: "fadeIn 0.8s ease-out forwards",
        fadeOut: "fadeOut 0.8s ease-in forwards",
        pulse: "pulse 2s infinite",
        float: "float 3s ease-in-out infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "spin-slow": "spin 3s linear infinite",
        "bounce-slow": "bounce 3s infinite",
        shimmer: "shimmer 2s linear infinite",
        "slide-in-right": "slideInRight 0.5s ease-out forwards",
        "slide-in-left": "slideInLeft 0.5s ease-out forwards",
        "slide-in-up": "slideInUp 0.5s ease-out forwards",
        "slide-in-down": "slideInDown 0.5s ease-out forwards",
        // tailwindcss-animate provides more, e.g., animate-in, animate-out with data attributes
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        pulse: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInUp: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInDown: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      spacing: {
        "header-height": "var(--header-height)",
        "footer-height": "var(--footer-height)",
        gutter: "var(--gutter)",
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
        content: "var(--max-width)",
      },
      transitionProperty: {
        width: "width",
        all: "all",
      },
      transitionDuration: {
        "2000": "2000ms",
        "1000": "1000ms",
        "500": "var(--transition-slow)",
        "300": "var(--transition-medium)",
        "150": "var(--transition-fast)", // Added for consistency with CSS vars
      },
      transitionTimingFunction: {
        "ease-in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      typography: (_theme: unknown) => ({
        DEFAULT: {
          css: {
            color: "var(--foreground)",
            "--tw-prose-body": "var(--foreground)",
            "--tw-prose-headings": "var(--foreground)",
            "--tw-prose-lead": "var(--muted-foreground)",
            "--tw-prose-links": "var(--primary)",
            "--tw-prose-bold": "var(--foreground)",
            "--tw-prose-counters": "var(--muted-foreground)",
            "--tw-prose-bullets": "var(--muted-foreground)",
            "--tw-prose-hr": "var(--border)",
            "--tw-prose-quotes": "var(--foreground)",
            "--tw-prose-quote-borders": "var(--border)",
            "--tw-prose-captions": "var(--muted-foreground)",
            "--tw-prose-code": "var(--primary)", // Or a specific code color
            "--tw-prose-pre-code": "var(--muted-foreground)", // Color for code inside pre
            "--tw-prose-pre-bg": "var(--muted)", // BG for code blocks
            "--tw-prose-th-borders": "var(--border)",
            "--tw-prose-td-borders": "var(--border)",
            // Invert colors for dark mode (used with .prose-invert)
            "--tw-prose-invert-body": "var(--foreground)", // Assuming foreground is already dark mode adjusted by .dark
            "--tw-prose-invert-headings": "var(--foreground)",
            "--tw-prose-invert-lead": "var(--muted-foreground)",
            "--tw-prose-invert-links": "var(--primary)", // Or a different primary for dark if needed
            "--tw-prose-invert-bold": "var(--foreground)",
            "--tw-prose-invert-counters": "var(--muted-foreground)",
            "--tw-prose-invert-bullets": "var(--muted-foreground)",
            "--tw-prose-invert-hr": "var(--border)",
            "--tw-prose-invert-quotes": "var(--foreground)",
            "--tw-prose-invert-quote-borders": "var(--border)",
            "--tw-prose-invert-captions": "var(--muted-foreground)",
            "--tw-prose-invert-code": "var(--primary)",
            "--tw-prose-invert-pre-code": "var(--muted-foreground)",
            "--tw-prose-invert-pre-bg": "var(--muted)",
            "--tw-prose-invert-th-borders": "var(--border)",
            "--tw-prose-invert-td-borders": "var(--border)",
            a: {
              textDecoration: "underline",
              textUnderlineOffset: "2px",
              fontWeight: "500",
              "&:hover": {
                color: "var(--primary-hover)",
              },
            },
            code: {
              // Inline code styles if not fully covered by prose variables
              backgroundColor: "var(--muted)",
              padding: "0.2em 0.4em",
              borderRadius: "0.25rem",
              fontWeight: "400",
            },
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
            "h1,h2,h3,h4,h5,h6": {
              fontWeight: "600",
            },
          },
        },
      }),
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("@tailwindcss/typography"),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("@tailwindcss/forms"),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("@tailwindcss/aspect-ratio"),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("tailwindcss-animate"),
  ],
} satisfies Config;
