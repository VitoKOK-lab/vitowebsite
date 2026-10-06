# LUXKEY B2B AI website

The official homepage now sells six understandable AI services: cloud social editor, automated video editor, operations, sales/support, new business models, and agency partnerships. CIS.md and app/icon.svg are unchanged.

Positioning: “每月一位行銷小編的預算，請一整隊 AI 商業顧問。” The homepage, service mix, monthly goals/delivery/review process, FAQ, brief, and share metadata use this monthly partnership model. No salary, fixed fee, unlimited quota or contract duration is invented.

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

## Cinematic hero and project software update

- Two original AI-generated concept images, responsive WebP (roughly 150 KB per desktop image); lead image loads eagerly, second image lazily. Prompts and provenance: `public/heroes/asset-notes.txt`.
- Proactive AI team positioning retains monthly budget premise. Annual backlog is framed as an action plan, not a measured productivity claim.
- Project software section explains scoped NT$150,000 starting proposal versus a hypothetical NT$2m full-system budget; 10x is an improvement target, not a guarantee. Export and retirement are explicit.
- Dedicated software selection and contact brief separate project pricing from monthly collaboration.
- Verified production static export, all 30 tests, desktop hero and software images, mobile hero and software images, 320/375/768/1440 layout checks, software CTA selection and email brief, no browser errors.

## Approachable blue visual direction

User reference `11_45_15.png` supersedes the previous campaign palette: mist blue, ivory, blue-grey and charcoal. LUXKEY wordmark geometry and vermillion dot remain unchanged. Campaign accents use dark blue for readable text and light blue with dark text for primary actions.

Replaced both architectural hero scenes with generated, relatable business scenarios: reviewing marketing content and editing product video; checking guests in at an event with a tablet. Chinese labels explain the tasks and generated-scene captions avoid implying real staff or client photography. Prompts are saved in `public/heroes/blue-asset-notes.txt`. Social preview colors match.

Validation: full production build passed; desktop and mobile visual review, responsive overflow checks, image loading and CTA review.
