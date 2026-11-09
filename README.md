# Zeroth Technology website

Public informational website at https://zeroth.technology/, served from this repository’s main branch through GitHub Pages.

## Structure

The root contains the static website. No build step or server is required. Preview locally with `python3 -m http.server 8000`.

- `index.html`: mission and portfolio.
- `writings.html` and `archive.html`: research landing page and searchable archive. Original article URLs remain on https://zeroth-tech.github.io/blogs/.
- `corporate-information.html`, `privacy.html`, `security.html`, `terms.html`: company and website information.
- `LLM.txt`, `llms.txt`, `llm.html`: synchronized agent guidance.
- `robots.txt`, `sitemap.xml`, `.well-known/security.txt`: public discovery and reporting files.

## Maintenance

Keep CNAME set to `zeroth.technology` and `.nojekyll` in place. Preserve existing article and legacy URLs. Archive search is browser-local; accessibility choices use local storage. The background animation respects Stop animation and operating-system reduced motion. Google Fonts is the only external dependency on the redesigned pages.

Before publishing, check JavaScript syntax, responsive layouts, links, archive filters, keyboard navigation, no-JavaScript content, and reduced-motion behavior. Keep website policies consistent with actual hosting and data practices. Do not ship local QA fixtures.

## Rollback

The production baseline before the November 2026 redesign is commit `fcfb8b2ebd4b0735175311f499341e359c18e4de`. Revert the release commit to restore the previous website without rewriting history.
