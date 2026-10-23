import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const canonical = (site, path) => site.replace(/\/+$/, '') + (path === '/' ? '/' : path.replace(/\/+$/, '') + '/');

export function renderCoreMetadata(template, page, catalog, site, noindex = false) {
  const url = canonical(site, page.path);
  const root = canonical(site, '/');
  let html = template.replace(/<title>[\s\S]*?<\/title>/, '<title>' + escape(page.title) + '</title>');
  html = html.replace(/<meta\b[^>]*(?:name|property)="(?:description|robots|og:title|og:description|og:type|og:url|og:image|og:site_name|twitter:title|twitter:description|twitter:image)"[^>]*>/g, '');
  html = html.replace(/<link\b[^>]*rel="canonical"[^>]*>/g, '')
    .replace(/<script\b[^>]*id="site-schema"[^>]*>[\s\S]*?<\/script>/g, '');
  const values = [
    ['description', page.description], ['robots', noindex ? 'noindex, follow' : 'index, follow'],
    ['og:title', page.title], ['og:description', page.description], ['og:site_name', catalog.siteName],
    ['og:type', 'website'], ['og:url', url], ['og:image', root + 'brand-logo.png'],
    ['twitter:title', page.title], ['twitter:description', page.description], ['twitter:image', root + 'brand-logo.png'],
  ];
  let metadata = values.map(([key, value]) => `<meta ${key.startsWith('og:') ? 'property' : 'name'}="${key}" content="${escape(value)}">`).join('\n');
  metadata += '\n<link rel="canonical" href="' + escape(url) + '">';
  if (page.path === '/') {
    const graph = [{ '@type': 'Organization', '@id': root + '#organization', name: catalog.siteName,
      alternateName: catalog.alternateName, url: root, logo: root + 'brand-logo.png',
      sameAs: ['https://www.linkedin.com/company/blue-angel-clinical-partners'] }];
    if (new URL(root).pathname === '/') graph.push({ '@type': 'WebSite', '@id': root + '#website',
      url: root, name: catalog.siteName, alternateName: catalog.alternateName,
      publisher: { '@id': root + '#organization' } });
    metadata += '\n<script id="site-schema" type="application/ld+json">' +
      JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c') + '</script>';
  }
  return html.replace('</head>', metadata + '\n</head>');
}

async function build() {
  const { loadEnv } = await import('vite');
  const root = process.cwd();
  const catalog = JSON.parse(await readFile(resolve(root, 'src/content/site-seo.json'), 'utf8'));
  const output = resolve(root, 'dist');
  const template = await readFile(join(output, 'index.html'), 'utf8');
  const env = loadEnv(process.env.NODE_ENV === 'development' ? 'development' : 'production', root, 'VITE_');
  const site = (process.env.VITE_SITE_URL || env.VITE_SITE_URL || 'https://justintella.github.io/New-BACP-Website').replace(/\/+$/, '');
  const parsed = new URL(site);
  if (!['https:', 'http:'].includes(parsed.protocol) || parsed.search || parsed.hash) throw new Error('Invalid VITE_SITE_URL');
  const noindex = (process.env.VITE_NOINDEX || env.VITE_NOINDEX) === 'true';
  const paths = new Set();
  for (const page of catalog.pages) {
    if (!/^\/[a-z0-9/-]*$/.test(page.path) || paths.has(page.path) || !page.title || !page.description) throw new Error('Invalid page metadata: ' + page.path);
    paths.add(page.path);
    const directory = join(output, page.path.replace(/^\//, ''));
    await mkdir(directory, { recursive: true });
    await writeFile(join(directory, 'index.html'), renderCoreMetadata(template, page, catalog, site, noindex));
  }
  console.log('Wrote route-specific search metadata for ' + paths.size + ' core pages. Canonical site: ' + site);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await build();
