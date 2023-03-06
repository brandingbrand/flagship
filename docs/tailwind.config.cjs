/* eslint-env node */
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        default: "rgb(var(--color-default) / <alpha-value>)",
        neutral: "rgb(var(--color-neutral) / <alpha-value>)",
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        warning: "rgb(var(--color-warning) / <alpha-value>)",
        error: "rgb(var(--color-error) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        info: "rgb(var(--color-info) / <alpha-value>)",

        "code-black": "#000000",
        "code-charcoal": "#262727",
        "code-grey": "#6D6E6F",
        "code-silver": "#B7B7B7",
        "code-blue": "#0067F6",
        "code-light-blue": "#4E9EFB",
        "code-white": "#FFFFFF",
        "code-light-grey": "#F2F2F2",
        "code-yellow": "#FFCC00",
        "code-red": "#FF655C",
      },
    },
    fontFamily: {
      sans: ["Roboto", ...defaultTheme.fontFamily.sans],
      serif: ["Roboto", ...defaultTheme.fontFamily.serif],
      mono: ['"Roboto Mono"', ...defaultTheme.fontFamily.mono],
    },
  },
  plugins: [],
};
