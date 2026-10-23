import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { canonicalPageUrl, corePageSeo, organizationSchema, siteSeo } from './siteSeo';
import { renderCoreMetadata } from '../../scripts/build-site-seo.mjs';

describe('Blue Angel search metadata', () => {
  it('uses unique intent-specific titles and descriptions, with matching source HTML', () => {
    expect(new Set(siteSeo.pages.map((p) => p.title)).size).toBe(siteSeo.pages.length);
    expect(new Set(siteSeo.pages.map((p) => p.description)).size).toBe(siteSeo.pages.length);
    for (const page of siteSeo.pages) {
      expect(page.title.length).toBeLessThan(80);
      expect(page.description.length).toBeGreaterThan(60);
      expect(page.title).not.toMatch(/leading|preferred|#1/i);
    }
    const html = readFileSync('index.html', 'utf8');
    expect(html).toContain('<title>' + siteSeo.pages[0].title + '</title>');
    expect(html).toContain(siteSeo.pages[0].description);
    expect(corePageSeo('/services/?ref=test')?.path).toBe('/services');
  });

  it('keeps canonical URLs consistent on the business domain and repository preview', () => {
    expect(canonicalPageUrl('https://blueangelclinical.com/', '/')).toBe('https://blueangelclinical.com/');
    expect(canonicalPageUrl('https://blueangelclinical.com', '/services/?ref=x')).toBe('https://blueangelclinical.com/services/');
    expect(canonicalPageUrl('https://justintella.github.io/New-BACP-Website/', '/about')).toBe('https://justintella.github.io/New-BACP-Website/about/');
  });

  it('preserves the actual brand identity and does not mislabel the company as a clinic', () => {
    const live = organizationSchema('https://blueangelclinical.com');
    expect(live['@graph'].map((item) => item['@type'])).toEqual(['Organization', 'WebSite']);
    expect(live['@graph'][0].name).toBe('Blue Angel Clinical Partners');
    const preview = organizationSchema('https://justintella.github.io/New-BACP-Website');
    expect(preview['@graph'].map((item) => item['@type'])).toEqual(['Organization']);
  });

  it('writes one canonical and page-specific metadata into the initial HTML', () => {
    const template = '<html><head><title>Old</title><meta name="description" content="Old"><link rel="canonical" href="https://old.test/"><script id="site-schema" type="application/ld+json">{}</script></head><body><div id="root"></div></body></html>';
    for (const page of siteSeo.pages) {
      const html = renderCoreMetadata(template, page, siteSeo, 'https://blueangelclinical.com');
      expect((html.match(/rel="canonical"/g) ?? []).length).toBe(1);
      expect((html.match(/name="description"/g) ?? []).length).toBe(1);
      expect(html).toContain(canonicalPageUrl('https://blueangelclinical.com', page.path));
      expect(html).not.toContain('https://old.test/');
      expect(html).toContain('<div id="root"></div>');
      expect(html.includes('id="site-schema"')).toBe(page.path === '/');
    }
  });

  it('escapes metadata and supports a deliberately noindex staging build', () => {
    const page = { ...siteSeo.pages[1], title: 'Support & "Partnership" <test>' };
    const html = renderCoreMetadata('<head><title>Old</title></head>', page, siteSeo, 'https://blueangelclinical.com', true);
    expect(html).toContain('Support &amp; &quot;Partnership&quot; &lt;test&gt;');
    expect(html).toContain('content="noindex, follow"');
  });
});
