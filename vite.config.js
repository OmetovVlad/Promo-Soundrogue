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
            output: {
                entryFileNames: 'assets/js/promo.js',
                assetFileNames: ({ name }) => {
                    if (!name) return 'assets/[name][extname]';

                    const ext = name.split('.').pop();

                    if (ext === 'css') return 'assets/css/promo.css';
                    if (['woff', 'woff2', 'ttf', 'otf', 'eot'].includes(ext))
                        return 'assets/fonts/[name][extname]';
                    if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'avif'].includes(ext))
                        return 'assets/images/[name][extname]';

                    return 'assets/[name][extname]';
                },
            }
        },
    },

    server: {
        open: true,
    },

    css: {
        preprocessorOptions: {
            scss: {
                quietDeps: true,
            },
        },
    },
})
