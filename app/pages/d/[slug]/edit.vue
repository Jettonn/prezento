<script setup lang="ts">
import { parseDeck } from "~/lib/slides";

type SaveState = "idle" | "saving" | "saved" | "error";

const route = useRoute();
const slug = computed(() => String(route.params.slug));

const { data, error } = await useFetch(`/api/decks/${slug.value}`, {
  key: `deck-${slug.value}-edit`,
  headers: useRequestHeaders(["cookie"]),
});

if (error.value || !data.value) {
  throw createError({ statusCode: 404, statusMessage: "Deck not found" });
}

if (!data.value.isOwner) {
  await navigateTo(`/d/${slug.value}`, { replace: true });
}

const markdown = ref(data.value.markdown);
const deckTitle = ref(data.value.title ?? "");
const isPublic = ref(data.value.isPublic);
const visibilityBusy = ref(false);

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

const canPresent = computed(() => markdown.value.trim().length > 0);
const router = useRouter();

function enterPresenter() {
  router.push(`/d/${slug.value}/present`);
}

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
  <div class="flex h-dvh flex-col bg-background">
    <AppTopBar
      v-model:deck-title="deckTitle"
      :save-state="saveState"
      :saved-at="savedAt"
      :share-url="shareUrl"
      :can-present="canPresent"
      is-owner
      :is-public="isPublic"
      :visibility-busy="visibilityBusy"
      @present="enterPresenter"
      @toggle-visibility="toggleVisibility"
    />

    <div class="flex min-h-0 flex-1">
      <AppSidebar :slides="slides" :selected-index="0" />

      <DeckEditor v-model="markdown">
        <template #footer-action>
          <span class="flex items-center gap-1.5 text-text-secondary/80">
            <Icon :name="isPublic ? 'i-lucide-globe' : 'i-lucide-lock'" size="12" />
            {{ isPublic ? "Anyone with the link can view this deck" : "Only you can see this deck" }}
          </span>
        </template>
      </DeckEditor>
    </div>
  </div>
</template>
