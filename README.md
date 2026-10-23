# Meet Aleksey legacy site

The Express server serves six showcase pages. The forms have no server submission handler.
No live deployment is established.

## Local use

Use Node 24 and npm 11.19.1.

```sh
npm ci
npm run lint
npm test
npm start
```

`npm run build` compiles Sass and bundles Bootstrap 5 into `public/dist`.
It writes content hashes into `public/manifest.json` for the EJS layouts.
Images retain their existing public paths. The build refreshes the Font Awesome fonts.
`npm run dev` rebuilds assets once and starts the Node server watcher.
Run the build again after asset changes. BrowserSync and HMR are removed.

## Security changes (2026-10-23)

The app uses Express 5, EJS 7, Bootstrap 5, Dart Sass, and esbuild.
The new templates retain escaped text, shared layouts, navigation, images, and all six routes.
Bootstrap collapse and dropdown attributes use the version 5 names.
Compatibility CSS preserves the old media layout and input addons.

The source has no Vue component, carousel, SweetAlert, or Axios caller in its routed templates.
Those template extras and the retired Webpack/Gulp loaders are removed.
Mavo had no property markup or editor controls in the routed templates. Its unused remote scripts and storage declaration are removed.
The generated browser files replace the old committed vendor bundles and vulnerable CDN scripts.

The full and runtime npm audits each report zero findings at the tested dependency graph.
The integration test uses the real Express server, EJS templates, generated assets, and Bootstrap code in a DOM.
It checks all routes and image/script/style URLs, navigation collapse, dropdowns, escaped text, and the production 404 page.
The browser check covers the built navigation and loaded images. It does not prove every visual detail or a public deployment.
The remote Google font remains a browser request from CSS, as before.

No deployment, production write, credential rotation, approval, or merge occurred.

## License

MIT. The original source license remains in `LICENSE`.
