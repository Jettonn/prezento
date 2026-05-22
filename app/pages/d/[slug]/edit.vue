<script setup lang="ts">
import { parseDeck } from "~/lib/slides";

type SaveState = "idle" | "saving" | "saved" | "error";

const route = useRoute();
const slug = computed(() => String(route.params.slug));

const { data, error } = await useFetch(`/api/decks/${slug.value}`, {
  key: `deck-${slug.value}-edit`,
});

if (error.value || !data.value) {
  throw createError({ statusCode: 404, statusMessage: "Deck not found" });
}

const markdown = ref(data.value.markdown);
const deckTitle = ref(data.value.title ?? "");

const saveState = ref<SaveState>("idle");
const savedAt = ref<Date | null>(null);

useHead({ title: () => `${deckTitle.value || "Untitled deck"} · prezento` });

const shareUrl = computed(() => {
  if (import.meta.server)
    return `/d/${slug.value}`;
  return `${window.location.origin}/d/${slug.value}`;
});

const slides = computed(() =>
  parseDeck(markdown.value).map(s => ({ number: s.index + 1, title: s.title })),
);

async function performSave(): Promise<void> {
  saveState.value = "saving";
  try {
    const res = await $fetch<{ ok: boolean; savedAt: number }>(`/api/decks/${slug.value}`, {
      method: "PUT",
      body: {
        markdown: markdown.value,
        title: deckTitle.value.trim() || null,
      },
    });
    savedAt.value = new Date(res.savedAt);
    saveState.value = "saved";
  }
  catch {
    saveState.value = "error";
  }
}

const debouncedSave = useDebounceFn(performSave, 1000);

watch([markdown, deckTitle], () => {
  debouncedSave();
});
</script>

<template>
  <div class="flex h-screen flex-col bg-background">
    <AppTopBar
      v-model:deck-title="deckTitle"
      :save-state="saveState"
      :saved-at="savedAt"
      :share-url="shareUrl"
    />

    <div class="flex min-h-0 flex-1">
      <AppSidebar :slides="slides" :selected-index="0" />

      <DeckEditor v-model="markdown">
        <template #footer-action>
          <span class="flex items-center gap-1.5 text-text-secondary/80">
            <Icon name="i-lucide-info" size="12" />
            Anyone with this link can edit · ownership coming soon
          </span>
        </template>
      </DeckEditor>
    </div>
  </div>
</template>
