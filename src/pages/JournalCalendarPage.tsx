import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, ChevronDown } from 'lucide-react';
import Page from '@/components/Page';
import JournalNav from '@/components/JournalNav';
import JournalSeo from '@/components/JournalSeo';
import { calendarStatus, formatJournalDate, journalCalendar } from '@/lib/journal';
import './Journal.css';

export default function JournalCalendarPage() {
  const [month, setMonth] = useState('all');
  const [format, setFormat] = useState('all');
  const months = [...new Set(journalCalendar.entries.map((entry) => entry.date.slice(0, 7)))];
  const entries = journalCalendar.entries.filter((entry) => (month === 'all' || entry.date.startsWith(month)) && (format === 'all' || entry.format === format));
  const published = journalCalendar.entries.filter((entry) => calendarStatus(entry) === 'Published locally').length;
  const next = journalCalendar.entries.find((entry) => calendarStatus(entry) !== 'Published locally');
  return (
    <Page title="Journal Content Calendar">
      <JournalSeo title="Journal Content Calendar" description="The local six-month editorial calendar for the Blue Angel Journal." path="/blog/content-calendar" noindex />
      <div className="journal-container">
        <JournalNav />
        <header className="calendar-header">
          <span className="journal-eyebrow">Local editorial workspace · October 2026 – April 2027</span>
          <h1>Six months of useful perspective.</h1>
          <p className="hero-text">One publication each Friday at 9:00 a.m. Pacific. A full article every two weeks, with a shorter, practical field note in the weeks between.</p>
          <div className="calendar-stats"><div><strong>26</strong><span>Weekly publications</span></div><div><strong>13 + 13</strong><span>Features + field notes</span></div><div><strong>{published} / 26</strong><span>Published locally</span></div></div>
        </header>
        <section className="calendar-workflow" aria-labelledby="workflow-title">
          <div><span className="journal-eyebrow">How each post gets made</span><h2 id="workflow-title">The calendar becomes the brief.</h2><p>The scheduled Codex run picks the due topic, researches its sources, writes an original article, checks its links and page, then adds it to this local journal.</p></div>
          <ol><li><strong>Research</strong><span>Use the brief, current BACP information, and authoritative sources.</span></li><li><strong>Write &amp; verify</strong><span>Draft the article, check factual claims and citations, and add the relevant BACP links.</span></li><li><strong>Publish locally</strong><span>Save the dated article and verify the build. Its calendar status updates from the actual article file.</span></li></ol>
          <p className="calendar-local-note">This schedule runs on this computer through Codex. Keep the computer awake and the app running. “Planned” means a brief exists; it does not mean an article has been written. Local posts reach the public website only after a separate deployment.</p>
        </section>
        {next && <p className="calendar-next"><span>Next planned publication</span><strong>{formatJournalDate(next.date)} · {next.title}</strong></p>}
        <div className="calendar-controls"><label>Month<select aria-label="Month" value={month} onChange={(event) => setMonth(event.target.value)}><option value="all">All months</option>{months.map((value) => <option value={value} key={value}>{new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(value + '-15T12:00:00'))}</option>)}</select></label><label>Publication type<select aria-label="Publication type" value={format} onChange={(event) => setFormat(event.target.value)}><option value="all">All publications</option><option value="Feature">Features</option><option value="Field note">Field notes</option></select></label><span aria-live="polite">{entries.length} planned {entries.length === 1 ? 'slot' : 'slots'}</span></div>
        <div className="calendar-list">
          {entries.map((entry) => {
            const status = calendarStatus(entry);
            return <article className="calendar-entry" key={entry.id}>
              <div className="calendar-entry__date"><time dateTime={entry.date}>{formatJournalDate(entry.date, true)}</time><span>Friday · 9:00 a.m. PT</span><span className={'calendar-status' + (status === 'Published locally' ? ' calendar-status--published' : '')}>{status === 'Published locally' && <Check size={13} aria-hidden="true" />}{status}</span></div>
              <div><div className="journal-eyebrow">{entry.format} <span> / </span> {entry.category}</div><h2>{entry.title}</h2><p>{entry.brief}</p><details><summary>Brief &amp; search focus<ChevronDown size={15} aria-hidden="true" /></summary><dl><div><dt>Search phrase</dt><dd>{entry.primaryKeyword}</dd></div><div><dt>Source direction</dt><dd>{entry.sourceGuidance}</dd></div><div><dt>Length</dt><dd>{entry.format === 'Feature' ? '900–1,200 words, with room for useful detail' : '350–550 words, focused on one actionable question'}</dd></div><div><dt>Connect to</dt><dd><Link to={entry.internalLink}>Relevant BACP resource<ArrowRight size={14} aria-hidden="true" /></Link></dd></div></dl></details>{status === 'Published locally' && <Link className="journal-inline-link" to={'/blog/' + entry.id}>Read the published article<ArrowRight size={16} aria-hidden="true" /></Link>}</div>
            </article>;
          })}
        </div>
        <div className="calendar-footer">The calendar is a local planning view and is excluded from the public build. Topics can be adjusted as new questions emerge; source checks happen when each article is written.</div>
      </div>
    </Page>
  );
}
