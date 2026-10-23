import { useEffect } from 'react';
import { journalSiteUrl, type JournalArticle } from '@/lib/journal';
import { canonicalPageUrl, siteSeo } from '@/lib/siteSeo';

type Props = { title: string; description: string; path: string; article?: JournalArticle; noindex?: boolean };
const siteName = 'Blue Angel Clinical Partners';
const defaultDescription = siteSeo.pages[0].description;

export default function JournalSeo({ title, description, path, article, noindex = false }: Props) {
  useEffect(() => {
    const site = journalSiteUrl();
    const url = canonicalPageUrl(site, path);
    const tags: HTMLMetaElement[] = [];
    const setMeta = (key: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, key);
        document.head.append(tag);
        tags.push(tag);
      }
      tag.content = content;
    };
    setMeta('description', description);
    setMeta('og:title', title + ' | ' + siteName, true);
    setMeta('og:description', description, true);
    setMeta('og:type', article ? 'article' : 'website', true);
    setMeta('og:url', url, true);
    setMeta('og:image', site + '/brand-logo.png', true);
    setMeta('twitter:title', title + ' | ' + siteName);
    setMeta('twitter:description', description);
    setMeta('twitter:image', site + '/brand-logo.png');
    setMeta('robots', noindex || import.meta.env.DEV || import.meta.env.VITE_NOINDEX === 'true' ? 'noindex, follow' : 'index, follow');
    if (article) {
      setMeta('article:published_time', article.publishedAt, true);
      setMeta('article:modified_time', article.modifiedAt, true);
    }
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.append(canonical);
    }
    canonical.href = url;
    let schema = document.getElementById('journal-schema') as HTMLScriptElement | null;
    if (!schema) {
      schema = document.createElement('script');
      schema.id = 'journal-schema';
      schema.type = 'application/ld+json';
      document.head.append(schema);
    }
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': article ? 'BlogPosting' : 'Blog',
      headline: title, name: title, description, url,
      ...(article ? {
        datePublished: article.publishedAt, dateModified: article.modifiedAt,
        author: { '@type': 'Organization', name: article.author },
        mainEntityOfPage: url,
        image: site + '/brand-logo.png',
      } : {}),
      publisher: { '@type': 'Organization', name: siteName, url: site, logo: { '@type': 'ImageObject', url: site + '/brand-logo.png' } },
    });
    return () => {
      canonical?.remove();
      schema?.remove();
      tags.forEach((tag) => tag.remove());
      const defaults: Record<string, string> = {
        description: defaultDescription,
        'og:title': siteSeo.pages[0].title, 'og:description': defaultDescription, 'og:type': 'website',
        'og:image': site + '/brand-logo.png', 'twitter:image': site + '/brand-logo.png',
      };
      for (const [key, value] of Object.entries(defaults)) {
        const attr = key.startsWith('og:') ? 'property' : 'name';
        const tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
        if (tag) tag.content = value;
      }
      document.head.querySelectorAll('meta[property="og:url"], meta[property^="article:"], meta[name="twitter:title"], meta[name="twitter:description"], meta[name="robots"]').forEach((tag) => tag.remove());
    };
  }, [title, description, path, article, noindex]);
  return null;
}
