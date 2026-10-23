import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import SiteSeo from './SiteSeo';
import { siteSeo } from '@/lib/siteSeo';

vi.mock('@/lib/journal', () => ({ journalSiteUrl: () => 'https://blueangelclinical.com' }));

beforeEach(() => {
  document.head.innerHTML = '<title>Original</title><meta name="description" content="Original description">';
});
afterEach(cleanup);

describe('route metadata lifecycle', () => {
  it('updates search and social tags on navigation without duplicate canonicals', () => {
    const view = render(<SiteSeo page={siteSeo.pages[0]} />);
    expect(document.title).toBe(siteSeo.pages[0].title);
    expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(document.getElementById('site-schema')).not.toBeNull();
    view.rerender(<SiteSeo page={siteSeo.pages[2]} />);
    expect(document.title).toBe(siteSeo.pages[2].title);
    expect(document.head.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(siteSeo.pages[2].description);
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe('https://blueangelclinical.com/services/');
    expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(document.getElementById('site-schema')).toBeNull();
  });

  it('restores existing tags and removes owned tags when a journal page takes over', () => {
    const view = render(<SiteSeo page={siteSeo.pages[0]} />);
    view.unmount();
    expect(document.head.querySelector('meta[name="description"]')?.getAttribute('content')).toBe('Original description');
    expect(document.head.querySelector('link[rel="canonical"]')).toBeNull();
    expect(document.getElementById('site-schema')).toBeNull();
    expect(document.head.querySelector('meta[property="og:url"]')).toBeNull();
  });
});
