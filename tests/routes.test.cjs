const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { once } = require('node:events');
const { JSDOM } = require('jsdom');
process.env.NODE_ENV = 'production';
const app = require('../app');
test('six routes and their generated assets preserve navigation and dropdowns', async () => {
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    for (const route of ['/', '/development', '/networking', '/testimonials', '/about', '/contact']) {
      const res = await fetch(base + route);
      assert.equal(res.status, 200);
      const html = await res.text();
      assert.doesNotMatch(html, /jquery-3\.2|bootstrap\/4|<script[^>]+https?:/);
      const dom = new JSDOM(html, { runScripts: 'outside-only', url: base + route });
      for (const asset of dom.window.document.querySelectorAll('script[src],link[rel="stylesheet"],img[src]')) {
        const url = asset.getAttribute('src') || asset.getAttribute('href');
        if (!url.startsWith('http')) assert.equal((await fetch(new URL(url, base))).status, 200, url);
      }
      const js = fs.readFileSync('public/' + require('../public/manifest.json')['app.js'], 'utf8');
      dom.window.eval(js);
      const toggle = dom.window.document.querySelector('.navbar-toggler');
      toggle.click();
      await new Promise(resolve => setTimeout(resolve, 400));
      assert.equal(toggle.getAttribute('aria-expanded'), 'true');
      assert.ok(dom.window.document.querySelector('#toggleNav').classList.contains('show'));
      if (route === '/testimonials') {
        const dropdown = dom.window.document.querySelector('[data-bs-toggle="dropdown"]');
        dropdown.click();
        assert.equal(dropdown.getAttribute('aria-expanded'), 'true');
        assert.ok(dropdown.nextElementSibling.classList.contains('show'));
      }
      dom.window.close();
    }
    const missing = await fetch(base + '/missing');
    assert.equal(missing.status, 404);
    const errorPage = await missing.text();
    assert.match(errorPage, /<h1>Not Found<\/h1>/);
    assert.doesNotMatch(errorPage, /ReferenceError|Error:|node_modules/);
    const ejs = require('ejs');
    const escaped = ejs.render(fs.readFileSync('views/partials/messages.ejs', 'utf8'), { message: { type: 'danger', body: '<script>bad()</script>' } });
    assert.match(escaped, /&lt;script&gt;/);
    assert.doesNotMatch(escaped, /<script>/);
  } finally { server.close(); }
});
