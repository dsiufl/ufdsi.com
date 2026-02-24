# Universal SEO Implementation Playbook (Project-Agnostic)

This file is a reusable source of truth for implementing state-of-the-art SEO in any web project.
Use it as-is across repositories.

## 1) Mandatory Execution Contract

1. Analyze the entire repository before making changes.
2. Detect the stack and rendering model first (static HTML, SSR, SSG, ISR, CSR SPA, hybrid).
3. Create `PLAN.md` from this file before implementation.
4. Create `PROGRESS.md` from this file before implementation.
5. Execute the full plan end-to-end automatically, without asking for permission or re-confirmation.
6. Keep `PROGRESS.md` updated continuously as work progresses.
7. If blocked, continue all unblocked tasks and log blocker, impact, and mitigation in `PROGRESS.md`.
8. Do not regress existing SEO strengths while closing gaps.

## 2) Repository Discovery (Required Before Edits)

1. Inventory all routes/pages and their canonical public URLs.
2. Inventory all SEO surfaces:
   - HTML templates/layouts/head components.
   - Metadata utilities and route-level SEO config.
   - Structured data generators.
   - `robots.txt`, sitemap files, feed files, manifest/icons.
   - Redirect rules and host/protocol canonicalization.
   - Build and CI/CD workflows that generate or publish pages.
3. Identify indexable vs non-indexable routes.
4. Identify JS-dependent pages that render thin/empty initial HTML.
5. Produce a gap list mapped to exact files and actions.

## 3) Implementation Phases

### Phase A: Planning + Tracking

1. Generate `PLAN.md` with prioritized tasks (P0/P1/P2), file targets, acceptance criteria, validation, and dependencies.
2. Generate `PROGRESS.md` with timestamped status tracking and validation logs.

### Phase B: Indexability and Crawlability

1. Ensure each indexable URL returns meaningful primary content in initial HTML source.
2. For CSR-only pages, implement one:
   - SSR/SSG/prerender.
   - Static fallback content plus progressive enhancement.
3. Ensure non-index pages explicitly use `noindex` (and `nofollow` when appropriate).
4. Ensure no orphan critical pages.

### Phase C: Metadata Foundation

1. Ensure every indexable page has unique:
   - `<title>` (target ~50-60 chars).
   - Meta description (target ~120-160 chars).
   - Canonical URL.
2. Add complete social metadata:
   - `og:title`, `og:description`, `og:type`, `og:url`, `og:image`, `og:site_name`, `og:image:alt`.
   - `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`, `twitter:image:alt`.
3. Ensure `lang`, `viewport`, favicon links, and stable metadata defaults with route overrides.

### Phase D: Canonicalization and URL Strategy

1. Enforce one canonical URL per content item.
2. Resolve conflicts between parameterized URLs and canonical slug/detail URLs.
3. Align canonical tags, internal links, sitemap URLs, and schema URLs.
4. Enforce canonical host/protocol/trailing-slash rules via redirects.

### Phase E: Structured Data (JSON-LD)

1. Validate all existing schema and remove invalid/duplicate/conflicting blocks.
2. Add schema by page intent:
   - `WebSite`, `Organization`.
   - `BreadcrumbList` for navigable hierarchies.
   - Content-specific schema such as `Article`, `BlogPosting`, `Product`, `Course`, `FAQPage`, `HowTo`, `ItemList`, `ProfilePage`, `WebPage`.
3. Ensure schema URLs and dates (`datePublished`, `dateModified`) are correct and consistent.
4. Ensure schema represents visible content and follows policy.

### Phase F: Sitemap and Robots

1. Sitemap must include all canonical indexable URLs and exclude noindex/utility/error URLs.
2. Exclude `404` and other non-canonical URLs from sitemap output.
3. Ensure sitemap entries resolve as expected (prefer 200 for indexable canonical pages).
4. Keep `robots.txt` aligned with true indexability rules and list all sitemap entry points.
5. Add/validate feed discoverability (`rel="alternate"` RSS/Atom) where applicable.

### Phase G: Internal Linking and Information Architecture

1. Strengthen hub-and-cluster linking for major topics/use-cases.
2. Improve anchor specificity and contextual relevance.
3. Reduce crawl depth for strategic pages.
4. Ensure key pages are discoverable from nav, hubs, and contextual links.

### Phase H: Performance and Rendering Quality

1. Protect Core Web Vitals on key landing and conversion pages.
2. Avoid heavy render-blocking scripts and non-critical CSS/JS on critical templates.
3. Optimize image delivery and social preview assets.
4. Verify bot-visible content parity between server/source HTML and hydrated UI.

### Phase I: Automation and CI Enforcement

1. Add an SEO validator script that fails CI when:
   - Indexable pages miss title/description/canonical/H1.
   - Canonical collisions or mismatches exist.
   - Required OG/Twitter tags are missing.
   - Sitemap includes non-canonical, blocked, or error URLs.
   - 404 pages appear in sitemap.
2. Add no-JS crawl smoke tests for representative key routes.
3. Add host-safety checks to prevent `localhost`/staging URLs in canonical/OG/schema/sitemaps.
4. Run SEO validation in CI before deployment.

## 4) Validation Gates (Must Pass)

1. Every indexable page has valid metadata, canonical, and primary visible content in initial HTML.
2. Every non-indexable page is explicitly controlled (`noindex` policy).
3. Canonical, internal links, schema URLs, and sitemap URLs are fully aligned.
4. Structured data has no critical validation errors.
5. Sitemap contains only canonical indexable URLs and excludes error/utility routes.
6. Internal linking supports shallow discovery of strategic pages.
7. No localhost or non-production host leakage in production artifacts.
8. CI SEO validation and no-JS smoke tests pass.
9. No functional regressions from SEO changes.

## 5) Definition of Done

1. Full-repo audit completed and documented.
2. `PLAN.md` created from this file.
3. `PROGRESS.md` created and updated through completion.
4. All P0 and P1 items implemented.
5. All validation gates passed and logged.
6. Remaining P2 opportunities documented with clear next actions.

## 6) Required `PLAN.md` Template

```md
# SEO Execution Plan

## Context
- Source of truth: `SEO.md`
- Mode: Autonomous execution, no permission prompts

## Audit Summary
- Stack/rendering model:
- URL inventory size:
- Key strengths:
- Key gaps:

## Prioritized Phases
- [ ] Phase A: Planning + Tracking
- [ ] Phase B: Indexability and Crawlability
- [ ] Phase C: Metadata Foundation
- [ ] Phase D: Canonicalization and URL Strategy
- [ ] Phase E: Structured Data
- [ ] Phase F: Sitemap and Robots
- [ ] Phase G: Internal Linking and IA
- [ ] Phase H: Performance and Rendering Quality
- [ ] Phase I: Automation and CI Enforcement

## File-Level Task List
- [ ] <task> -> <files>
- [ ] <task> -> <files>

## Validation Plan
- <check> -> <command/tool>

## Risks / Dependencies
- <risk>
```

## 7) Required `PROGRESS.md` Template

```md
# SEO Execution Progress

## Status
- Started: <timestamp>
- Current phase: <phase>
- Completion: <percent>

## Work Log
- <timestamp> - Completed: <task>; Files: <paths>; Validation: <result>
- <timestamp> - Completed: <task>; Files: <paths>; Validation: <result>

## Validation Log
- <timestamp> - <validation check> -> <result>

## Blockers
- <none or blocker + impact + mitigation>

## Next Actions
1. <next action>
2. <next action>
```

## 8) Execution Rule

Do not stop after analysis or planning.
Implement, validate, and document completion in `PROGRESS.md` in the same run whenever possible.
