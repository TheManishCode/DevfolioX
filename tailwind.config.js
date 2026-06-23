/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/config/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/styles/**/*.{css}",
    ],
    theme: {
        extend: {
            colors: {
                // Victor Eke inspired accent colors
                "primary": "#33E092",
                "primary-hover": "#0CCE6B",
                "primary-dark": "#16a34a",
                // Note: Tailwind v4 includes zinc palette by default
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['Fira Code', 'monospace'],
                incognito: ['var(--incognito)'],
            },
            keyframes: {
                marquee: {
                    from: { transform: "translateX(0)" },
                    to: { transform: "translateX(calc(-100% - var(--gap)))" },
                },
                "marquee-reverse": {
                    from: { transform: "translateX(calc(-100% - var(--gap)))" },
                    to: { transform: "translateX(0)" },
                },
                "marquee-vertical": {
                    from: { transform: "translateY(0)" },
                    to: { transform: "translateY(calc(-100% - var(--gap)))" },
                },
                shimmer: {
                    "0%": { backgroundPosition: "200% 0" },
                    "100%": { backgroundPosition: "-200% 0" },
                },
            },
            animation: {
                marquee: "marquee var(--duration) linear infinite",
                "marquee-reverse": "marquee-reverse var(--duration) linear infinite",
                "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
                shimmer: "shimmer 3s ease-in-out infinite",
            },
        },
    },
    plugins: [],
};
