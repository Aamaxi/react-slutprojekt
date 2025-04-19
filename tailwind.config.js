// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        "IMDb klon": {
          "base-100": "oklch(14% 0 0)",
          "base-200": "oklch(20% 0 0)",
          "base-300": "oklch(26% 0 0)",
          "base-content": "oklch(97% 0 0)",
          "primary": "oklch(64% 0.222 41.116)",
          "primary-content": "oklch(14% 0.004 49.25)",
          "secondary": "oklch(87% 0.01 258.338)",
          "secondary-content": "oklch(13% 0.028 261.692)",
          "accent": "oklch(64% 0.222 41.116)",
          "accent-content": "oklch(14% 0.004 49.25)",
          "neutral": "oklch(26% 0 0)",
          "neutral-content": "oklch(98% 0 0)",
          "info": "oklch(58% 0.158 241.966)",
          "info-content": "oklch(97% 0.013 236.62)",
          "success": "oklch(62% 0.194 149.214)",
          "success-content": "oklch(98% 0.014 180.72)",
          "warning": "oklch(66% 0.179 58.318)",
          "warning-content": "oklch(98% 0.022 95.277)",
          "error": "oklch(57% 0.245 27.325)",
          "error-content": "oklch(97% 0.013 17.38)",
        },
      },
    ],
  },
};