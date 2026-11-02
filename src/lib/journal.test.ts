import { describe, it, expect } from 'vitest';
import { calendarStatus, getPublishedArticles, journalArticles, journalCalendar } from './journal';

const now = new Date('2026-10-17T16:00:00Z');

describe('Journal publication boundaries', () => {
  it('keeps drafts and future-dated articles out of the public journal', () => {
    const published = { ...journalArticles[0], publishedAt: '2026-10-16T16:00:00Z', status: 'published' as const };
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
  it('publishes only the explicitly approved article while automatic publication remains paused', () => {
    const approved = journalArticles[0];
    const publicationDate = new Date('2026-11-02T20:00:00Z');
    const unapproved = { ...approved, slug: 'unapproved', status: 'published' as const };
    const draft = { ...approved, slug: 'draft', status: 'draft' as const };
    const future = { ...approved, publishedAt: '2027-04-01T16:00:00Z' };
    expect(journalCalendar.websitePublicationEnabled).toBe(false);
    expect(approved.status).toBe('published');
    expect(journalCalendar.manuallyPublishedSlugs).toEqual([approved.slug]);
    expect(getPublishedArticles([approved, unapproved, draft], publicationDate).map((article) => article.slug)).toEqual([approved.slug]);
    expect(getPublishedArticles([future], publicationDate)).toEqual([]);
    expect(getPublishedArticles([approved], publicationDate, false, [])).toEqual([]);
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
