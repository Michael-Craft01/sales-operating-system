import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#050505", // Almost pure black
                foreground: "#FAFAFA", // Almost pure white
                primary: {
                    DEFAULT: "#FFFFFF", // Pure white for primary actions
                    foreground: "#000000", // Black text on white buttons
                },
                secondary: {
                    DEFAULT: "#27272a", // Zinc-800 for secondary elements
                    foreground: "#A1A1AA", // Zinc-400 for secondary text
                },
                muted: {
                    DEFAULT: "#18181b", // Zinc-900
                    foreground: "#71717a", // Zinc-500
                },
                border: "#FFFFFF", // White border (opacity will be handled in classes)
            },
            fontFamily: {
                sans: ['var(--font-geist-sans)'],
                mono: ['var(--font-geist-mono)'],
            },
        },
    },
    plugins: [],
};
export default config;
