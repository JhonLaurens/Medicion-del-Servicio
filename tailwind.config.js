/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Coltefinanciera - Consolidada
        brand: {
          primary: '#1a5f7a',    // Azul corporativo principal
          secondary: '#2c8aa6',  // Azul claro secundario
          accent: '#57a3c4',     // Azul accent
          light: '#86c5da',      // Azul muy claro
          dark: '#0f3d4f',       // Azul oscuro
        },
        // Colores para métricas - Optimizados
        metrics: {
          excellent: '#1e40af',  // Azul para calificaciones 5 (antes #059669)
          good: '#10b981',       // Verde para calificaciones 4
          warning: '#d97706',    // Naranja para calificaciones 3
          critical: '#ef4444',   // Rojo para calificaciones 1-2
          neutral: '#6b7280',    // Gris neutro
        },
        // Gradientes corporativos
        gradient: {
          from: '#1a5f7a',
          via: '#2c8aa6', 
          to: '#57a3c4'
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif'
        ]
      },
      boxShadow: {
        'custom': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'custom-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
