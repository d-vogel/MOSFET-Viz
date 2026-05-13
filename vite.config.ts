import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import preprocess from 'svelte-preprocess'

export default defineConfig({
  base: '/mosfet-animation/',
  plugins: [
    svelte({
      preprocess: preprocess()
    })
  ],
})
