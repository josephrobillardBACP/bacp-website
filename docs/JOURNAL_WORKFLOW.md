# Blue Angel Journal: Google Drive editorial review

## Article presentation preference — November 2, 2026

Do not display an author byline such as “By Blue Angel Journal” on website articles, including future articles. Keep the publication date and reading time. The shared article template includes a sticky desktop section outline that highlights the current section as the reader scrolls; its links match the article headings and remain usable without JavaScript. Preserve regular-weight inline source/article hyperlinks and the standing no-footer preference below.

## Explicit October 27 article release

The user authorized live publication of the reviewed October 27 article. Only what-is-concierge-medicine is marked published and included in manuallyPublishedSlugs. Runtime and static builds publish that explicit exception while websitePublicationEnabled remains false, so scheduled generation/publication stays paused. Do not publish any other calendar entry without a new explicit instruction. The earlier development-only preview note below is superseded for this article.


## Current editorial preference and local demo — November 1, 2026

These instructions supersede conflicting older workflow text below.

- Working article Docs: https://drive.google.com/drive/folders/1On7LdFBfi4Yd0gmAiwCbLAQlcbxjLLkq
- Current first article: https://docs.google.com/document/d/1DTbuWakzGFDq7JSdYZb0U0gJjY--M05zFYxs0NJH25s/edit?usp=drivesdk
- The Google Sheet now uses Content Calendar and Operating Manual. Read the current manual and linked Docs before writing; older Friday schedules in this file are historical.
- Standing user preference: do not append a Sources/bibliography section, checked-on list, AI-assistance disclosure, research-history note or generic medical/legal disclaimer to reader-facing newsletters or website articles. Keep factual checks, source URLs and unresolved questions in internal editorial notes and the calendar. Preserve useful contextual caveats and ordinary in-text/related links.
- The four drafted Newsletter Docs have been cleaned. Removed source records and freshness checks are retained in each calendar row’s Editorial notes cell note.
- October 27 is shown locally at /blog/what-is-concierge-medicine, linked from /blog. It is guarded by import.meta.env.DEV. Production routing and automatic generated publication remain disabled; no push or deployment is authorized by this demo.
- Current calendar cadence is Newsletter → Newsletter → Monthly, with separate semi-annual planning. Use the live Sheet rather than the old local calendar archive.

Updated October 17, 2026. These instructions supersede the previous local auto-publication workflow.

## Current working files

Justin requested the content calendar and first article in the existing Google files linked in "Justin / Joseph Check Ins", and removed from the website.

- Folder: https://drive.google.com/drive/u/0/folders/19KwTaZXs1bmeaWm_OEbMMDPH4sFRdXt1
- Calendar Sheet: https://docs.google.com/spreadsheets/d/1-OPgaEdp5yuf94KKrxwdzMsBUzv-qFfOZggnZR4M6tg/edit?usp=drivesdk
- First-article Doc: https://docs.google.com/document/d/10F3lQsG9hSY8ZuMU30xKPNnWXzpIZTXr2rLXGBct5hg
- First article is In review in Drive / Not published on the website.
- Original Blog/news remains at /blog. Generated article and /blog/content-calendar routes are removed.
- Local JSON is preserved as a recoverable draft/archive. Drive is the editorial working copy; do not overwrite human edits from old JSON.

## Publication safeguard

src/content/journal-calendar.json has websitePublicationEnabled=false.
npm run journal:due must report publicationPaused=true and due=[].
Runtime and static build also refuse generated publication while disabled.

The existing heartbeat publish-the-weekly-blue-angel-journal-locally was NOT changed, deleted or duplicated. On any scheduled run, read this file and AGENT_HANDOFF.md, run journal:due, and STOP with no generation/edit/publication if publicationPaused is true. A calendar date is not permission to restore content or change the safeguard.

No automatic Google Docs generation schedule was created. Do not promise drafts on their planned dates. A Drive-writing schedule requires a new request.

## Plan and review process

The Sheet retains all 26 original Friday slots, October 16, 2026–April 9, 2027: thirteen fortnightly features with thirteen shorter field notes between. Stop after April 15, 2027. Dates are planning targets in America/Los_Angeles, with Friday 9:00 a.m. Pacific as the intended publication time.

Content Calendar has planned publication, Wednesday draft target, Thursday review target, format, topic, category, SEO topic, brief, source guidance, supporting page, review status, article Doc, publication status, notes and slug. Workflow explains editing and the approval gate.

Status options: Planned, Drafting, In review, Approved, On hold. First row is In review / Not published and links to the existing Doc. Its original October 16 slot needs review/replanning, not backdating.

When explicitly asked to prepare or edit content:

1. Inspect the existing Google file and preserve other contributors' work/sharing.
2. Research current primary sources for factual claims. Never invent patient stories, quotes, clinician review, terms, prices, outcomes, guarantees or statistics.
3. Write useful original prose for independent concierge physicians, succession-minded owners and physicians exploring a practice. Disclose AI assistance accurately.
4. Link the Doc from the Sheet; set In review. Justin/Joseph edit and approve in Drive.
5. Approved is NOT a publication trigger. A new explicit request is needed to put approved copy on the website.
6. Website publication requires factual checks, restoring the appropriate routes, tests, build and desktop/mobile QA. Public deployment separately requires authorization.

## Local checks and boundaries

- Calendar archive/config: src/content/journal-calendar.json.
- Recoverable first article: src/content/journal/what-is-concierge-medicine.json, status=draft.
- npm run journal:check validates archived content.
- npm run journal:due stays safely idle while publication is disabled.
- npm run build -- --base=/New-BACP-Website/ emits no generated article HTML or article sitemap entry.
- Preserve all unrelated SEO and homepage animation work.
- No commit, push, deployment, email, real form submission, paid service or automatic publication is authorized by this transfer.
