import { cpSync, existsSync, readFileSync, renameSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const viteIndex = resolve(dist, 'index.vite.html');
const finalIndex = resolve(dist, 'index.html');

if (existsSync(viteIndex)) {
    renameSync(viteIndex, finalIndex);
}

for (const dir of ['js', 'css']) {
    const src = resolve(root, dir);
    const dest = resolve(dist, dir);
    if (existsSync(src)) {
        cpSync(src, dest, { recursive: true });
    }
}

// 给非 module 的 script 补 defer，确保在 Vue 模块加载后再执行
if (existsSync(finalIndex)) {
    let html = readFileSync(finalIndex, 'utf8');
    html = html.replace(
        /<script(?![^>]*\btype=["']module["'])(?![^>]*\bdefer\b)([^>]*src=)/g,
        '<script defer$1'
    );
    if (!html.includes('href="css/main.css"')) {
        html = html.replace('</head>', '  <link rel="stylesheet" href="css/main.css">\n</head>');
    }
    writeFileSync(finalIndex, html, 'utf8');
}

console.log('[postbuild] dist ready: index.html + js/ + css/');