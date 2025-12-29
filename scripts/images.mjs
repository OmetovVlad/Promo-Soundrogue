import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import posthtml from 'posthtml';
import postcss from 'postcss';
import safeParser from 'postcss-safe-parser';
import fg from 'fast-glob';

const DIST = path.resolve('dist');
const IMAGE_RE = /\.(png|jpe?g)$/i;

// ---------- IMAGE CONVERT ----------------

async function generateImages(file) {
    const base = file.replace(IMAGE_RE, '');
    const webp = `${base}.webp`;
    const avif = `${base}.avif`;
    const lqip = `${base}.lq.webp`;

    if (!fs.existsSync(webp))
        await sharp(file).webp({ quality: 75 }).toFile(webp);

    if (!fs.existsSync(avif))
        await sharp(file).avif({ quality: 50 }).toFile(avif);

    if (!fs.existsSync(lqip))
        await sharp(file)
            .resize(32)
            .blur()
            .webp({ quality: 30 })
            .toFile(lqip);
}

// ---------- HTML ------------------------

async function processHTML() {
    const htmlFiles = await fg('**/*.html', { cwd: DIST });
    const images = new Set();

    for (const file of htmlFiles) {
        const filePath = path.join(DIST, file);
        const html = fs.readFileSync(filePath, 'utf8');

        const result = await posthtml([
            tree => {
                tree.match({ tag: 'img' }, node => {
                    // 1️⃣ уже обработан
                    if (node.attrs?.['data-picture']) return node;

                    const src = node.attrs?.src;
                    if (!src || !IMAGE_RE.test(src)) return node;

                    images.add(src);
                    const base = src.replace(IMAGE_RE, '');

                    // 2️⃣ помечаем img
                    node.attrs['data-picture'] = 'true';

                    return {
                        tag: 'picture',
                        attrs: {
                            class: 'progressive',
                            style: `background-image:url('${base}.lq.webp')`
                        },
                        content: [
                            {
                                tag: 'source',
                                attrs: {
                                    srcset: `${base}.avif`,
                                    type: 'image/avif'
                                }
                            },
                            {
                                tag: 'source',
                                attrs: {
                                    srcset: `${base}.webp`,
                                    type: 'image/webp'
                                }
                            },
                            node
                        ]
                    };
                });
            }
        ]).process(html);

        fs.writeFileSync(filePath, result.html);
    }

    return images;
}


// ---------- CSS -------------------------

async function processCSS() {
    const cssFiles = await fg('assets/**/*.css', { cwd: DIST });
    const images = new Set();

    for (const file of cssFiles) {
        const filePath = path.join(DIST, file);
        const css = fs.readFileSync(filePath, 'utf8');

        const root = postcss().process(css, { parser: safeParser }).root;

        root.walkDecls(decl => {
            const match = decl.value.match(/url\(([^)]+)\)/);
            if (!match) return;

            const url = match[1].replace(/['"]/g, '');
            if (!IMAGE_RE.test(url)) return;

            images.add(url);
            const base = url.replace(IMAGE_RE, '');

            decl.value = `url(${base}.lq.webp)`;

            decl.cloneAfter({
                value: `url(${base}.webp)`,
                parent: decl.parent.clone({ nodes: [] })
            });

            decl.cloneAfter({
                value: `url(${base}.avif)`,
                parent: decl.parent.clone({ nodes: [] })
            });
        });

        fs.writeFileSync(filePath, root.toString());
    }

    return images;
}

// ---------- MAIN ------------------------

async function run() {
    const htmlImages = await processHTML();
    const cssImages = await processCSS();
    const all = new Set([...htmlImages, ...cssImages]);

    for (const img of all) {
        const file = path.join(DIST, img);
        if (fs.existsSync(file)) {
            console.log('🖼', img);
            await generateImages(file);
        }
    }
}

run();
