# prezento

A web app that turns a markdown document into a beautiful, shareable slide deck. Single context.

## Language

**Deck**:
A presentation, identified by an unguessable short slug. Stored as a single markdown blob.
_Avoid_: Presentation, slideshow, document, file

**Deck title**:
The user-settable name of a Deck, shown in the top bar, the share URL preview, and the "my decks" list.
_Avoid_: Name, presentation name

**Slide**:
One segment of a Deck, separated from neighboring segments by `---` lines in the markdown.
_Avoid_: Page, frame, section

**Slide title**:
The first `# heading` inside a Slide segment. Just markdown content — not stored separately from the Deck's markdown.
_Avoid_: Heading, header

**Owner**:
Whoever is allowed to edit or delete a Deck. Either an authenticated User (`decks.owner_user_id`) or an anonymous session (`decks.anon_owner_token`), never both at once.
_Avoid_: Author, creator

**Anonymous deck**:
A Deck created without sign-in. Bound to a signed cookie token until adopted on sign-in, at which point its Owner becomes the User.
_Avoid_: Guest deck, draft deck

**Presenter mode**:
Fullscreen, one-Slide-at-a-time view with keyboard navigation. Distinct from the read-only viewer (`/d/:slug`) which renders all Slides as a scrollable list of cards.
_Avoid_: Slideshow mode, full mode

## Relationships

- A **Deck** has many **Slides** (derived from markdown, not stored)
- A **Deck** has exactly one **Owner**
- A **User** can own many **Decks**; an **Anonymous deck** is adopted when its cookie-bound Owner signs in

## Flagged ambiguities

- "Title" was ambiguous between **Deck title** and **Slide title** — resolved: these are distinct, only **Deck title** is a stored column.
- "Layout" (as in Slidev's `layout: hero` frontmatter) is **not** a v0 concept in this codebase — slide-level layout directives are stored as inline markdown frontmatter and ignored by the v0 renderer.

## Example dialogue

> **Dev:** "When an anonymous user creates a **Deck** and then signs in, what happens to existing **Decks**?"
> **PM:** "All **Anonymous decks** bound to that browser's cookie token get adopted — the **Owner** flips from cookie-token to **User**."
> **Dev:** "And the **Deck title** — does it default to the first **Slide title**?"
> **PM:** "If the user doesn't set one explicitly, yes — we read the first `# heading` of the first **Slide**."
