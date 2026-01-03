import fs from 'fs';
import path from 'path';
import fg from 'fast-glob';

const DIST = path.resolve('dist');
const THEME = '/wp-content/themes/soundrogue/assets';

const FILES = await fg(['**/*.html', '**/*.css'], {
    cwd: DIST,
    absolute: true,
});

for (const file of FILES) {
    let content = fs.readFileSync(file, 'utf8');

    content = content
        // images
        .replace(
            /(["'(])(?:\.\/|\.\.\/)?\/?assets\/images\//g,
            `$1${THEME}/images/`
        )
        // fonts
        .replace(
            /(["'(])(?:\.\/|\.\.\/)?\/?assets\/fonts\//g,
            `$1${THEME}/fonts/`
        )
        // css
        .replace(
            /(["'(])(?:\.\/|\.\.\/)?\/?assets\/css\//g,
            `$1${THEME}/css/`
        )
        // js
        .replace(
            /(["'(])(?:\.\/|\.\.\/)?\/?assets\/js\//g,
            `$1${THEME}/js/`
        );

    fs.writeFileSync(file, content);
}

console.log('✅ Paths rewritten correctly');
