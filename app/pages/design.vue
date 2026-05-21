<script setup lang="ts">
const deckTitle = ref("Product Launch Deck");
const saveState = ref<"idle" | "saving" | "saved" | "error">("saved");

const sampleSlides = [
  { number: 1, title: "" },
  { number: 2, title: "Problem" },
  { number: 3, title: "Solution" },
  { number: 4, title: "Features" },
  { number: 5, title: "Product" },
  { number: 6, title: "Market" },
  { number: 7, title: "Roadmap" },
  { number: 8, title: "Team" },
  { number: 9, title: "Closing" },
];

const sampleMarkdown = `---
layout: hero
background: gradient
---

# Building the future
with modern tools

> The best way to predict the future is to build it.

---

## The problem

Legacy tools are slow, complex
and hard to scale.

- Too many moving parts
- Steep learning curve
- Not built for speed

---

## Our solution

A modern, minimal and powerful
toolkit for builders.

- Fast & intuitive
- Developer friendly
- Built for the future
`;
</script>

<template>
  <div class="flex h-screen flex-col bg-background">
    <AppTopBar
      v-model:deck-title="deckTitle"
      :save-state="saveState"
    />

    <div class="flex min-h-0 flex-1">
      <AppSidebar :slides="sampleSlides" :selected-index="0" />

      <main class="grid min-w-0 flex-1 grid-cols-2">
        <!-- Editor column placeholder -->
        <section class="flex min-w-0 flex-col border-r border-border bg-surface">
          <div class="flex items-center gap-2 border-b border-border px-3 py-2">
            <button
              type="button"
              class="flex items-center gap-1.5 rounded-input bg-background px-2.5 py-1 text-[13px] font-medium text-text"
            >
              presentation.md
              <span class="h-1.5 w-1.5 rounded-full bg-primary" />
            </button>
            <button
              type="button"
              class="flex h-7 w-7 items-center justify-center rounded-input text-text-secondary transition hover:bg-background hover:text-text"
            >
              <Icon name="i-lucide-plus" size="14" />
            </button>
          </div>

          <div class="min-h-0 flex-1 overflow-auto p-4 font-mono text-[13px] leading-6">
            <pre class="text-text-secondary"><code>{{ sampleMarkdown }}</code></pre>
          </div>

          <div class="flex items-center justify-between border-t border-border px-3 py-2 text-[12px] text-text-secondary">
            <span class="font-mono">Ln 1, Col 1 &nbsp;·&nbsp; Markdown &nbsp;·&nbsp; 612 words</span>
            <kbd class="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[11px]">⌘K</kbd>
          </div>
        </section>

        <!-- Preview column placeholder -->
        <section class="flex min-w-0 flex-col">
          <div class="flex items-center gap-2 border-b border-border bg-surface px-3 py-2">
            <button
              type="button"
              class="flex h-7 w-7 items-center justify-center rounded-input border border-border bg-background text-text"
              title="Desktop"
            >
              <Icon name="i-lucide-monitor" size="14" />
            </button>
            <button
              type="button"
              class="flex h-7 w-7 items-center justify-center rounded-input text-text-secondary transition hover:bg-background hover:text-text"
              title="Mobile"
            >
              <Icon name="i-lucide-smartphone" size="14" />
            </button>
            <button
              type="button"
              class="flex h-7 w-7 items-center justify-center rounded-input text-text-secondary transition hover:bg-background hover:text-text"
              title="More"
            >
              <Icon name="i-lucide-more-vertical" size="14" />
            </button>
            <button
              type="button"
              class="ml-2 flex items-center gap-1.5 rounded-input border border-border bg-background px-2.5 py-1 text-[13px] text-text"
            >
              100%
              <Icon name="i-lucide-chevron-down" size="12" />
            </button>
            <button
              type="button"
              class="ml-auto flex h-7 w-7 items-center justify-center rounded-input text-text-secondary transition hover:bg-background hover:text-text"
              title="Fullscreen"
            >
              <Icon name="i-lucide-maximize" size="14" />
            </button>
          </div>

          <div class="min-h-0 flex-1 overflow-auto p-6">
            <!-- Placeholder slide -->
            <article
              class="relative mx-auto flex aspect-video w-full max-w-3xl flex-col overflow-hidden rounded-card border border-border bg-surface shadow-soft"
            >
              <div class="flex items-start justify-between px-8 pt-6 text-[12px] text-text-secondary">
                <span>prezento</span>
                <span class="font-mono">01</span>
              </div>

              <div class="flex flex-1 flex-col items-center justify-center px-10 text-center">
                <h1 class="text-[44px] leading-[1.1] font-semibold tracking-tight text-text">
                  Building the future
                </h1>
                <h2 class="text-[44px] leading-[1.1] font-semibold tracking-tight">
                  with <span class="text-primary">modern tools</span>
                </h2>
                <div class="my-6 h-px w-12 bg-border" />
                <p class="text-[16px] text-text-secondary">
                  The best way to predict the future is to build it.
                </p>
              </div>

              <div class="relative h-24">
                <div
                  class="absolute right-1/2 -bottom-16 h-44 w-72 translate-x-1/2 rounded-full bg-primary/30 blur-3xl"
                />
              </div>
            </article>
          </div>

          <div class="flex items-center justify-between border-t border-border bg-surface px-3 py-2">
            <div class="flex items-center gap-2">
              <button
                type="button"
                class="flex h-7 w-7 items-center justify-center rounded-input text-text-secondary transition hover:bg-background hover:text-text"
              >
                <Icon name="i-lucide-chevron-left" size="14" />
              </button>
              <span class="text-[13px] text-text-secondary tabular-nums">1 / 9</span>
              <button
                type="button"
                class="flex h-7 w-7 items-center justify-center rounded-input text-text-secondary transition hover:bg-background hover:text-text"
              >
                <Icon name="i-lucide-chevron-right" size="14" />
              </button>
            </div>

            <label class="flex items-center gap-2 text-[13px] text-text-secondary">
              Presenter notes
              <span class="relative flex h-5 w-9 items-center rounded-full bg-border p-0.5">
                <span class="h-4 w-4 rounded-full bg-surface shadow-soft" />
              </span>
            </label>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>
