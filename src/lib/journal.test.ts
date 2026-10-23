import { describe, it, expect } from 'vitest';
import { calendarStatus, getPublishedArticles, journalArticles, journalCalendar } from './journal';

const now = new Date('2026-10-17T16:00:00Z');

describe('Journal publication boundaries', () => {
  it('keeps drafts and future-dated articles out of the public journal', () => {
    const published = { ...journalArticles[0], status: 'published' as const };
    const draft = { ...published, slug: 'draft', status: 'draft' as const };
    const future = { ...published, slug: 'future', publishedAt: '2027-04-01T16:00:00Z' };
    expect(getPublishedArticles([draft, future, published], now, true).map((article) => article.slug)).toEqual([published.slug]);
  });
  it('does not turn a calendar brief into a published article just because its date passed', () => {
    const missing = { ...journalCalendar.entries[0], id: 'missing-article' };
    expect(calendarStatus(missing, [], now)).toBe('Awaiting generation');
    expect(calendarStatus(journalCalendar.entries[1], [], now)).toBe('Planned');
    expect(calendarStatus(journalCalendar.entries[0], journalArticles, now)).toBe('Awaiting generation');
  });
  it('keeps Drive review drafts off the website even if a local article is accidentally marked published', () => {
    expect(journalCalendar.websitePublicationEnabled).toBe(false);
    expect(journalArticles[0].status).toBe('draft');
    expect(getPublishedArticles()).toEqual([]);
    expect(getPublishedArticles([{ ...journalArticles[0], status: 'published' }], now)).toEqual([]);
  });
  it('plans 26 distinct weekly slots and 13 full features', () => {
    const entries = journalCalendar.entries;
    expect(entries).toHaveLength(26);
    expect(new Set(entries.map((entry) => entry.id)).size).toBe(26);
    expect(entries.filter((entry) => entry.format === 'Feature')).toHaveLength(13);
    entries.forEach((entry, index) => {
      expect(new Date(entry.date + 'T12:00:00Z').getUTCDay()).toBe(5);
      if (index) expect(Date.parse(entry.date) - Date.parse(entries[index - 1].date)).toBe(7 * 86400000);
      expect(entry.date <= journalCalendar.endsOn).toBe(true);
    });
  });
});
