import { readFile, readdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const root = process.cwd();
const calendar = JSON.parse(await readFile(resolve(root, 'src/content/journal-calendar.json'), 'utf8'));
const now = new Date();
const localDay = new Intl.DateTimeFormat('en-CA', { timeZone: calendar.timezone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
const localTime = new Intl.DateTimeFormat('en-GB', { timeZone: calendar.timezone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(now);
const directory = resolve(root, 'src/content/journal');
const articles = await Promise.all((await readdir(directory)).filter((file) => file.endsWith('.json')).map(async (file) => JSON.parse(await readFile(join(directory, file), 'utf8'))));
const published = new Set(articles.filter((article) => article.status === 'published' && Date.parse(article.publishedAt) <= now.getTime()).map((article) => article.slug));
const publicationPaused = calendar.websitePublicationEnabled !== true;
const due = !publicationPaused && localDay <= calendar.endsOn ? calendar.entries.filter((entry) => !published.has(entry.id) && (entry.date < localDay || (entry.date === localDay && localTime >= calendar.publishTime))) : [];
console.log(JSON.stringify({ checkedAt: now.toISOString(), timezone: calendar.timezone, localDay, localTime, publicationPaused, reason: publicationPaused ? 'Editorial review is in Google Drive. Do not generate or publish website posts without a new explicit request.' : undefined, editorialCalendarUrl: calendar.editorialCalendarUrl, finished: localDay > calendar.endsOn || published.size >= calendar.entries.length, published: published.size, total: calendar.entries.length, due }, null, 2));
