import Shiki from "@shikijs/markdown-it";
import { parseSync } from "@slidev/parser";
import MarkdownIt from "markdown-it";

export type Slide = {
  index: number;
  title: string;
  contentHtml: string;
  frontmatter: Record<string, unknown>;
};

const HEADING_PREFIX_RE = /^#+\s*/;
const H1_HEADING_RE = /^#\s+/;

let mdPromise: Promise<MarkdownIt> | null = null;

async function getMarkdown(): Promise<MarkdownIt> {
  if (!mdPromise) {
    mdPromise = (async () => {
      const md = new MarkdownIt({ html: false, linkify: true, breaks: false });
      md.use(await Shiki({
        themes: { light: "github-light", dark: "github-dark" },
        langs: ["js", "ts", "vue", "html", "css", "json", "bash", "md", "python"],
      }));
      return md;
    })();
  }
  return mdPromise;
}

function deriveTitle(slide: { title?: string; content: string }, index: number): string {
  if (slide.title?.trim())
    return slide.title.trim();
  // Fallback: first non-empty line that looks like text
  const firstLine = slide.content.split("\n").find(l => l.trim().length > 0);
  if (firstLine)
    return firstLine.replace(HEADING_PREFIX_RE, "").slice(0, 60);
  return `Slide ${index + 1}`;
}

export function parseDeck(markdown: string): Array<Pick<Slide, "index" | "title" | "frontmatter"> & { content: string }> {
  if (!markdown.trim()) {
    return [{ index: 0, title: "Slide 1", content: "", frontmatter: {} }];
  }
  const parsed = parseSync(markdown, "presentation.md");
  return parsed.slides.map((s, i) => ({
    index: i,
    title: deriveTitle(s, i),
    content: s.content,
    frontmatter: s.frontmatter,
  }));
}

export async function renderDeck(markdown: string): Promise<Slide[]> {
  const slides = parseDeck(markdown);
  const md = await getMarkdown();
  return slides.map(s => ({
    ...s,
    contentHtml: md.render(s.content),
  }));
}

export function deriveDeckTitle(markdown: string): string | undefined {
  const slides = parseDeck(markdown);
  const first = slides[0];
  if (!first)
    return undefined;
  const titleLine = first.content.split("\n").find(l => l.trim().startsWith("# "));
  if (titleLine)
    return titleLine.replace(H1_HEADING_RE, "").trim();
  return undefined;
}
