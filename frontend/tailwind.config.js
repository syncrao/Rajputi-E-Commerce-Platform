export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        rajputi: {
          pink: "#E04F80",
          green: "#000000ff",
          orange: "#F47C20",
          blue: "#2B4C9E",
          maroon: "#7B1E28",
          yellow: "#F2C12E",
          ivory: "#F8F3E6",
          black: "#2E2E2E",
        },
      },
      boxShadow: {
        'rajputi-light': '0 4px 10px rgba(240, 193, 46, 0.3)',
        'rajputi-card': '0 6px 12px rgba(224, 79, 128, 0.15)',
        'rajputi-icon': '0 0 8px rgba(242, 193, 46, 0.4)',
      },
      borderRadius: {
        'lg': '0.5rem',
        'xl': '0.75rem',
      },
    },
  },
  plugins: [],
}
