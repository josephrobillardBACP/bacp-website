import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import BlogPage from './BlogPage';
import NewsStoryPage from './NewsStoryPage';
import { newsItems } from '@/content/blueangel';
vi.mock('@/components/Page', () => ({ default: ({ children }: { children: ReactNode }) => <main>{children}</main> }));
vi.mock('@/components/Reveal', () => ({ default: ({ children }: { children: ReactNode }) => <div>{children}</div> }));
vi.mock('@/components/PageHero', () => ({ default: () => <h1>Latest news.</h1> }));
vi.mock('@/components/JournalSeo', () => ({ default: () => null }));
vi.mock('@/components/CTASection', () => ({ default: () => null }));
afterEach(cleanup);
function view(entry = '/blog') {
  return render(<MemoryRouter initialEntries={[entry]}><Routes><Route path="/blog" element={<BlogPage />} /><Route path="/blog/:storyId" element={<NewsStoryPage />} /></Routes></MemoryRouter>);
}
describe('Original news story navigation', () => {
  it.each(newsItems)('opens $id in the same tab and returns to the listing', (story) => {
    view();
    const link = screen.getByRole('link', { name: new RegExp(story.title.replace(/[.*+?^$()|[\]\\]/g, '\\$&')) });
    expect(link).toHaveAttribute('href', '/blog/' + story.id);
    expect(link).not.toHaveAttribute('target');
    fireEvent.click(link);
    expect(screen.getByRole('heading', { level: 1, name: story.title })).toBeVisible();
    const article = screen.getByRole('article');
    story.paragraphs.forEach((paragraph) => expect(article.textContent).toContain(paragraph));
    expect(article.querySelectorAll('div > p')).toHaveLength(story.paragraphs.length);
    fireEvent.click(screen.getByRole('link', { name: 'Back to Blog' }));
    expect(screen.getByRole('heading', { name: 'Latest news.' })).toBeVisible();
  });
  it('supports a direct article URL and a deterministic back link', () => {
    view('/blog/' + newsItems[1].id);
    expect(screen.getByRole('heading', { level: 1, name: newsItems[1].title })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Back to Blog' })).toHaveAttribute('href', '/blog');
  });
  it('shows a not-found page for an unknown story', () => {
    view('/blog/unknown-story');
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Back to Blog' })).not.toBeInTheDocument();
  });
});
