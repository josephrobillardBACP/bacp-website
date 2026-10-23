# Home cover artwork and animation

Updated October 17, 2026.

Current local animation: every landing is anchored to a visible clinic roof, with one marker per building (four desktop / five mobile). One light moves at a constant arc-length speed of (410 / 1.65) * 1.4 SVG units per second between roofs (about 348, now 40% faster), with no per-hop easing or duration clamps. A subtle 160ms squash/rebound on contact makes the direction change read as a bounce without moving the ball away from the shared trail endpoint or inserting a dwell. Cross-links still connect the clinics (five desktop / nine mobile connections). Completed lines stay drawn until the network is linked; the far endpoint holds for one second, then dissolves over 1.2 seconds before the light redraws in reverse. Arrival rings and static markers remain. Original images and fixed source-image glow repair coordinates are unchanged. Local preview only; not pushed or deployed.

The latest October 17 refinement increases travel speed by 40% at the user's request while retaining steady movement and immediate bouncing hand-offs at roof markers. Roof-only landings, intersecting connections, drawn-only retained trails and dissolve/reverse behavior remain. Older versions below are historical experiments, not the current implementation.

## Local line-repair assets (masked patches only)

- Desktop: `src/assets/hero-network-clean-desktop-2026.webp` — 1671 × 941, 374,504 bytes.
- Mobile: `src/assets/hero-network-clean-mobile-2026.webp` — 941 × 1672, 484,952 bytes.

Both are optimized WebP copies of edits produced with the built-in image generation/editing tool, not the API/CLI fallback. The only requested content edit was removal of the painted glowing connection arcs, dots, and halos. The original watercolor assets remain unchanged at `src/assets/hero-network-2026.webp` and `src/assets/hero-network-mobile-2026.webp`.

Generated PNG originals remain in:
- `C:\Users\jtell\.codex\generated_images\01a01be3-fbcc-78a2-858f-e2000a00848f\exec-efc1b777-c783-4147-881c-e740fd5d581f.png`
- `C:\Users\jtell\.codex\generated_images\01a01be3-fbcc-78a2-858f-e2000a00848f\exec-7ca368a2-2a88-49a6-b9ae-890bd71a57c5.png`

## Why the images changed

The old watercolor images already contained connection lines. The first SVG animations followed approximate curves, which created visible doubled lines. The user explicitly accepted a line-free cover where moving dots draw the connections instead.

The clean images contain no baked-in network. They were initially tested as full replacement images; the user preferred the original painting, so that experiment was reverted. The current version composites only narrow line-removal patches from these assets over the original painting. `HeroConnections.tsx` supplies identical open-chain SVG arc geometry for the single light and each progressively drawn connection.

## Desktop edit prompt

Input: `src/assets/hero-network-2026.webp`.

> Use case: precise-object-edit. Asset type: desktop website hero. Edit the supplied landscape watercolor image. Remove ONLY ALL of the luminous blue/white connector curves, thin glowing arc lines, glowing points, and their cyan halos between the hillside medical-practice buildings. Reconstruct the tiny underlying areas naturally from the existing watercolor landscape. The result must be a clean painting with NO network lines and NO glowing dots anywhere. Invariants: preserve the original landscape composition, all clinic buildings at the same positions and sizes, all people and faces, plants, steps, gardens, shoreline, city skyline, bridge, sky, watercolor paper texture, colors, lighting, pastel palette, and every architectural detail. No additions or reframing. Keep the same wide 1672:941 aspect ratio and full framing; no cropping. This is not a redesign or new painting; it is a meticulous small removal edit so the website can draw animated connection lines separately. Do not change any text because there is none. No logos, no added text, no vignette.

## Mobile edit prompt

Input: `src/assets/hero-network-mobile-2026.webp`.

> Use case: precise-object-edit. Asset type: mobile website cover. Edit the supplied tall portrait watercolor image. Remove ONLY ALL luminous blue/white network connector curves, thin glowing arc lines, bright glowing dots, and cyan halos between the hillside medical-practice buildings. Naturally reconstruct the small underlying painted areas. The output is the same complete watercolor scene with NO network lines or glowing dots anywhere. Preserve the exact locations and sizes of ALL five medical-practice buildings, every person, garden and stair path, bridge, city skyline, sky, paper texture, pastel palette and light. The bottom-left clinic, bottom winding steps, and portrait framing must all remain. Keep the full original 941:1672 portrait aspect ratio with no crop, zoom, rotation, or composition shift. This is only a precise removal edit for an animated website, not a new scene or redesign. No additional objects, no text, no logos, no vignette. The website will add animated dots and lines later.

## Current hop-sequence verification

Latest quicker-hop pass: focused lint, Pages-base production build and diff checks pass. Full forward/reverse browser runs confirm the 40% higher constant speed (952 desktop / 1347 mobile samples), shape bounce, every roof visited, exact light/trail alignment, retained drawn lines, no future lines, dissolve and clean reverse. One dot, roof containment, five responsive widths, reduced motion and no browser errors pass; desktop/mobile screenshots reviewed. Local only, no push/deploy.

Latest steady-bounce pass: full forward/reverse browser runs verify constant arc-length speed across every connection (1336 desktop / 1900 mobile frame-speed samples), with no acceleration/deceleration; maximum error below 0.000001 SVG units/sec. The brief shape rebound is visible while the light's center remains exactly on the drawn trail. All roof nodes visited, one light, retained connections, no future lines, full dissolve and clean reverse verified. Roof containment, five widths, reduced motion and page-error checks pass; desktop/mobile screenshots reviewed. Focused lint, production build and all ten SEO/journal tests pass. Local only, no push/deploy.

### Previous roof-alignment verification

Latest roof-alignment pass: reviewed native-resolution roof-marker maps and desktop/mobile browser screenshots. Every landing lies on a traced clinic roof (four desktop / five mobile), every path endpoint exactly meets a roof marker, and no floating scenery junction remains. Browser sampling verifies all roofs visited in both directions, one light, exact head/trail agreement, retained connections, no future lines, full dissolve and clean reverse redraw. Background object-fit and SVG coordinate mapping agree within 0.1 screen pixel at five widths from 320–2560px. Lint, production build, whitespace checks, responsive/reduced-motion checks and browser-error checks pass. Not pushed/deployed.

### Previous junction experiment

Latest slower/junction pass: focused lint, Pages-base build and whitespace checks pass. Both directions sampled on desktop/mobile with all 6/8 nodes visited and 7/9 unique connections drawn. Each added junction has exactly four branches meeting at the exact marker coordinates. One light, exact dot/trail alignment, no future lines, retained prior connections, dissolve and reverse redraw verified. Five layouts (320–2560px), reduced motion and browser-error checks pass; screenshots reviewed. No push/deploy.

Focused ESLint, Pages-base production build and diff whitespace checks pass. Browser sampling covers full forward/backward cycles on both formats: every fixed point visited, identical light/trail geometry, completed links retained, future links invisible, fully linked endpoint hold, full dissolve, and a clean redraw from the opposite endpoint. Verified one light, static markers, no endpoint teleport and reduced-motion hiding (including arrival rings). Five widths (320–2560px) have no overflow/clipped copy; no browser page errors. Desktop/mobile linked-state screenshots reviewed. Local only, not pushed.

## Historical continuous-loop / two-light verification

Current October 17 checks: focused ESLint and production build pass. Browser sampling across two complete laps on both desktop and mobile confirms zero stopped frames, constant distance-based speed, exact light/path alignment, all fixed points visited, and every trail band ending behind the light. Original base images are unchanged. Isolated background screenshots show no remaining painted connectors. Five widths (320–2560px), reduced motion, and page-error checks pass. Current preview remains local/uncommitted at http://127.0.0.1:5175/.

Build and focused ESLint pass. Browser checks confirm the second dot is initially hidden, launches later, both dots move independently, all trail layers use the same route curves, and moving dots coincide with the revealed trail endpoint within 0.02 SVG units. Completed connections remain visible behind the dots. The clean desktop/mobile images are loaded at the appropriate breakpoints; no horizontal overflow or clipped hero copy at 320, 390, 768, 1440 or 2560px. Reduced-motion preferences still show a still cover. Desktop and phone screenshots were reviewed.

Local preview: http://127.0.0.1:5175/. Not pushed or deployed.
