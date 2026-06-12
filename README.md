# fourth-wall-gaming.github.io

The website for **Fourth Wall Gaming** — an open-source agentic gaming studio
building AI gamemasters, worlds, art, and stories on the Mythras ORC SRDs.

Live at <https://fourth-wall-gaming.github.io>.

## Stack

Astro 5 static site, deployed to GitHub Pages via GitHub Actions on every
push to `main`.

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
```

## Content

- Pages: `src/pages/` (Play/Craft/Tech are MDX)
- Gallery: add a markdown file + image under `src/content/gallery/`
- Design spec: `docs/superpowers/specs/2026-06-12-fourth-wall-gaming-website-design.md`
