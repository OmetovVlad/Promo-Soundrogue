import fs from 'fs'
import path from 'path'
import posthtml from 'posthtml'
import include from 'posthtml-include'
import { glob } from 'glob'

const SRC = path.resolve('src')

const files = await glob('src/**/*.html', {
    ignore: ['src/partials/**'],
})

for (const file of files) {
    const html = fs.readFileSync(file, 'utf8')

    const result = await posthtml([
        include({ root: SRC }),
    ]).process(html)

    fs.writeFileSync(file, result.html)
    console.log('🧩 include:', file)
}
