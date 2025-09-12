// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: [
    "node_modules/@heroui/**/*.{js,ts,jsx,tsx}", // 👈 necesario para HeroUI
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("@heroui/react/tailwind"), // 👈 plugin HeroUI
  ],
} satisfies Config;
