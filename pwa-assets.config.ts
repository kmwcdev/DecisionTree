import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

export default defineConfig({
  preset: {
    ...minimal2023Preset,
    maskable: {
      sizes: [512],
      resizeOptions: { background: '#111827' },
    },
    apple: {
      sizes: [180],
      resizeOptions: { background: '#111827' },
    },
  },
  images: ['public/logo.svg'],
})
