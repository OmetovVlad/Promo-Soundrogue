import { defineConfig } from 'vite'
import path from 'path'
import { createHtmlPlugin } from 'vite-plugin-html'

export default defineConfig({
    root: 'src',
    publicDir: '../public',

    plugins: [
        createHtmlPlugin({
            minify: false, // чтобы было читаемо
        }),
    ],

    build: {
        outDir: '../dist',
        emptyOutDir: true,
        assetsDir: 'assets',

        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'src/index.html'),
            },
        },
    },

    server: {
        open: true,
    },
})
