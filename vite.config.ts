import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import preprocess from 'svelte-preprocess'

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/MOSFET-Viz/' : '/',
  plugins: [
    svelte({
      preprocess: preprocess()
    })
  ],
}))
