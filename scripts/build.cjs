const fs = require('node:fs');
const sass = require('sass');
const { build } = require('esbuild');
const { createHash } = require('node:crypto');
async function main() {
  fs.rmSync('public/dist', { recursive: true, force: true });
  fs.mkdirSync('public/dist', { recursive: true });
  const css = sass.compile('assets/sass/app.scss', { loadPaths: ['node_modules'], style: 'compressed', silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function'] }).css;
  const js = (await build({ entryPoints: ['assets/js/app.js'], bundle: true, minify: true, write: false, target: 'es2020' })).outputFiles[0].text;
  fs.cpSync('node_modules/font-awesome/fonts', 'public/fonts', { recursive: true });
  const manifest = {};
  for (const [extension, content] of [['css', css], ['js', js]]) {
    const hash = createHash('sha256').update(content).digest('hex').slice(0, 12);
    const file = `dist/app.${hash}.${extension}`;
    fs.writeFileSync(`public/${file}`, content);
    manifest[`app.${extension}`] = file;
  }
  fs.writeFileSync('public/manifest.json', JSON.stringify(manifest, null, 2) + '\n');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
