import { readFile, readdir, mkdir, writeFile, appendFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { loadEnv } from 'vite';

const root = process.cwd();
const directory = resolve(root, 'src/content/journal');
const calendar = JSON.parse(await readFile(resolve(root, 'src/content/journal-calendar.json'), 'utf8'));
const originalNews = JSON.parse(await readFile(resolve(root, 'src/content/news.json'), 'utf8'));
const files = (await readdir(directory)).filter((name) => name.endsWith('.json'));
const articles = await Promise.all(files.map(async (name) => JSON.parse(await readFile(join(directory, name), 'utf8'))));
const slugs = new Set();
const requiredStrings = ['slug', 'title', 'description', 'excerpt', 'category', 'author', 'intro', 'publishedAt', 'modifiedAt'];
for (const article of articles) {
  if (requiredStrings.some((key) => typeof article[key] !== 'string' || !article[key].trim())) throw new Error('Missing article metadata: ' + article.slug);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug) || slugs.has(article.slug)) throw new Error('Invalid or duplicate slug: ' + article.slug);
  slugs.add(article.slug);
  if (!['draft', 'published'].includes(article.status)) throw new Error('Invalid status: ' + article.slug);
  if (!['Feature', 'Field note'].includes(article.format)) throw new Error('Invalid format: ' + article.slug);
  if (!Number.isFinite(Date.parse(article.publishedAt)) || !Number.isFinite(Date.parse(article.modifiedAt)) || Date.parse(article.modifiedAt) < Date.parse(article.publishedAt)) throw new Error('Invalid article dates: ' + article.slug);
  if (!calendar.entries.some((entry) => entry.id === article.slug)) throw new Error('Article has no calendar brief: ' + article.slug);
  if (!Array.isArray(article.sections) || !article.sections.length || !article.takeaways?.length || !article.sources?.length || !Array.isArray(article.faqs) || !Array.isArray(article.relatedLinks)) throw new Error('Article is incomplete: ' + article.slug);
  const ids = new Set();
  for (const section of article.sections) {
    if (!/^[a-z0-9-]+$/.test(section.id) || ids.has(section.id) || !section.title || !section.paragraphs?.length) throw new Error('Invalid section: ' + article.slug);
    ids.add(section.id);
    for (const id of section.sourceIds ?? []) if (!article.sources.some((source) => source.id === id)) throw new Error('Unknown citation: ' + id);
    if (section.link && !section.link.href.startsWith('/')) throw new Error('Expected internal link: ' + article.slug);
  }
  for (const source of article.sources) if (!source.label || !source.id || !/^https:\/\//.test(source.url) || !/^\d{4}-\d{2}-\d{2}$/.test(source.checkedOn)) throw new Error('Invalid source: ' + article.slug);
}
if (new Set(calendar.entries.map((entry) => entry.id)).size !== calendar.entries.length) throw new Error('Calendar slugs must be unique');
if (process.argv.includes('--check')) {
  console.log('Journal content valid: ' + articles.length + ' article(s), ' + calendar.entries.length + ' calendar briefs.');
  process.exit(0);
}

const now = Date.now();
const publicationEnabled = calendar.websitePublicationEnabled === true;
const published = publicationEnabled ? articles.filter((article) => article.status === 'published' && Date.parse(article.publishedAt) <= now).sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)) : [];
const output = resolve(root, 'dist');
const template = await readFile(join(output, 'index.html'), 'utf8');
const assetPath = template.match(/<script[^>]*src="([^"]*\/assets\/[^"]+)"/)?.[1];
if (!assetPath) throw new Error('Could not identify the Vite base path');
const base = assetPath.slice(0, assetPath.indexOf('/assets/') + 1);
const env = loadEnv(process.env.NODE_ENV === 'development' ? 'development' : 'production', root, 'VITE_');
const site = (process.env.VITE_SITE_URL || env.VITE_SITE_URL || 'https://justintella.github.io/New-BACP-Website').replace(/\/$/, '');
const siteName = 'Blue Angel Clinical Partners';
const coreSeo = JSON.parse(await readFile(resolve(root, 'src/content/site-seo.json'), 'utf8'));
const canonical = (path) => site + (path === '/' ? '/' : path.replace(/\/+$/, '') + '/');
const noindex = (process.env.VITE_NOINDEX || env.VITE_NOINDEX) === 'true';
const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const href = (path) => base + path.replace(/^\//, '');
const date = (value) => new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'America/Los_Angeles' }).format(new Date(value));
const link = (item) => '<a href="' + escape(href(item.href)) + '">' + escape(item.label) + '</a>';
const styles = '<style>.journal-static{max-width:960px;margin:0 auto;padding:40px 24px 80px;font-family:Garamond,Georgia,serif;color:#1b2c4a;background:#fff}.journal-static h1{font-size:clamp(2rem,5vw,3.8rem);line-height:1.1;font-weight:400}.journal-static h2{font-size:2rem;line-height:1.2;font-weight:400;margin-top:2.5rem}.journal-static p,.journal-static li{font-size:1.2rem;line-height:1.8}.journal-static ul,.journal-static ol{padding-left:1.5rem;list-style:revert}.journal-static a{text-decoration:underline;color:#3c6688}.journal-static header{border-bottom:1px solid #ddd;padding-bottom:2rem}.journal-static section{margin-top:2rem}.journal-static nav{display:flex;gap:1.5rem;flex-wrap:wrap;padding-bottom:2rem}.journal-static .meta{font-size:1rem;color:#536477}</style>';
function render(path, title, description, body, article) {
  const url = canonical(path);
  let html = template.replace(/<title>[\s\S]*?<\/title>/, '<title>' + escape(title + ' | ' + siteName) + '</title>');
  html = html.replace(/<meta\b[^>]*(?:name|property)="(?:description|robots|og:title|og:description|og:type|og:url|og:image|twitter:title|twitter:description|twitter:image)"[^>]*>/g, '');
  html = html.replace(/<link\b[^>]*rel="canonical"[^>]*>/g, '').replace(/<script\b[^>]*id="site-schema"[^>]*>[\s\S]*?<\/script>/g, '');
  const meta = '<meta name="description" content="' + escape(description) + '"><meta name="robots" content="' + (noindex ? 'noindex, follow' : 'index, follow') + '"><link rel="canonical" href="' + escape(url) + '"><meta property="og:title" content="' + escape(title + ' | ' + siteName) + '"><meta property="og:description" content="' + escape(description) + '"><meta property="og:type" content="' + (article ? 'article' : 'website') + '"><meta property="og:url" content="' + escape(url) + '"><meta property="og:image" content="' + escape(site + '/brand-logo.png') + '"><meta name="twitter:title" content="' + escape(title + ' | ' + siteName) + '"><meta name="twitter:description" content="' + escape(description) + '"><meta name="twitter:image" content="' + escape(site + '/brand-logo.png') + '">';
  const schema = { '@context': 'https://schema.org', '@type': article ? 'BlogPosting' : 'Blog', headline: title, name: title, description, url, ...(article ? { datePublished: article.publishedAt, dateModified: article.modifiedAt, author: { '@type': 'Organization', name: article.author }, mainEntityOfPage: url, image: site + '/brand-logo.png' } : {}), publisher: { '@type': 'Organization', name: siteName, url: canonical('/'), logo: { '@type': 'ImageObject', url: site + '/brand-logo.png' } } };
  html = html.replace('</head>', meta + '<script id="journal-schema" type="application/ld+json">' + JSON.stringify(schema).replace(/</g, '\\u003c') + '</script>' + styles + '</head>');
  const navigation = '<nav aria-label="Site navigation"><a href="' + href('/') + '">' + siteName + '</a><a href="' + href('/blog') + '">Blog</a><a href="' + href('/be-a-partner') + '">Become a Partner</a></nav>';
  return html.replace('<div id="root"></div>', '<div id="root"><main class="journal-static">' + navigation + body + '</main></div>');
}
async function save(path, html) {
  const target = join(output, path);
  await mkdir(target, { recursive: true });
  await writeFile(join(target, 'index.html'), html);
}
const indexTitle = publicationEnabled ? 'Concierge Medicine Journal' : 'Blue Angel News & Press';
const indexDescription = publicationEnabled ? 'Perspectives on concierge medicine, independent physician practice, operational support, and succession planning from Blue Angel Clinical Partners.' : 'Announcements, partnership updates and news from Blue Angel Clinical Partners.';
const newsBody = originalNews.map((item) => '<section><p class="meta">' + escape(item.category) + ' · ' + escape(item.date) + '</p><h2><a href="' + href('/blog/' + item.id) + '">' + escape(item.title) + '</a></h2><p><a href="' + href('/blog/' + item.id) + '">Read full story →</a></p></section>').join('');
for (const item of originalNews) {
  const body = '<article><a href="' + href('/blog') + '">← Back to Blog</a><header><p class="meta">' + escape(item.category) + ' · ' + escape(item.date) + '</p><h1>' + escape(item.title) + '</h1></header>' + item.paragraphs.map((paragraph, index) => '<p>' + (index === 0 ? '<strong>' + escape(item.location) + '</strong> — ' : '') + escape(paragraph) + '</p>').join('') + '</article>';
  await save('blog/' + item.id, render('/blog/' + item.id, item.title, item.paragraphs[0], body));
}
const indexBody = '<header><h1>' + (publicationEnabled ? 'The Blue Angel Journal' : 'Latest news.') + '</h1><p>' + escape(indexDescription) + '</p></header>' + published.map((article) => '<section><p class="meta">' + escape(article.category) + ' · ' + escape(date(article.publishedAt)) + '</p><h2><a href="' + href('/blog/' + article.slug) + '">' + escape(article.title) + '</a></h2><p>' + escape(article.excerpt) + '</p></section>').join('') + newsBody;
await save('blog', render('/blog', indexTitle, indexDescription, indexBody));
for (const article of published) {
  const body = '<article><header><p class="meta">' + escape(article.category) + ' · ' + escape(article.format) + '</p><h1>' + escape(article.title) + '</h1><p>' + escape(article.excerpt) + '</p><p class="meta">By ' + escape(article.author) + ' · ' + escape(date(article.publishedAt)) + '</p></header><p>' + escape(article.intro) + '</p><aside><h2>At a glance</h2><ul>' + article.takeaways.map((t) => '<li>' + escape(t) + '</li>').join('') + '</ul></aside>' +
    article.sections.map((section) => '<section id="' + escape(section.id) + '"><h2>' + escape(section.title) + '</h2>' + section.paragraphs.map((p) => '<p>' + escape(p) + '</p>').join('') + (section.bullets ? '<ul>' + section.bullets.map((b) => '<li>' + escape(b) + '</li>').join('') + '</ul>' : '') + (section.sourceIds ? '<p class="meta">Sources: ' + section.sourceIds.map((id) => { const source = article.sources.find((s) => s.id === id); return '<a href="' + escape(source.url) + '">' + escape(source.label) + '</a>'; }).join('; ') + '</p>' : '') + (section.link ? '<p>' + link(section.link) + '</p>' : '') + '</section>').join('') +
    '<section id="common-questions"><h2>Common questions</h2>' + article.faqs.map((f) => '<h3>' + escape(f.question) + '</h3><p>' + escape(f.answer) + '</p>').join('') + '</section><section id="sources"><h2>Sources &amp; editorial note</h2><ol>' + article.sources.map((s) => '<li><a href="' + escape(s.url) + '">' + escape(s.label) + '</a> · Checked ' + escape(s.checkedOn) + '</li>').join('') + '</ol>' + (article.aiAssisted ? '<p>This article was prepared with AI assistance and links to the sources used. It discusses practice models and operations; individual membership terms and professional obligations vary.</p>' : '') + '</section><section><h2>Explore Blue Angel</h2>' + article.relatedLinks.map(link).join(' · ') + '</section></article>';
  await save('blog/' + article.slug, render('/blog/' + article.slug, article.title, article.description, body, article));
}
const urls = [...coreSeo.pages.map((page) => ({ path: page.path })), { path: '/blog', modified: published[0]?.modifiedAt }, ...originalNews.map((item) => ({ path: '/blog/' + item.id })), ...published.map((article) => ({ path: '/blog/' + article.slug, modified: article.modifiedAt }))];
await writeFile(join(output, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + urls.map((item) => '<url><loc>' + escape(canonical(item.path)) + '</loc>' + (item.modified ? '<lastmod>' + escape(item.modified) + '</lastmod>' : '') + '</url>').join('') + '</urlset>');
await appendFile(join(output, 'robots.txt'), '\nSitemap: ' + site + '/sitemap.xml\n');
console.log('Pre-rendered journal index and ' + published.length + ' published article(s); wrote sitemap. Canonical site: ' + site);
