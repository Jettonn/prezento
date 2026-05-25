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

const isOwner = computed(() => deck.value?.isOwner ?? false);
const isPublic = ref(deck.value?.isPublic ?? false);
const visibilityBusy = ref(false);

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

const canPresent = computed(() => (deck.value?.markdown ?? "").trim().length > 0);
const router = useRouter();

function enterPresenter() {
  router.push(`/d/${slug.value}/present`);
}

async function toggleVisibility(): Promise<void> {
  if (visibilityBusy.value)
    return;
  visibilityBusy.value = true;
  const next = !isPublic.value;
  try {
    const res = await $fetch<{ isPublic: boolean }>(`/api/decks/${slug.value}/visibility`, {
      method: "PATCH",
      body: { isPublic: next },
    });
    isPublic.value = res.isPublic;
  }
  catch {
    // leave state unchanged on failure
  }
  finally {
    visibilityBusy.value = false;
  }
}
</script>

<template>
  <div class="flex h-screen flex-col bg-background">
    <AppTopBar
      :deck-title="displayTitle"
      :share-url="shareUrl"
      :edit-url="isOwner ? `/d/${slug}/edit` : ''"
      :can-present="canPresent"
      :is-owner="isOwner"
      :is-public="isPublic"
      :visibility-busy="visibilityBusy"
      read-only
      @present="enterPresenter"
      @toggle-visibility="toggleVisibility"
    />

    <div class="flex min-h-0 flex-1">
      <AppSidebar :slides="slides" :selected-index="0" />

      <main class="min-w-0 flex-1 overflow-auto p-8">
        <DeckRender :markdown="deck?.markdown ?? ''" />
      </main>
    </div>
  </div>
</template>
