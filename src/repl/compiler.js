import * as rollup from 'rollup/dist/es/rollup.browser';

// you could use unpkg like the official repl, i thought i'd try out jsdelivr
const CDN_URL = 'https://unpkg.com/';
importScripts(`${CDN_URL}svelte/compiler.js`);

const componentLookup = new Map();

async function fetch_package(url) {
  return (await fetch(url)).text();
}

self.onmessage = async ({ data }) => {
  data.forEach((component) => {
    componentLookup.set(`./${component.name}.${component.type}`, component);
  });

  const bundle = await rollup.rollup({
    input: './App.svelte',
    plugins: [
      {
        name: 'repl-plugin',
        async resolveId(importee, importer) {
          if (importee === 'svelte') return `${CDN_URL}/svelte/index.mjs`;
          if (importee.startsWith('svelte/')) {
            return `${CDN_URL}/svelte/${importee.slice(7)}/index.mjs`;
          }
          if (importer && importer.startsWith(`${CDN_URL}/svelte`)) {
            const resolved = new URL(importee, importer).href;
            if (resolved.endsWith('.mjs')) return resolved;
            return `${resolved}/index.mjs`;
          }
          if (componentLookup.has(importee)) return importee;
          if (importee.startsWith('.')) return new URL(importee, importer).href;
          const pkg_url = `${CDN_URL}/${importee}/package.json`;
          const pkg = JSON.parse(await fetch_package(pkg_url));

          if (pkg.svelte || pkg.module || pkg.main) {
            const url = pkg_url.replace(/\/package\.json$/, '');
            return new URL(pkg.svelte || pkg.module || pkg.main, `${url}/`).href;
          }

          return importee;
        },
        async load(id) {
          if (componentLookup.has(id)) return componentLookup.get(id).source;

          return await fetch_package(id);
        },
        transform(code, id) {
          //@ts-ignore
          if (/.*\.svelte/.test(id)) return svelte.compile(code).js.code;
        },
      },
    ],
  });

  // a touch longwinded but output contains an array of chunks
  // we are not code-splitting, so we only have a single chunk
  const output = (await bundle.generate({ format: 'esm' })).output[0];

  self.postMessage(output.code);
};
