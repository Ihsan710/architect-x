import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            animation: {
                "spin-slow": "spin 3s linear infinite",
            },
            keyframes: {
                twinkle: {
                    '0%, 100%': { opacity: '0.1' },
                    '50%': { opacity: '0.8' },
                },
                moveStars: {
                    from: {
                        transform: 'translateY(0) translateZ(0)'
                    },
                    to: {
                        transform: 'translateY(-1000px) translateZ(0)'
                    }
                }
            }
        },
    },
    plugins: [require("tailwindcss-animate")],
};

export default config;
