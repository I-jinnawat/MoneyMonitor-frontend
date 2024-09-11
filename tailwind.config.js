/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	daisyui: {
		themes: ["light", "dark", "cupcake"],
	},

	plugins: [require("daisyui"), require("tailwindcss-animate")],
};
