import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "gt-utils-js",
  description: "Biblioteca estándar de validaciones y utilidades para Guatemala",
  base: '/gt-utils-js/', // Base URL for GitHub Pages matching the repo name
  themeConfig: {
    nav: [
      { text: 'Inicio', link: '/' },
      { text: 'Documentación', link: '/identity' }
    ],
    sidebar: [
      {
        text: 'Módulos',
        items: [
          { text: 'Identidad (NIT/CUI)', link: '/identity' },
          { text: 'Finanzas y Bancos', link: '/finance' },
          { text: 'Vehículos (Placas)', link: '/vehicles' },
          { text: 'Geografía (Polígonos)', link: '/geo' },
          { text: 'Impuestos', link: '/taxes' },
          { text: 'Feriados y Calendario', link: '/holidays' },
          { text: 'Laboral (Liquidaciones)', link: '/labor' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/rodmarzavala/gt-utils-js' }
    ]
  }
})
