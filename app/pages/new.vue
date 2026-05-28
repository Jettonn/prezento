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
    await navigateTo(`/d/${slug}/edit`);
  }
  catch (err) {
    createError.value = err instanceof Error ? err.message : "Could not create deck";
    isCreating.value = false;
  }
}
</script>

<template>
  <div class="flex h-dvh flex-col bg-background">
    <AppTopBar v-model:deck-title="deckTitle" />

    <div class="flex min-h-0 flex-1">
      <AppSidebar :slides="slides" :selected-index="0" />

      <DeckEditor v-model="markdown">
        <template #footer-action>
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
        </template>

        <template v-if="createError" #preview-footer>
          <div class="border-t border-border bg-surface px-4 py-2 text-[12px] text-red-600">
            {{ createError }}
          </div>
        </template>
      </DeckEditor>
    </div>
  </div>
</template>
