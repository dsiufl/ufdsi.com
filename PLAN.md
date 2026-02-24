# SEO Execution Plan

## Context
- Source of truth: `SEO.md`
- Mode: Autonomous execution, no permission prompts
- Site: https://ufdsi.com (UF Data Science and Informatics student organization)

## Audit Summary

### Stack / Rendering Model
- Framework: Next.js 14 App Router
- Language: TypeScript
- Styling: Tailwind CSS
- Rendering: Hybrid SSR/SSG with several CSR-only pages (`'use client'`)
- Font: Inter (Google Fonts, subset: latin)

### URL Inventory (8 indexable + 2 non-indexable)
| Route              | Rendering     | Indexable | Notes                          |
|--------------------|---------------|-----------|--------------------------------|
| `/`                | SSR server    | Yes       |                                |
| `/about`           | CSR (`'use client'`) | Yes | Metadata NOT picked up by Next.js |
| `/calendar`        | SSR server    | Yes       |                                |
| `/contact`         | SSR server    | Yes       |                                |
| `/newsletter`      | CSR (`'use client'`) | Yes | No metadata exported           |
| `/sponsors`        | CSR (`'use client'`) | Yes | No metadata exported           |
| `/symposium`       | SSR server    | Yes       | Old/legacy page?               |
| `/symposium-new`   | SSR server    | Yes       | Missing from sitemap           |
| `/team`            | CSR (`'use client'`) | Yes | Metadata NOT picked up by Next.js |
| `/workshops-list`  | CSR (`'use client'`) | Yes | No metadata exported           |
| `/error`           | SSR server    | No        | Has boilerplate template text  |
| `/unsubscribe`     | SSR server    | No        | No metadata, no noindex        |

### Key Strengths
- `robots.ts` exists and points to sitemap
- `sitemap.ts` exists with 8 core routes
- `lang="en"` set on `<html>`
- `favicon.ico` present
- Canonical base URL (`https://ufdsi.com`) used consistently in sitemap

### Key Gaps (Gap → File → Action)
1. **`layout.tsx` has `"use client"`** → blocks root metadata export → Remove directive, add global metadata
2. **No OG/Twitter tags anywhere** → All pages → Add via root metadata + page overrides
3. **No canonical URL config** → `layout.tsx` → Add `metadataBase` + `alternates.canonical`
4. **Client component pages cannot export metadata** → `about`, `team`, `newsletter`, `sponsors`, `workshops-list` → Refactor to server wrappers
5. **Error page has boilerplate metadata** → `error/page.tsx` → Fix title/description, add `noindex`
6. **`/unsubscribe` has no metadata and no `noindex`** → `unsubscribe/page.tsx` → Add metadata + `noindex`
7. **No JSON-LD structured data** → `layout.tsx` → Add Organization + WebSite schema
8. **`/sponsors` and `/symposium-new` missing from sitemap** → `sitemap.ts` → Add routes
9. **`/error` and `/unsubscribe` not blocked in robots** → `robots.ts` → Add Disallow rules
10. **Homepage title "UF DSI" too short (6 chars)** → `page.tsx` → Expand to 50–60 chars
11. **Contact description = "Contact Us" (3 words)** → `contact/page.tsx` → Expand
12. **Symposium description = "Symposium" (1 word)** → `symposium/page.tsx` → Expand
13. **Calendar title missing brand name** → `calendar/page.tsx` → Add `| UF DSI`
14. **`about/metadata.ts` not linked to Next.js metadata system** → Delete file, inline in page
15. **`team/metadata.ts` not linked to Next.js metadata system** → Delete file, use server wrapper

## Prioritized Phases

- [x] Phase A: Planning + Tracking — this document
- [ ] Phase B: Indexability and Crawlability
- [ ] Phase C: Metadata Foundation
- [ ] Phase D: Canonicalization and URL Strategy
- [ ] Phase E: Structured Data
- [ ] Phase F: Sitemap and Robots
- [ ] Phase G: Internal Linking and IA
- [ ] Phase H: Performance and Rendering Quality
- [ ] Phase I: Automation and CI Enforcement

## File-Level Task List

### Phase B — Indexability
- [ ] Remove `"use client"` from `src/app/layout.tsx`
- [ ] Add `noindex` to `src/app/error/page.tsx`
- [ ] Add `noindex` to `src/app/unsubscribe/page.tsx`
- [ ] Remove `"use client"` from `src/app/about/page.tsx` (no hooks; `dynamic` works server-side)
- [ ] Remove `"use client"` from `src/app/sponsors/page.tsx` (no hooks; next/image works server-side)

### Phase C — Metadata Foundation
- [ ] Add `export const metadata` with full OG/Twitter/canonical to `src/app/layout.tsx`
- [ ] Fix homepage metadata in `src/app/page.tsx` (expand title, description, add OG/Twitter override)
- [ ] Fix about metadata — inline in `src/app/about/page.tsx`; delete `about/metadata.ts`
- [ ] Fix contact metadata in `src/app/contact/page.tsx`
- [ ] Fix calendar metadata in `src/app/calendar/page.tsx`
- [ ] Fix symposium metadata in `src/app/symposium/page.tsx`
- [ ] Fix symposium-new metadata in `src/app/symposium-new/page.tsx`
- [ ] Fix error metadata in `src/app/error/page.tsx` (remove boilerplate)
- [ ] Add metadata to `src/app/unsubscribe/page.tsx`
- [ ] Add metadata to `src/app/sponsors/page.tsx`
- [ ] Create server wrapper `src/app/newsletter/page.tsx`; move UI to `NewsletterClient.tsx`
- [ ] Create server wrapper `src/app/team/page.tsx`; move UI to `TeamClient.tsx`; delete `team/metadata.ts`
- [ ] Create server wrapper `src/app/workshops-list/page.tsx`; move UI to `WorkshopsClient.tsx`

### Phase D — Canonicalization
- [ ] Add `metadataBase` + `alternates.canonical` to root layout metadata

### Phase E — Structured Data
- [ ] Add Organization + WebSite JSON-LD script to `src/app/layout.tsx`

### Phase F — Sitemap and Robots
- [ ] Add `/sponsors` and `/symposium-new` to `src/app/sitemap.ts`
- [ ] Add `Disallow` rules for `/error` and `/unsubscribe` in `src/app/robots.ts`

### Phase I — CI Automation
- [ ] Create `scripts/seo-validate.mjs` — fails if key pages missing title/OG/canonical

## Validation Plan

| Check | Tool/Method |
|-------|-------------|
| Layout server component, metadata exported | `grep -n 'use client' src/app/layout.tsx` → should be empty |
| OG tags present in HTML | `curl -s https://ufdsi.com/ \| grep og:` |
| JSON-LD present | `curl -s https://ufdsi.com/ \| grep ld+json` |
| Sitemap includes sponsors | `curl https://ufdsi.com/sitemap.xml \| grep sponsors` |
| Robots blocks error/unsubscribe | `curl https://ufdsi.com/robots.txt` |
| No boilerplate in error page | `grep -r "Startup and SaaS" src/` → should be empty |
| noindex on error/unsubscribe | Check rendered HTML head |

## Risks / Dependencies
- Removing `"use client"` from `layout.tsx` should be safe since `Providers` handles client theming
- Converting `about` + `sponsors` to server components requires verifying no hidden hooks
- Team/newsletter/workshops server wrappers must not break interactive functionality
- `og:image` references `/images/hero/group-photo.png` — ensure file exists at `public/images/hero/group-photo.png` ✓
