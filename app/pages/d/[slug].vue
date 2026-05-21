<script setup lang="ts">
import { parseDeck } from "~/lib/slides";

const route = useRoute();
const slug = computed(() => String(route.params.slug));

const { data: deck, error } = await useFetch(`/api/decks/${slug.value}`, {
  key: `deck-${slug.value}`,
});

if (error.value || !deck.value) {
  throw createError({ statusCode: 404, statusMessage: "Deck not found" });
}

const displayTitle = computed(() => deck.value?.title ?? "Untitled deck");

useHead({ title: () => `${displayTitle.value} · prezento` });

const shareUrl = computed(() => {
  if (import.meta.server)
    return `/d/${slug.value}`;
  return `${window.location.origin}/d/${slug.value}`;
});

const slides = computed(() =>
  parseDeck(deck.value?.markdown ?? "").map(s => ({
    number: s.index + 1,
    title: s.title,
  })),
);
</script>

<template>
  <div class="flex h-screen flex-col bg-background">
    <AppTopBar
      :deck-title="displayTitle"
      :share-url="shareUrl"
      read-only
    />

    <div class="flex min-h-0 flex-1">
      <AppSidebar :slides="slides" :selected-index="0" />

      <main class="min-w-0 flex-1 overflow-auto p-8">
        <DeckRender :markdown="deck?.markdown ?? ''" />
      </main>
    </div>
  </div>
</template>
