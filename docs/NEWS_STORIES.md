# Original Blue Angel news stories

Recovered October 17, 2026 from the saved original website bundle:
`C:\Users\jtell\dev\BACP Work\sujansky-website\blueangel_bundle.js`.

The original `CD` blog component contains both complete announcements: three paragraphs for the February 2, 2026 partnership and four for the December 4, 2025 fundraise. The newer `blueangel-website` / `bacp-website` implementations retained only titles/excerpts and replaced the inline reader with links back to the listing. Those placeholders were the cause of the broken full-story experience.

`src/content/news.json` now preserves all original paragraph wording, locations, titles and dates. The only source-character repair is replacing a corrupted dateline separator with an em dash. This is recovered historical company copy, not a newly written press release or a claim that its old forward-looking wording describes a new service today.

The Blog page uses accessible expand/collapse buttons and labelled article regions. One story opens at a time directly on `/blog`, without new tabs, popups, external navigation or a new route. Text can be selected and copied. The static build includes both complete announcements so they also remain readable without JavaScript.

The unrelated AI-assisted article and calendar remain in Google Docs/Sheets review. Their website publication remains disabled. Do not re-enable them as part of this news repair.

## Verification

All seven recovered paragraphs, both titles and both locations match the original saved bundle. Focused lint, 14 focused tests, content validation, Pages-base production build and whitespace checks pass. Desktop/mobile browser checks open, switch and close the complete stories without changing the URL or opening a tab; keyboard Enter/Space works. Five responsive widths have no horizontal overflow. Static HTML includes both complete announcements without JavaScript. The AI draft/calendar remain unpublished; no page errors. Local only, not pushed/deployed.

## October 23 full-page reader

Both original announcements now have dedicated /blog/:storyId pages, linked from each news row in the same tab. Each has an arrow and Back to Blog link that also works after a direct visit. Static builds emit both full story pages and list them in the sitemap. Unknown story IDs show Not Found. AI publication stays disabled. Rechecked every title, date, location and all seven paragraphs against the original CD blog component; all match. Earlier expand/collapse descriptions above record the prior interface.
