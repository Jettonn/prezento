<script setup lang="ts">
import { parseDeck } from "~/lib/slides";

useHead({ title: "New deck · prezento" });

const SAMPLE = `# Building the future
with **modern tools**

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

const markdown = ref(SAMPLE);
const deckTitle = ref("");
const cursor = ref({ line: 1, col: 1, words: 0 });

const slides = computed(() =>
  parseDeck(markdown.value).map(s => ({ number: s.index + 1, title: s.title })),
);

const isCreating = ref(false);
const createError = ref<string | null>(null);

async function handleCreate() {
  if (isCreating.value)
    return;
  isCreating.value = true;
  createError.value = null;
  try {
    const { slug } = await $fetch<{ slug: string }>("/api/decks", {
      method: "POST",
      body: {
        markdown: markdown.value,
        title: deckTitle.value.trim() || undefined,
      },
    });
    await navigateTo(`/d/${slug}`);
  }
  catch (err) {
    createError.value = err instanceof Error ? err.message : "Could not create deck";
    isCreating.value = false;
  }
}
</script>

<template>
  <div class="flex h-screen flex-col bg-background">
    <AppTopBar v-model:deck-title="deckTitle" />

    <div class="flex min-h-0 flex-1">
      <AppSidebar :slides="slides" :selected-index="0" />

      <main class="grid min-w-0 flex-1 grid-cols-2">
        <section class="flex min-w-0 flex-col border-r border-border bg-surface">
          <div class="flex items-center gap-2 border-b border-border px-3 py-2">
            <button
              type="button"
              class="flex items-center gap-1.5 rounded-input bg-background px-2.5 py-1 text-[13px] font-medium text-text"
            >
              presentation.md
              <span class="h-1.5 w-1.5 rounded-full bg-primary" />
            </button>
          </div>

          <div class="min-h-0 flex-1 overflow-hidden">
            <ClientOnly>
              <MarkdownEditor v-model="markdown" @cursor="cursor = $event" />
              <template #fallback>
                <div class="flex h-full items-center justify-center text-sm text-text-secondary">
                  Loading editor…
                </div>
              </template>
            </ClientOnly>
          </div>

          <div class="flex items-center justify-between border-t border-border px-3 py-2 text-[12px] text-text-secondary">
            <span class="font-mono">
              Ln {{ cursor.line }}, Col {{ cursor.col }} &nbsp;·&nbsp; Markdown &nbsp;·&nbsp; {{ cursor.words }} words
            </span>
            <button
              type="button"
              :disabled="isCreating || markdown.trim().length === 0"
              class="flex items-center gap-1.5 rounded-input bg-primary px-3 py-1.5 text-[12px] font-medium text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              @click="handleCreate"
            >
              <Icon
                :name="isCreating ? 'i-lucide-loader-2' : 'i-lucide-arrow-right'"
                :class="isCreating && 'animate-spin'"
                size="12"
              />
              {{ isCreating ? "Creating…" : "Create deck" }}
            </button>
          </div>
        </section>

        <section class="flex min-w-0 flex-col">
          <div class="flex items-center gap-2 border-b border-border bg-surface px-3 py-2">
            <button
              type="button"
              class="flex h-7 w-7 items-center justify-center rounded-input border border-border bg-background text-text"
              title="Desktop"
            >
              <Icon name="i-lucide-monitor" size="14" />
            </button>
            <span class="text-[12px] text-text-secondary">Live preview</span>
          </div>

          <div class="min-h-0 flex-1 overflow-auto p-6">
            <DeckRender :markdown="markdown" />
          </div>

          <div v-if="createError" class="border-t border-border bg-surface px-4 py-2 text-[12px] text-red-600">
            {{ createError }}
          </div>
        </section>
      </main>
    </div>
  </div>
</template>
