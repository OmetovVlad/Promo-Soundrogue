import { defineConfig } from 'vite';

export default defineConfig({
    root: 'src',
    publicDir: '../public',

    build: {
        outDir: '../dist',
        assetsDir: 'assets',
        emptyOutDir: true,

        rollupOptions: {
            input: {
                main: '/index.html'
            },
            output: {
                assetFileNames: 'assets/[name]-[hash][extname]',
                entryFileNames: 'assets/[name]-[hash].js'
            }
        }
    },

    server: {
        open: true
    }
});

