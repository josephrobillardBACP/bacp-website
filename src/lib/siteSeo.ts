import catalog from '@/content/site-seo.json';

export const siteSeo = catalog;
export type SeoPage = (typeof catalog.pages)[number];

export function normalizedSeoPath(path: string) {
  return path.split(/[?#]/, 1)[0].replace(/\/+$/, '') || '/';
}

export function corePageSeo(path: string) {
  return siteSeo.pages.find((page) => page.path === normalizedSeoPath(path));
}

export function canonicalPageUrl(site: string, path: string) {
  const route = normalizedSeoPath(path);
  return site.replace(/\/+$/, '') + (route === '/' ? '/' : route + '/');
}

export function organizationSchema(site: string) {
  const url = canonicalPageUrl(site, '/');
  const organization = {
    '@type': 'Organization', '@id': url + '#organization',
    name: siteSeo.siteName, alternateName: siteSeo.alternateName, url,
    logo: url + 'brand-logo.png',
    sameAs: ['https://www.linkedin.com/company/blue-angel-clinical-partners'],
  };
  // Google's site-name feature supports domain/subdomain roots, not a
  // repository subdirectory such as the GitHub Pages preview.
  const graph: Record<string, unknown>[] = [organization];
  if (new URL(url).pathname === '/') graph.push({
    '@type': 'WebSite', '@id': url + '#website', url,
    name: siteSeo.siteName, alternateName: siteSeo.alternateName,
    publisher: { '@id': organization['@id'] },
  });
  return { '@context': 'https://schema.org', '@graph': graph };
}
