# Fourth Wall Gaming Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy the Fourth Wall Gaming public website — an open-source agentic gaming publisher site — to GitHub Pages.

**Architecture:** Astro 5 fully-static site in the existing `fourth-wall-gaming/fourth-wall-gaming.github.io` repo. Prose pages (Play/Craft/Tech) are MDX; the Gallery is an Astro content collection with frontmatter-driven entries; styling is plain CSS custom properties (dark, jewel-tone palette); deploy is GitHub Actions (`withastro/action`) to Pages.

**Tech Stack:** Astro 5, @astrojs/mdx, vanilla JS (gallery filter only), GitHub Actions, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-06-12-fourth-wall-gaming-website-design.md` (same repo). Read it before starting.

**Working directory for ALL tasks:** `/Users/gullyburns/fourth-wall-gaming.github.io`

**Key source materials (read-only inputs, outside this repo):**
- Logo image (1280×1280 JPEG, has a "Meta AI" watermark bottom-right that must be cropped off): `/Users/gullyburns/.claude/uploads/d6c47742-77b2-46a4-ae42-d6617aa08b3d/342f6bc6-504287597_646810348519799_4119830880348843186_n.jpg`
- Creative-originality essay: `/Users/gullyburns/veilwrack-campaign/docs/creative-originality.md`
- Install instructions + tech detail: `/Users/gullyburns/mythras-gm/README.md` and `/Users/gullyburns/mythras-gm/skills/mythras-gm/USAGE.md`

**Verification used in every task:** `npm run build` must exit 0. There is no unit-test suite for a static content site; the build IS the test (Astro type-checks frontmatter schemas, resolves imports, and validates images at build time).

---

### Task 1: Scaffold Astro project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro`, `.gitignore`
- Delete: `_config.yml` (Jekyll leftover — we are replacing Jekyll entirely)

- [ ] **Step 1: Scaffold a minimal Astro project in a temp dir and copy it in**

The repo is non-empty (README, LICENSE, docs/), so scaffold in a temp dir:

```bash
cd /tmp && rm -rf fwg-scaffold && npm create astro@latest fwg-scaffold -- --template minimal --no-install --no-git --yes
cp -R /tmp/fwg-scaffold/. /Users/gullyburns/fourth-wall-gaming.github.io/
cd /Users/gullyburns/fourth-wall-gaming.github.io && rm -f _config.yml
```

- [ ] **Step 2: Install deps + MDX integration**

```bash
cd /Users/gullyburns/fourth-wall-gaming.github.io
npm install
npx astro add mdx --yes
```

- [ ] **Step 3: Configure site URL in `astro.config.mjs`**

Replace the file contents with:

```js
// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://fourth-wall-gaming.github.io',
  integrations: [mdx()],
});
```

- [ ] **Step 4: Verify build passes**

Run: `npm run build`
Expected: exits 0, `dist/index.html` exists.

- [ ] **Step 5: Ensure `.gitignore` covers artifacts**

`.gitignore` must contain at least:

```
node_modules/
dist/
.astro/
```

- [ ] **Step 6: Commit**

```bash
git add -A && git status   # review: no node_modules/dist staged
git commit -m "feat: scaffold Astro 5 site with MDX, remove Jekyll config"
```

---

### Task 2: Brand assets + global CSS

**Files:**
- Create: `src/assets/logo-full.jpg` (watermark-free crop), `public/favicon.png`
- Create: `src/styles/global.css`
- Delete: default `public/favicon.svg` if scaffold created one

- [ ] **Step 1: Copy and crop the logo**

Source is 1280×1280; the "Meta AI" watermark sits in roughly the bottom 90 px. Crop to the top 1280×1180, then trim width to keep it visually centered (cat is centered, so a symmetric width trim to 1180 keeps composition):

```bash
mkdir -p src/assets
cp "/Users/gullyburns/.claude/uploads/d6c47742-77b2-46a4-ae42-d6617aa08b3d/342f6bc6-504287597_646810348519799_4119830880348843186_n.jpg" src/assets/logo-full.jpg
sips --cropOffset 0 50 -c 1180 1180 src/assets/logo-full.jpg
```

- [ ] **Step 2: Visually verify the crop**

Use the Read tool on `src/assets/logo-full.jpg`. Confirm: no "Meta AI" text visible anywhere; cat + window composition intact. If the watermark survives, increase the height crop (e.g. `-c 1150 1150` from offset 0) and re-check.

- [ ] **Step 3: Generate favicon**

```bash
cp src/assets/logo-full.jpg /tmp/favicon-src.jpg
sips -z 256 256 /tmp/favicon-src.jpg --setProperty format png --out public/favicon.png
rm -f public/favicon.svg
```

- [ ] **Step 4: Write `src/styles/global.css`**

```css
:root {
  --bg: #0b0a10;
  --bg-raised: #15131d;
  --text: #f2efe9;
  --text-dim: #b8b2a7;
  --ruby: #d62839;
  --cobalt: #2f6fd1;
  --amber: #ffb627;
  --emerald: #1f9e6e;
  --max-width: 72rem;
  --prose-width: 44rem;
}

* { box-sizing: border-box; }

html {
  background: var(--bg);
  color: var(--text);
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  line-height: 1.6;
  scroll-behavior: smooth;
}

body { margin: 0; }

h1, h2, h3 {
  font-family: Georgia, 'Times New Roman', serif;
  line-height: 1.2;
  letter-spacing: -0.01em;
}

h1 { font-size: clamp(2rem, 6vw, 3.25rem); }
h2 { font-size: clamp(1.5rem, 4vw, 2.25rem); margin-top: 2.5rem; }

a { color: var(--amber); text-decoration-thickness: 1px; text-underline-offset: 3px; }
a:hover { color: var(--text); }

img { max-width: 100%; height: auto; display: block; }

code, pre {
  font-family: ui-monospace, "SF Mono", Menlo, monospace;
  font-size: 0.925em;
}

pre {
  background: var(--bg-raised);
  border: 1px solid #2a2735;
  border-radius: 8px;
  padding: 1rem;
  overflow-x: auto;
}

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 1.25rem;
}

.prose {
  max-width: var(--prose-width);
  margin: 0 auto;
  padding: 2rem 1.25rem 4rem;
}

.prose p, .prose li { color: var(--text-dim); }
.prose strong { color: var(--text); }

.btn {
  display: inline-block;
  padding: 0.7rem 1.4rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
}

.btn-primary { background: var(--ruby); color: var(--text); }
.btn-primary:hover { background: #e8364a; color: var(--text); }
.btn-ghost { border: 1px solid #3a3648; color: var(--text); }
.btn-ghost:hover { border-color: var(--amber); color: var(--amber); }

.card {
  background: var(--bg-raised);
  border: 1px solid #2a2735;
  border-radius: 12px;
  padding: 1.5rem;
}

.card h3 { margin-top: 0; }

.grid-3 {
  display: grid;
  gap: 1.25rem;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
}

.accent-ruby { border-top: 3px solid var(--ruby); }
.accent-cobalt { border-top: 3px solid var(--cobalt); }
.accent-amber { border-top: 3px solid var(--amber); }
.accent-emerald { border-top: 3px solid var(--emerald); }
```

- [ ] **Step 5: Verify build still passes**

Run: `npm run build` — expected: exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/assets src/styles public/favicon.png
git rm -f public/favicon.svg 2>/dev/null; git add -A public
git commit -m "feat: brand assets (cropped logo, favicon) and jewel-tone global CSS"
```

---

### Task 3: Base layout (header, nav, footer)

**Files:**
- Create: `src/layouts/Base.astro`

- [ ] **Step 1: Write `src/layouts/Base.astro`**

```astro
---
import '../styles/global.css';
const { title = 'Fourth Wall Gaming', description = 'An open-source agentic gaming studio — AI gamemasters, worlds, art, and stories built on the Mythras ORC SRDs.' } = Astro.props;
const nav = [
  { href: '/play/', label: 'Play' },
  { href: '/craft/', label: 'Craft' },
  { href: '/tech/', label: 'Tech' },
  { href: '/gallery/', label: 'Gallery' },
];
const current = Astro.url.pathname;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="icon" type="image/png" href="/favicon.png" />
  </head>
  <body>
    <header>
      <div class="container header-inner">
        <a href="/" class="wordmark">Fourth Wall Gaming</a>
        <nav>
          {nav.map((item) => (
            <a href={item.href} class={current.startsWith(item.href) ? 'active' : ''}>{item.label}</a>
          ))}
        </nav>
      </div>
    </header>
    <main>
      <slot />
    </main>
    <footer>
      <div class="container">
        <p>
          This work is based on <em>Mythras Imperative</em>, written by Pete Nash and Lawrence
          Whitaker, and published by <a href="https://thedesignmechanism.com">The Design Mechanism</a>,
          Copyright 2023, used under the ORC License. <em>Mythras</em> and <em>Mythras Imperative</em>
          are Reserved Material of The Design Mechanism.
        </p>
        <p>
          Code and original content: MIT License ·
          <a href="https://github.com/fourth-wall-gaming">GitHub</a>
        </p>
      </div>
    </footer>
    <style>
      header {
        border-bottom: 1px solid #2a2735;
        position: sticky;
        top: 0;
        background: color-mix(in srgb, var(--bg) 88%, transparent);
        backdrop-filter: blur(8px);
        z-index: 10;
      }
      .header-inner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding-top: 0.8rem;
        padding-bottom: 0.8rem;
        flex-wrap: wrap;
      }
      .wordmark {
        font-family: Georgia, serif;
        font-weight: 700;
        font-size: 1.15rem;
        color: var(--text);
        text-decoration: none;
      }
      nav { display: flex; gap: 1.1rem; }
      nav a { color: var(--text-dim); text-decoration: none; font-size: 0.95rem; }
      nav a:hover, nav a.active { color: var(--amber); }
      footer {
        border-top: 1px solid #2a2735;
        margin-top: 4rem;
        padding: 2rem 0 3rem;
        font-size: 0.85rem;
        color: var(--text-dim);
      }
    </style>
  </body>
</html>
```

- [ ] **Step 2: Point `src/pages/index.astro` at the layout (temporary content)**

```astro
---
import Base from '../layouts/Base.astro';
---
<Base>
  <div class="container"><h1>Fourth Wall Gaming</h1></div>
</Base>
```

- [ ] **Step 3: Verify build**

Run: `npm run build` — expected: exit 0; `grep -c "Fourth Wall Gaming" dist/index.html` ≥ 2 (wordmark + h1).

- [ ] **Step 4: Commit**

```bash
git add src/layouts src/pages/index.astro
git commit -m "feat: base layout with nav and ORC-attribution footer"
```

---

### Task 4: Home page

**Files:**
- Modify: `src/pages/index.astro` (full rewrite)

- [ ] **Step 1: Write the home page**

```astro
---
import Base from '../layouts/Base.astro';
import { Image } from 'astro:assets';
import logo from '../assets/logo-full.jpg';
---
<Base>
  <section class="hero container">
    <Image src={logo} alt="A black cat silhouetted against a stained-glass rose window — the Fourth Wall Gaming mark" width={420} class="hero-logo" loading="eager" />
    <h1>Fourth Wall Gaming</h1>
    <p class="tagline">
      An open-source <strong>agentic gaming studio</strong> — AI gamemasters, worlds, art,
      and stories built on the Mythras ORC SRDs.
    </p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="/play/">Play now</a>
      <a class="btn btn-ghost" href="/tech/">How it works</a>
    </div>
  </section>

  <section class="container">
    <div class="grid-3">
      <div class="card accent-ruby">
        <h3>Play it now</h3>
        <p>Install the Mythras GM plugin for Claude Code and sit down at a table where the
        gamemaster never forgets a wound, a debt, or a name. Persistent campaigns in a
        knowledge graph; honest dice you can audit.</p>
        <a href="/play/">Get playing →</a>
      </div>
      <div class="card accent-amber">
        <h3>Not slop</h3>
        <p>AI-assisted doesn't mean derivative. Read how the Veilwrack was made: its
        antecedents named honestly, its original ideas defended, and what worldbuilding
        at machine scale actually looks like.</p>
        <a href="/craft/">The craft →</a>
      </div>
      <div class="card accent-cobalt">
        <h3>Under the hood</h3>
        <p>A deterministic d100 rules engine, a TypeDB knowledge graph as the save file,
        and campaigns published as Git repos. Serious engineering for serious play.</p>
        <a href="/tech/">The tech →</a>
      </div>
    </div>
  </section>

  <section class="container">
    <h2>Projects</h2>
    <div class="grid-3">
      <div class="card">
        <h3>mythras-gm</h3>
        <p>A Claude-powered Gamesmaster for Mythras Imperative. Rules engine, combat
        resolution, character generation, campaign publishing — all persisted in TypeDB.</p>
        <a href="https://github.com/fourth-wall-gaming/mythras-gm">github.com/fourth-wall-gaming/mythras-gm →</a>
      </div>
      <div class="card">
        <h3>The Veilwrack: The Stilling</h3>
        <p>An original sky realm. No ground — winged peoples on the calcified husks of dead
        sky-leviathans, and the wind itself is dying. 46 lore entries, 7 factions, a
        five-act arc.</p>
        <a href="https://github.com/fourth-wall-gaming/veilwrack-campaign">github.com/fourth-wall-gaming/veilwrack-campaign →</a>
      </div>
      <div class="card">
        <h3>Gallery</h3>
        <p>Art, and eventually film and comics, generated alongside the worlds — every
        piece traceable to the campaign canon it illustrates.</p>
        <a href="/gallery/">Browse the gallery →</a>
      </div>
    </div>
  </section>

  <section class="container mythras-plug">
    <div class="card accent-emerald">
      <h2 style="margin-top:0">Built on Mythras — get the real game</h2>
      <p>Everything here runs on the <em>Mythras Imperative</em> SRD under the ORC License.
      Mythras is one of the finest d100 systems ever written: fast, deadly, deeply
      simulationist. If you enjoy playing it with an AI gamemaster, buy the books and
      play it with your friends.</p>
      <p>
        <a href="https://thedesignmechanism.com">The Design Mechanism</a> publishes
        <em>Mythras</em>, <em>Mythras Imperative</em>, and <em>Classic Fantasy</em>.
      </p>
    </div>
  </section>

  <style>
    .hero { text-align: center; padding: 3rem 1.25rem 2rem; }
    .hero-logo { margin: 0 auto 1.5rem; border-radius: 16px; }
    .tagline { font-size: 1.2rem; color: var(--text-dim); max-width: 38rem; margin: 0 auto 1.75rem; }
    .hero-actions { display: flex; gap: 0.9rem; justify-content: center; flex-wrap: wrap; }
    section.container { margin-bottom: 2.5rem; }
    .mythras-plug { margin-top: 1rem; }
  </style>
</Base>
```

- [ ] **Step 2: Verify build**

Run: `npm run build` — expected: exit 0; optimized image emitted under `dist/_astro/`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: home page with hero, pathway cards, projects, Mythras plug"
```

---

### Task 5: Play page

**Files:**
- Create: `src/layouts/Prose.astro` (thin wrapper for MDX pages)
- Create: `src/pages/play.mdx`

- [ ] **Step 1: Write `src/layouts/Prose.astro`**

```astro
---
import Base from './Base.astro';
const { frontmatter } = Astro.props;
---
<Base title={`${frontmatter.title} · Fourth Wall Gaming`} description={frontmatter.description}>
  <article class="prose">
    <h1>{frontmatter.title}</h1>
    <slot />
  </article>
</Base>
```

- [ ] **Step 2: Write `src/pages/play.mdx`**

Adapt the install funnel from `/Users/gullyburns/mythras-gm/README.md` ("Install as Claude Code Plugin" section). Audience: Mythras players who may never have used Claude Code. Required structure and content:

```mdx
---
layout: ../layouts/Prose.astro
title: Play
description: Sit down at the table in about ten minutes — install the Mythras GM plugin for Claude Code and start a persistent campaign.
---

You talk; the AI gamemaster narrates, plays the NPCs, and rolls honest dice.
Every character, wound, faction, and journal entry persists in a knowledge
graph, so you can walk away mid-scene and pick up weeks later with zero
context loss.

## What you need

- [Claude Code](https://claude.ai/code) — Anthropic's AI coding agent (free tier works); the GM runs inside it
- [Docker](https://www.docker.com/products/docker-desktop/) — runs the TypeDB database that stores your campaign
- [uv](https://docs.astral.sh/uv/) — a Python package manager (one-line install)

No Python or database knowledge required — the plugins handle everything.

## Step 1 — Install the infrastructure plugin

Inside Claude Code, run:

​```
/plugin marketplace add sciknow-io/alhazen-skill-examples
/plugin install alhazen-core@alhazen-skills
/alhazen-core:init
​```

This starts TypeDB in Docker and loads the base schema.

## Step 2 — Install the Mythras GM

​```
/plugin marketplace add fourth-wall-gaming/mythras-gm
/plugin install mythras-gm
​```

## Step 3 — Load a campaign (or build your own)

Clone the flagship campaign:

​```
git clone https://github.com/fourth-wall-gaming/veilwrack-campaign
​```

Then tell Claude: **"Import the Veilwrack campaign from ~/veilwrack-campaign"** —
and once it's in: **"Run my Veilwrack campaign."**

Or start from nothing: say **"Create a new Mythras campaign"** and the GM
walks you through worldbuilding and character creation.

## What play feels like

The GM narrates scenes and plays NPCs in natural language. When the dice
matter, it calls a deterministic rules engine — d100 checks, opposed rolls,
full Mythras combat with special effects and hit locations — and shows you
the JSON, so every roll is auditable. Nothing is fudged.

When you stop, everything is saved. Next session, the GM reads the campaign
state back from the knowledge graph and recaps where you left off.

## Love the system? Buy the books

This runs on the *Mythras Imperative* SRD under the ORC License.
[The Design Mechanism](https://thedesignmechanism.com) publishes the full
*Mythras* line — get the real thing and play it at a real table too.
```

(The `​``` ` fences above are literal triple-backtick code fences in the MDX file.)

- [ ] **Step 3: Verify build**

Run: `npm run build` — expected: exit 0; `dist/play/index.html` exists.

- [ ] **Step 4: Commit**

```bash
git add src/layouts/Prose.astro src/pages/play.mdx
git commit -m "feat: play page — install funnel for Mythras players new to Claude Code"
```

---

### Task 6: Craft page

**Files:**
- Create: `src/pages/craft.mdx`

- [ ] **Step 1: Read the source essay**

Read `/Users/gullyburns/veilwrack-campaign/docs/creative-originality.md` in full. The Craft page adapts it — do not invent new claims about the setting; reuse the essay's actual arguments and examples.

- [ ] **Step 2: Write `src/pages/craft.mdx`**

Frontmatter:

```mdx
---
layout: ../layouts/Prose.astro
title: Craft
description: Why AI-assisted worldbuilding isn't slop — the Veilwrack's antecedents named honestly, its original ideas defended, and what worldbuilding at machine scale looks like.
---
```

Required structure (adapt prose from the essay; keep its honest, non-defensive tone):

1. **Opening** — state the accusation plainly ("generated by an LLM, therefore slop or theft") and that the answer is specifics, not indignation.
2. **§ Naming the antecedents** — the essay's honest-influences section: Nausicaä, *Annihilation*, Miéville, Le Guin, etc. Frame: every human author has antecedents too; originality is recombination plus a new organizing idea.
3. **§ What's actually original here** — the essay's six original ideas (debt-as-ecology / actuarial apocalypse, three epistemological kindreds, sound-as-horror, institutional complicity without villainy, the Hushed as a moral problem, the puzzle-box structure). One short paragraph each.
4. **§ Worldbuilding at scale** — NEW section (not in the essay; user-requested). Content:
   - The numbers: the Veilwrack corpus is 46 lore entries, 10+ characters, 7 factions, a bestiary, and a five-act campaign arc — produced in days of collaborative sessions, not years.
   - Why it stays coherent: lore lives in a TypeDB knowledge graph, not a pile of documents — every entry is linked to the people, places, and factions it's about, and the GM queries it live during play.
   - Canon grows at the table: when play establishes a new fact, the GM persists it as lore immediately; the world is append-only and self-consistent.
   - The thesis: the AI objection to volume assumes volume *replaces* coherence; here the architecture makes volume *serve* coherence. Link to `/tech/` for the machinery.
5. **§ Provenance** — the essay's human–AI collaboration section: who decided what, the human as creative director / taste function, the model as drafting instrument.
6. **Closing** — invite readers to read the worldbook themselves: link to https://github.com/fourth-wall-gaming/veilwrack-campaign and the full essay at https://github.com/fourth-wall-gaming/veilwrack-campaign/blob/main/docs/creative-originality.md

- [ ] **Step 3: Verify build**

Run: `npm run build` — expected: exit 0; `dist/craft/index.html` exists.

- [ ] **Step 4: Commit**

```bash
git add src/pages/craft.mdx
git commit -m "feat: craft page — originality essay plus worldbuilding-at-scale section"
```

---

### Task 7: Tech page

**Files:**
- Create: `src/pages/tech.mdx`

- [ ] **Step 1: Read sources**

Read `/Users/gullyburns/mythras-gm/README.md` and `/Users/gullyburns/mythras-gm/skills/mythras-gm/USAGE.md` for accurate technical claims. Do not invent capabilities.

- [ ] **Step 2: Write `src/pages/tech.mdx`**

Frontmatter:

```mdx
---
layout: ../layouts/Prose.astro
title: Tech
description: The architecture of an agentic gamemaster — deterministic rules engine, TypeDB knowledge graph as the save file, and campaigns as Git repos.
---
```

Required sections (each 1-3 paragraphs, technical-reader register; code snippets where shown):

1. **Opening** — the design problem: LLMs are great narrators and terrible bookkeepers. The architecture splits the two: Claude narrates; a deterministic engine and a knowledge graph keep the books.
2. **§ The deterministic rules engine** — `mythras_engine.py`: pure functions, no I/O, unit-tested. d100 checks with criticals/fumbles, difficulty grades, opposed/differential rolls, full attack resolution (differential roll → special-effect count → damage + modifier → hit location → parry reduction → armor → wound level) in one call. Every roll returns JSON the player can audit — the GM cannot fudge. Include an example CLI call and output shape:

```bash
mythras_gm.py roll-skill --id myth-char-xxxx --skill Perception --difficulty hard
```

3. **§ The knowledge graph as save file** — TypeDB 3.x; the `myth-` schema models campaigns, characters (per-location HP, fatigue, luck, passions), factions, locations, encounters, journal events, and lore with player/GM visibility. `get-context --campaign <id>` returns the entire game state — the GM "loads its save" at session start and recaps. Lore visibility keeps GM secrets out of the player-facing context.
4. **§ Campaigns as Git repos** — `export-campaign` serializes a campaign to a human-readable file tree (markdown + frontmatter for lore/locations/factions, JSON for characters/encounters/journal, a `campaign.yaml` manifest); `import-campaign --new-ids` remaps every entity ID and rebuilds all relations. Lossless round trip → publishing a world is `git push`.
5. **§ Plugin architecture** — Claude Code plugin: `alhazen-core` dependency boots TypeDB and the base schema; a SessionStart hook loads the `myth-` namespace on top; the skill is a slim SKILL.md with a full USAGE.md reference. Everything is MIT; mechanics under the ORC License.
6. **Closing** — links: https://github.com/fourth-wall-gaming/mythras-gm and `/play/` to try it.

- [ ] **Step 3: Verify build**

Run: `npm run build` — expected: exit 0; `dist/tech/index.html` exists.

- [ ] **Step 4: Commit**

```bash
git add src/pages/tech.mdx
git commit -m "feat: tech page — agentic GM architecture deep-dive"
```

---

### Task 8: Gallery (content collection + page + filter)

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/gallery/black-cat-rose-window.md`
- Create: `src/content/gallery/assets/black-cat-rose-window.jpg`
- Create: `src/pages/gallery.astro`

- [ ] **Step 1: Define the collection schema in `src/content.config.ts`**

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const gallery = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/gallery' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      project: z.string(),            // e.g. "veilwrack", "brand"
      medium: z.enum(['image', 'video', 'comic']),
      tools: z.array(z.string()).default([]),
      date: z.coerce.date(),
      image: image(),                 // cover image (required even for video/comic)
      videoUrl: z.string().url().optional(),
    }),
});

export const collections = { gallery };
```

- [ ] **Step 2: Seed the first entry (the brand art)**

```bash
mkdir -p src/content/gallery/assets
cp src/assets/logo-full.jpg src/content/gallery/assets/black-cat-rose-window.jpg
```

`src/content/gallery/black-cat-rose-window.md`:

```markdown
---
title: Black Cat, Rose Window
project: brand
medium: image
tools: ["Meta AI"]
date: 2026-06-12
image: ./assets/black-cat-rose-window.jpg
---

The Fourth Wall Gaming mark — a black cat silhouetted against a stained-glass
rose window. The jewel tones of the window set the palette for everything on
this site.
```

- [ ] **Step 3: Write `src/pages/gallery.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import { Image } from 'astro:assets';
import { getCollection, render } from 'astro:content';

const entries = (await getCollection('gallery')).sort(
  (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
);
const projects = [...new Set(entries.map((e) => e.data.project))].sort();
const rendered = await Promise.all(
  entries.map(async (entry) => ({ entry, Content: (await render(entry)).Content }))
);
---
<Base title="Gallery · Fourth Wall Gaming" description="AI-generated art, film, and comics from Fourth Wall Gaming worlds.">
  <div class="container">
    <h1>Gallery</h1>
    <p class="lede">Art generated alongside the worlds — every piece tied to the canon it illustrates.</p>

    <div class="filters" id="filters">
      <button data-project="all" class="active">All</button>
      {projects.map((p) => <button data-project={p}>{p}</button>)}
    </div>

    <div class="gallery-grid">
      {rendered.map(({ entry, Content }) => (
        <figure class="card gallery-item" data-project={entry.data.project}>
          <Image src={entry.data.image} alt={entry.data.title} width={800} />
          <figcaption>
            <h3>{entry.data.title}</h3>
            <p class="meta">{entry.data.project} · {entry.data.medium} · {entry.data.tools.join(', ')}</p>
            <Content />
          </figcaption>
        </figure>
      ))}
    </div>
  </div>

  <style>
    .lede { color: var(--text-dim); max-width: 38rem; }
    .filters { display: flex; gap: 0.5rem; flex-wrap: wrap; margin: 1.5rem 0; }
    .filters button {
      background: var(--bg-raised);
      color: var(--text-dim);
      border: 1px solid #2a2735;
      border-radius: 999px;
      padding: 0.35rem 1rem;
      cursor: pointer;
      font: inherit;
      font-size: 0.9rem;
    }
    .filters button.active { border-color: var(--amber); color: var(--amber); }
    .gallery-grid {
      display: grid;
      gap: 1.25rem;
      grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
    }
    .gallery-item { margin: 0; padding: 0; overflow: hidden; }
    .gallery-item :global(img) { width: 100%; }
    .gallery-item figcaption { padding: 1rem 1.25rem 1.25rem; }
    .gallery-item .meta { font-size: 0.8rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.05em; }
    .gallery-item.hidden { display: none; }
  </style>

  <script>
    const buttons = document.querySelectorAll('#filters button');
    const items = document.querySelectorAll('.gallery-item');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const project = (btn as HTMLElement).dataset.project;
        items.forEach((item) => {
          (item as HTMLElement).classList.toggle(
            'hidden',
            project !== 'all' && (item as HTMLElement).dataset.project !== project
          );
        });
      });
    });
  </script>
</Base>
```

- [ ] **Step 4: Verify build**

Run: `npm run build` — expected: exit 0; `dist/gallery/index.html` exists and contains `Black Cat, Rose Window`.

- [ ] **Step 5: Commit**

```bash
git add src/content.config.ts src/content src/pages/gallery.astro
git commit -m "feat: gallery content collection with project filtering, seed brand art"
```

---

### Task 9: GitHub Actions deploy + Pages config

**Files:**
- Create: `.github/workflows/deploy.yml`
- Modify: `README.md` (replace Jekyll boilerplate)

- [ ] **Step 1: Write `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v3

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Replace `README.md`**

```markdown
# fourth-wall-gaming.github.io

The website for **Fourth Wall Gaming** — an open-source agentic gaming studio
building AI gamemasters, worlds, art, and stories on the Mythras ORC SRDs.

Live at <https://fourth-wall-gaming.github.io>.

## Stack

Astro 5 static site, deployed to GitHub Pages via GitHub Actions on every
push to `main`.

## Develop

​```bash
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
​```

## Content

- Pages: `src/pages/` (Play/Craft/Tech are MDX)
- Gallery: add a markdown file + image under `src/content/gallery/`
- Design spec: `docs/superpowers/specs/2026-06-12-fourth-wall-gaming-website-design.md`
```

(Backtick fences are literal.)

- [ ] **Step 3: Switch the repo's Pages source to GitHub Actions**

```bash
gh api -X PUT repos/fourth-wall-gaming/fourth-wall-gaming.github.io/pages -f build_type=workflow
```

If that 404s (Pages not yet initialized): `gh api -X POST repos/fourth-wall-gaming/fourth-wall-gaming.github.io/pages -f build_type=workflow`

- [ ] **Step 4: Commit (do not push yet — controller pushes after final review)**

```bash
git add .github README.md
git commit -m "feat: GitHub Actions deploy workflow, replace Jekyll README"
```

---

### Task 10: Final verification + deploy

**This task is performed by the controller, not a subagent — it pushes to a shared remote.**

- [ ] **Step 1: Full clean build**

```bash
cd /Users/gullyburns/fourth-wall-gaming.github.io
rm -rf dist && npm run build
```

Expected: exit 0; `dist/` contains `index.html`, `play/`, `craft/`, `tech/`, `gallery/`, `favicon.png`.

- [ ] **Step 2: Smoke-test pages locally**

```bash
npm run preview &   # serves dist/ on localhost:4321
curl -s localhost:4321/ | grep -o '<title>[^<]*</title>'
curl -s localhost:4321/play/ | grep -c 'alhazen-core'
curl -s localhost:4321/craft/ | grep -ci 'worldbuilding'
curl -s localhost:4321/tech/ | grep -ci 'typedb'
curl -s localhost:4321/gallery/ | grep -c 'Black Cat'
kill %1
```

Expected: every grep returns ≥ 1.

- [ ] **Step 3: Confirm push with user, then push**

```bash
git log --oneline origin/main..HEAD   # show what's going out
git push origin main
```

- [ ] **Step 4: Watch the deploy and verify live**

```bash
gh run watch --repo fourth-wall-gaming/fourth-wall-gaming.github.io --exit-status
curl -s https://fourth-wall-gaming.github.io/ | grep -o '<title>[^<]*</title>'
```

Expected: workflow green; live title is "Fourth Wall Gaming".
