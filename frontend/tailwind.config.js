module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        flip: {
          "0%": { transform: "rotateY(0deg)" },
          "50%": { transform: "rotateY(-180deg)" },
          "100%": { transform: "rotateY(-180deg)" },
        },
      },
      animation: {
        flip: "flip 1s infinite",
      },
    },
  },
  plugins: [],
};
