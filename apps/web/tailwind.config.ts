import type { Config } from "tailwindcss";

const config: Pick<Config, "presets"> = {
  presets: [
    {
      content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./ui/**/*.{js,ts,jsx,tsx}",
        // h/t to https://www.willliu.com/blog/Why-your-Tailwind-styles-aren-t-working-in-your-Turborepo
        "../../packages/ui/src/**/*{.js,.ts,.jsx,.tsx}",
        "../../packages/blocks/src/**/*{.js,.ts,.jsx,.tsx}",
      ],
      theme: {
        extend: {
          fontFamily: {
            sans: ["var(--font-be-vn)"],
          },
          animation: {
            // Infinite scroll animation
            "infinite-scroll": "infinite-scroll 22s linear infinite",
            "infinite-scroll-y": "infinite-scroll-y 22s linear infinite",
          },
          keyframes: {
            // Infinite scroll animation
            "infinite-scroll": {
              "0%": { transform: "translateX(0)" },
              "100%": { transform: "translateX(var(--scroll, -150%))" },
            },
            "infinite-scroll-y": {
              "0%": { transform: "translateY(0)" },
              "100%": { transform: "translateY(var(--scroll, -150%))" },
            },
          },
        },
      },
      plugins: [require("@tailwindcss/typography")],
    },
  ],
};

export default config;
