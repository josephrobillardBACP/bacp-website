import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { preview } from 'vite';
import { chromium } from '@playwright/test';

// Render the same public pages visitors see. No forms are submitted and external
// API requests are blocked, so builds never capture private or changing account data.
const root = process.cwd();
const catalog = JSON.parse(await readFile(join(root, 'src/content/site-seo.json'), 'utf8'));
const news = JSON.parse(await readFile(join(root, 'src/content/news.json'), 'utf8'));
const template = await readFile(join(root, 'dist/index.html'), 'utf8');
const asset = template.match(/<script[^>]*src="([^"]*\/assets\/[^"]+)"/)?.[1];
if (!asset) throw new Error('Cannot determine built asset base');
const base = asset.slice(0, asset.indexOf('/assets/') + 1);
const server = await preview({ base, preview: { host: '127.0.0.1', port: 0, strictPort: false, open: false } });
let browser;
try {
  const address = server.httpServer.address();
  if (!address || typeof address === 'string') throw new Error('Preview address unavailable');
  const origin = 'http://127.0.0.1:' + address.port;
  const channel = process.env.PRERENDER_BROWSER_CHANNEL;
  browser = await chromium.launch({ ...(channel ? { channel } : {}), headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  await context.route('**/*', (route) => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  const routes = [...catalog.pages.map((p) => p.path), '/blog', ...news.map((item) => '/blog/' + item.id)];
  for (const route of routes) {
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const response = await page.goto(origin + base + route.replace(/^\//, '') + (route === '/' ? '' : '/'), { waitUntil: 'networkidle' });
    if (!response?.ok()) throw new Error('Route failed: ' + route);
    await page.locator('h1').first().waitFor();
    // Trigger all existing reveal sections before saving visible initial HTML.
    await page.evaluate(async () => {
      for (let top = 0; top < document.documentElement.scrollHeight; top += 800) {
        window.scrollTo({ top, behavior: 'instant' });
        await new Promise((resolve) => setTimeout(resolve, 40));
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    await page.waitForTimeout(250);
    if (errors.length) throw new Error(route + ': ' + errors.join('; '));
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    if (!canonical || await page.locator('h1').count() !== 1) throw new Error('Missing/duplicate title or canonical: ' + route);
    const html = await page.content();
    const target = join(root, 'dist', route.replace(/^\//, ''));
    await mkdir(target, { recursive: true });
    await writeFile(join(target, 'index.html'), html);
    await page.close();
  }
  console.log('Rendered full HTML for ' + routes.length + ' public pages, with content, metadata and links.');
} finally {
  await browser?.close();
  await new Promise((resolve, reject) => server.httpServer.close((error) => error ? reject(error) : resolve()));
}
