# LUXKEY B2B AI website

The official homepage now sells six understandable AI services: cloud social editor, automated video editor, operations, sales/support, new business models, and agency partnerships. CIS.md and app/icon.svg are unchanged.

## Editing

- Homepage: `app/home-client.tsx`; metadata and organization schema: `app/page.tsx`.
- Responsive visual system: `app/portfolio.css`; design notes: `design-system/vito-portfolio/pages/home.md`.
- Service plans, contact brief and capacity calculation: `lib/marketing.ts`.
- Contact details use the existing LINE URL and email. The site has no form endpoint and sends nothing automatically. Copy the brief to LINE or open a populated email draft.
- The three workflow views use clearly labeled preset scenarios, not live AI. Existing operations demo routes remain available with an explicit simulated-data notice and homepage return link.

## Media

User-provided MC-001.mp4, MC-002.mp4, LAB-IP-001.mp4 and lesson-05-16x9.mp4 are included as H.264/AAC files in `public/showcase/`. Full duration, audio and burned-in Chinese subtitles are preserved. Portraits are 720×1280; the course is 1280×720. Videos total 8,271,979 bytes and are only attached to a player after a visitor clicks. Still posters are extracted from the supplied videos. Unreferenced previous portfolio images were removed.

## Claims and privacy

No invented client testimonials, fixed prices, delivery guarantees or measured business results. The calculator uses a four-week month and visitor-selected assumptions; results are recoverable labor capacity value, not guaranteed cash savings or net ROI. Privacy explanation is at `/privacy/`.

## Validation

- `npm test`: 30 tests, including capacity bounds and matching all six brief types.
- `npm run build`: static export succeeds; existing 300 routes remain buildable.
- `git diff --check`: clean.
- Homepage audit: all 44 local resources/links/anchors resolve.
- Browser review: 320, 375, 768, 1024, 1440 widths and 812×375 landscape; no page horizontal overflow.
- Verified three workflow selections, all four video loads, active video playback, Escape/close, mobile menu, FAQ, service preselection, calculator → brief transfer, clipboard feedback, encoded email body, and demo/privacy navigation. No browser error logs in the checked flows.

A PR validation workflow runs tests and build. Production continues to use the existing deployment workflow on `claude/system-design-confirmation-342l3q`.
