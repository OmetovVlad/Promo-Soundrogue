import fs from 'fs';
import path from 'path';
import fg from 'fast-glob';

const DIST = path.resolve('dist');
const WP = path.join(
    DIST,
    'wp-content/themes/soundrogue/assets'
);

const MAP = [
    { from: 'assets/images/**/*', to: 'images' },
    { from: 'assets/fonts/**/*',  to: 'fonts' },
    { from: 'assets/js/**/*',     to: 'js' },
    { from: 'assets/css/**/*',    to: 'css' },
];

for (const { from } of MAP) {
    const files = await fg(from, { cwd: DIST });

    for (const file of files) {
        const src = path.join(DIST, file);

        const relative = file.replace(/^assets\//, '');
        const dest = path.join(WP, relative);

        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.renameSync(src, dest);
    }
}


// чистим пустую папку assets
fs.rmSync(path.join(DIST, 'assets'), { recursive: true, force: true });

console.log('✅ Assets moved to wp-content');
