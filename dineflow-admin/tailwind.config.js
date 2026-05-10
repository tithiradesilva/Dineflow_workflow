/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#E63946',
                    light: '#F87171',
                    dark: '#B91C1C',
                },
                secondary: '#1D3557',
                accent: '#457B9D',
                muted: '#F1FAEE',
                background: '#FAFAFA',
                success: '#10B981',
                danger: '#EF4444',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Poppins', 'sans-serif'],
            },
            borderRadius: {
                'xl': '1rem',
            },
            boxShadow: {
                'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
            }
        },
    },
    plugins: [],
}