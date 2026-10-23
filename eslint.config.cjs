const globals = require('globals');
module.exports = [{ ignores: ['node_modules/**', 'public/**'] }, {
  files: ['**/*.js', '**/*.cjs', 'bin/www'],
  languageOptions: { ecmaVersion: 'latest', sourceType: 'commonjs', globals: { ...globals.node, ...globals.browser } },
  rules: { 'no-undef': 'error', 'no-unreachable': 'error' }
}, { files: ['assets/js/*.js'], languageOptions: { sourceType: 'module' } }];
