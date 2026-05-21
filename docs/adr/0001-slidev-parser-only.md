# Use `@slidev/parser` for markdown parsing but render slides ourselves

We need an instant live-preview editor (user types markdown in a CodeMirror buffer, preview updates per keystroke). Slidev (sli.dev) is a Vite-based CLI tool whose intended workflow is "edit a `.md` file on disk, run `slidev` to build/serve" — it cannot be embedded as a live in-browser renderer without spinning up per-deck dev servers or per-save static builds, both of which are infeasible at our scale.

We adopt Slidev's markdown dialect (frontmatter, `---` separators, code fences) by depending on `@slidev/parser` only, and render each parsed Slide with our own Vue components styled by the prezento design system. This means we forgo Slidev's layouts, themes, transitions, click-steps, and Vue components in v0. Slide-level frontmatter directives (`layout: hero`, `background: gradient`) are parsed but ignored by the renderer.

## Considered options

- **Per-save Slidev static build** — full Slidev fidelity but no live preview and significant infra cost (storage, build queue).
- **Per-deck Slidev dev server (iframe)** — full Slidev including HMR but doesn't scale past one user.
- **Drop Slidev entirely, use markdown-it** — simplest, but commits us to a non-Slidev markdown dialect, making any future Slidev export ("Export to a Slidev project") harder.

## Consequences

- Future "Export to Slidev" is straightforward — we already produce Slidev-compatible markdown.
- Users who paste decks copied from Slidev tutorials will see frontmatter directives ignored, not honored. We should consider a warning UI for unsupported directives at some point.
- Re-introducing Slidev's renderer later (as an opt-in "Slidev fidelity" mode) is possible but means a second renderer path.
