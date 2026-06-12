# Fourth Wall Gaming Website — Design Spec

**Date:** 2026-06-12
**Repo:** fourth-wall-gaming/fourth-wall-gaming.github.io (GitHub Pages)
**Status:** Approved by Gully Burns

## Purpose

Fourth Wall Gaming's public home: an **open-source agentic gaming publisher** building AI gamemasters, worlds, art, and stories on the Mythras and Classic Fantasy ORC SRDs.

Primary audience: **technical onlookers** — people curious about serious agentic-AI engineering. Secondary: **Mythras community players** who want to actually play. A standing goal throughout: funnel visitors toward the Mythras brand and The Design Mechanism's published games.

Visitor priority order: **Play it now → Creative originality → Tech deep-dive.**

## Brand & Visual Language

- **Logo:** black cat silhouetted against a circular stained-glass rose window (AI-generated image, supplied). Crop out the "Meta AI" watermark. Circular window crop doubles as favicon/avatar; full image used as a hero element.
- **Palette:** near-black background; jewel-tone accents sampled from the window — ruby red, cobalt blue, amber gold, emerald green. White/off-white type.
- **Tone:** clean, modern publisher ("polished dev-tools landing page"), publisher-neutral — Veilwrack art is featured as a product, not as the site chrome. Generous spacing, strong typography; artwork is allowed to be loud against the dark chrome.
- **Tagline direction:** "An open-source agentic gaming studio" — AI gamemasters, worlds, art, and stories built on the Mythras ORC SRDs.

## Site Structure (5 pages at launch)

### Home (`/`)
- Hero: cat logo, studio name, tagline.
- Three pathway cards in priority order: **Play now** → **Why this isn't slop** (Craft) → **How it works** (Tech).
- Featured products grid: `mythras-gm` plugin, Veilwrack campaign — each with description and GitHub repo link.
- Prominent "Built on Mythras — get the real game" section linking to The Design Mechanism (Mythras, Mythras Imperative, Classic Fantasy).

### Play (`/play`)
The install funnel, written for Mythras players who may not know Claude Code:
1. Install Claude Code (+ Docker, uv prerequisites)
2. Install `alhazen-core` plugin (TypeDB infrastructure): marketplace add + install + `/alhazen-core:init`
3. Install `mythras-gm` plugin: marketplace add + install
4. Clone and import the Veilwrack campaign; say "run my Veilwrack campaign"
Content adapted and polished from the mythras-gm README.

### Craft (`/craft`)
Two major sections:
1. **The creative-originality essay** — adapted from `veilwrack-campaign/docs/creative-originality.md`: antecedents named honestly (Nausicaä, Annihilation, Miéville, Le Guin), the six original ideas, the human–AI collaboration provenance. The "this isn't LLM slop" argument.
2. **Worldbuilding at scale** — how the agentic workflow generated the Veilwrack corpus (46 lore entries, 10+ characters, 7 factions, a bestiary, a 5-act arc); lore as a queryable knowledge graph rather than a wiki; new canon captured mid-play. Thesis: volume *with* coherence and originality, not volume instead of it.

### Tech (`/tech`)
Architecture deep-dive:
- TypeDB knowledge graph as the persistent save file
- Deterministic d100 rules engine (auditable JSON rolls, no invented results)
- Lore/visibility model (player vs GM secrets)
- Lossless campaign export/import (campaign repos as a publishing format)
- Claude Code plugin architecture (alhazen-core dependency, SessionStart schema hooks)

### Gallery (`/gallery`)
AI-generated art, with room to grow into movies and comic books.
- Astro content collection: each piece = image (or video/comic asset) + frontmatter (title, project, medium, tools used, date).
- Filterable by project (Veilwrack, brand art, …) via vanilla JS.
- Launches with images only; video embeds and a comic-reader treatment are structured into the schema (a `medium` field) but not built until there's content.

### Footer (every page)
ORC license notice + Design Mechanism attribution (as required), GitHub org link, MIT licensing statement.

## Tech Stack & Architecture

- **Astro 5**, fully static output. No client-side framework (no React/Vue); a sprinkle of vanilla JS for gallery filtering.
- **Content:**
  - `src/content/gallery/` — gallery content collection (frontmatter-driven)
  - Play/Craft/Tech authored as MDX (prose with embedded media)
- **Images:** Astro `<Image>` for responsive, optimized output (critical for phone-friendly galleries). Gallery assets stored in-repo for now; move to a CDN only if size demands it.
- **Styling:** plain CSS with custom properties for the jewel-tone palette. No Tailwind.
- **Deploy:** GitHub Actions (`withastro/action`) → GitHub Pages on push to main. Pages source switched from "deploy from branch" to "GitHub Actions".

## Testing & Verification

- `astro build` must pass in CI before deploy.
- Manual check of the live Pages URL after first deploy (all 5 pages, mobile viewport).
- Performance by construction: dark static site, optimized images, minimal JS.

## Out of Scope (launch)

- Blog/devlog (Astro makes this easy to add later)
- Video and comic content (schema supports it; content comes later)
- Interactive demos (e.g., embedded dice roller)
- Custom domain
