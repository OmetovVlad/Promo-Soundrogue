import sharp from 'sharp';
import fs from 'fs-extra';
import path from 'path';

const ROOT = process.cwd();

const sourceSvg = path.join(ROOT, 'public/favicon.svg');
const outputPath = path.join(ROOT, 'public');

// размеры
const sizes = [16, 32, 48, 72, 96, 144, 192, 512];

async function createPngIcons() {
    console.log('🔄 PNG favicons...');
    for (const size of sizes) {
        await sharp(sourceSvg)
            .resize(size, size)
            .png()
            .toFile(path.join(outputPath, `favicon-${size}x${size}.png`));
    }
}

async function createIco() {
    console.log('🔄 favicon.ico...');
    await sharp(sourceSvg)
        .resize(48, 48)
        .toFile(path.join(outputPath, 'favicon.ico'));
}

async function createAppleIcon() {
    console.log('🔄 apple-touch-icon...');
    await sharp(sourceSvg)
        .resize(180, 180)
        .png()
        .toFile(path.join(outputPath, 'apple-touch-icon.png'));
}

async function createManifest() {
    console.log('🔄 site.webmanifest...');

    const manifest = {
        name: 'Международная логистика и ВЭД под ключ',
        short_name: 'АзияТрансРейл',
        icons: sizes.map(size => ({
            src: `/favicon-${size}x${size}.png`,
            sizes: `${size}x${size}`,
            type: 'image/png'
        })),
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone'
    };

    await fs.writeFile(
        path.join(outputPath, 'site.webmanifest'),
        JSON.stringify(manifest, null, 2)
    );
}

(async function generate() {
    await fs.ensureDir(outputPath);

    await createPngIcons();
    await createIco();
    await createAppleIcon();
    await createManifest();

    console.log('✅ favicons generated');
})();
