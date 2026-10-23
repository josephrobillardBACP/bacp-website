import { useEffect } from 'react';
import { journalSiteUrl } from '@/lib/journal';
import { canonicalPageUrl, organizationSchema, siteSeo, type SeoPage } from '@/lib/siteSeo';

export default function SiteSeo({ page }: { page: SeoPage }) {
  useEffect(() => {
    document.title = page.title;
    const site = journalSiteUrl();
    const url = canonicalPageUrl(site, page.path);
    const restorers: (() => void)[] = [];
    const meta = (key: string, content: string) => {
      const attr = key.startsWith('og:') ? 'property' : 'name';
      let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      const existing = tag;
      const previous = tag?.content;
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, key);
        document.head.append(tag);
      }
      tag.content = content;
      const updated = tag;
      restorers.push(() => { if (existing) existing.content = previous ?? ''; else updated.remove(); });
    };
    meta('description', page.description);
    meta('og:title', page.title);
    meta('og:description', page.description);
    meta('og:site_name', siteSeo.siteName);
    meta('og:type', 'website');
    meta('og:url', url);
    meta('og:image', canonicalPageUrl(site, '/') + 'brand-logo.png');
    meta('twitter:title', page.title);
    meta('twitter:description', page.description);
    meta('twitter:image', canonicalPageUrl(site, '/') + 'brand-logo.png');
    meta('robots', import.meta.env.DEV || import.meta.env.VITE_NOINDEX === 'true' ? 'noindex, follow' : 'index, follow');
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const previousCanonical = canonical?.href;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.append(canonical);
    }
    canonical.href = url;
    const updatedCanonical = canonical;
    let schema = document.getElementById('site-schema');
    if (page.path === '/') {
      if (!schema) {
        schema = document.createElement('script');
        schema.id = 'site-schema';
        schema.setAttribute('type', 'application/ld+json');
        document.head.append(schema);
      }
      schema.textContent = JSON.stringify(organizationSchema(site));
    } else schema?.remove();
    return () => {
      restorers.reverse().forEach((restore) => restore());
      if (previousCanonical) updatedCanonical.href = previousCanonical;
      else updatedCanonical.remove();
      document.getElementById('site-schema')?.remove();
    };
  }, [page]);
  return null;
}
