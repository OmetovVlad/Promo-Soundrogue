import fs from 'fs/promises';
import path from 'path';
import posthtml from 'posthtml';
import include from 'posthtml-include';

const src = path.resolve('src/pages');

async function process(file) {
    const filePath = path.join(src, file);
    const html = await fs.readFile(filePath, 'utf-8');

    const result = await posthtml([
        include({ root: path.resolve('src') })
    ]).process(html);

    await fs.writeFile(filePath, result.html);
}

async function run() {
    const files = await fs.readdir(src);
    const htmlFiles = files.filter(f => f.endsWith('.html'));

    for (const file of htmlFiles) {
        await process(file);
    }

    console.log('✅ HTML includes done (src)');
}

run();
