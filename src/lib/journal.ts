import calendarData from '@/content/journal-calendar.json';

export type JournalSource = { id: string; label: string; url: string; checkedOn: string };
export type JournalLink = { label: string; href: string };
export type JournalSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  sourceIds?: string[];
  link?: JournalLink;
};
export type JournalArticle = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  category: string;
  format: 'Feature' | 'Field note';
  status: 'draft' | 'published';
  publishedAt: string;
  modifiedAt: string;
  author: string;
  aiAssisted: boolean;
  intro: string;
  takeaways: string[];
  sections: JournalSection[];
  faqs: { question: string; answer: string }[];
  sources: JournalSource[];
  relatedLinks: JournalLink[];
};
export type CalendarEntry = {
  id: string;
  date: string;
  title: string;
  format: 'Feature' | 'Field note';
  category: string;
  primaryKeyword: string;
  brief: string;
  internalLink: string;
  sourceGuidance: string;
};

export const journalCalendar = calendarData as Omit<typeof calendarData, 'entries'> & { entries: CalendarEntry[] };
const files = import.meta.glob('@/content/journal/*.json', { eager: true, import: 'default' });
export const journalArticles = Object.values(files) as JournalArticle[];

export function getPublishedArticles(articles = journalArticles, now = new Date(), publicationEnabled = journalCalendar.websitePublicationEnabled) {
  if (!publicationEnabled) return [];
  return articles
    .filter((article) => article.status === 'published' && Date.parse(article.publishedAt) <= now.getTime())
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

export function calendarStatus(entry: CalendarEntry, articles = journalArticles, now = new Date()) {
  if (getPublishedArticles(articles, now).some((article) => article.slug === entry.id)) return 'Published locally';
  const localDate = new Intl.DateTimeFormat('en-CA', { timeZone: journalCalendar.timezone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
  return entry.date < localDate ? 'Awaiting generation' : 'Planned';
}

export function formatJournalDate(value: string, short = false) {
  // A date-only calendar entry represents a Pacific calendar day, not UTC midnight.
  const date = new Date(value.length === 10 ? value + 'T20:00:00Z' : value);
  return new Intl.DateTimeFormat('en-US', { month: short ? 'short' : 'long', day: 'numeric', year: 'numeric', timeZone: 'America/Los_Angeles' }).format(date);
}

export function readingMinutes(article: JournalArticle) {
  const text = [article.intro, ...article.sections.flatMap((s) => [...s.paragraphs, ...(s.bullets ?? [])]), ...article.faqs.map((f) => f.answer)].join(' ');
  return Math.max(1, Math.ceil(text.split(/\s+/).length / 210));
}

export function journalSiteUrl() {
  const fallback = import.meta.env.DEV
    ? window.location.origin + import.meta.env.BASE_URL
    : 'https://justintella.github.io/New-BACP-Website/';
  return (import.meta.env.VITE_SITE_URL || fallback).replace(/\/$/, '');
}
