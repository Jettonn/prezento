<script setup lang="ts">
import type { Slide } from "~/lib/slides";
import { renderDeck } from "~/lib/slides";

const route = useRoute();
const router = useRouter();
const slug = computed(() => String(route.params.slug));

const { data: deck, error } = await useFetch(`/api/decks/${slug.value}`, {
  key: `deck-${slug.value}`,
});

if (error.value || !deck.value) {
  throw createError({ statusCode: 404, statusMessage: "Deck not found" });
}

const displayTitle = computed(() => deck.value?.title ?? "Untitled deck");
useHead({ title: () => `${displayTitle.value} · prezento` });

const slides = ref<Slide[]>(await renderDeck(deck.value?.markdown ?? ""));
const slideCount = computed(() => slides.value.length);

const currentIndex = computed(() => {
  const raw = Number(route.query.s);
  const oneBased = Number.isFinite(raw) && raw >= 1 ? Math.floor(raw) : 1;
  const max = Math.max(1, slideCount.value);
  return Math.min(max, oneBased) - 1;
});

const currentSlide = computed(() => slides.value[currentIndex.value]);

function goTo(index: number) {
  if (slideCount.value === 0)
    return;
  const clamped = Math.max(0, Math.min(slideCount.value - 1, index));
  if (clamped === currentIndex.value)
    return;
  router.replace({ query: { ...route.query, s: String(clamped + 1) } });
}

function next() {
  goTo(currentIndex.value + 1);
}
function prev() {
  goTo(currentIndex.value - 1);
}
function first() {
  goTo(0);
}
function last() {
  goTo(slideCount.value - 1);
}
function exit() {
  if (import.meta.client && document.fullscreenElement)
    document.exitFullscreen().catch(() => {});
  router.push(`/d/${slug.value}`);
}

async function toggleFullscreen() {
  if (!import.meta.client)
    return;
  try {
    if (document.fullscreenElement)
      await document.exitFullscreen();
    else
      await document.documentElement.requestFullscreen();
  }
  catch {
    // Fullscreen rejected (e.g., not triggered by user gesture) — ignore.
  }
}

function onKeyDown(e: KeyboardEvent) {
  if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey)
    return;
  switch (e.key) {
    case "ArrowRight":
    case "PageDown":
    case " ":
      e.preventDefault();
      next();
      break;
    case "ArrowLeft":
    case "PageUp":
      e.preventDefault();
      prev();
      break;
    case "Home":
      e.preventDefault();
      first();
      break;
    case "End":
      e.preventDefault();
      last();
      break;
    case "Escape":
      e.preventDefault();
      exit();
      break;
    case "f":
    case "F":
      e.preventDefault();
      toggleFullscreen();
      break;
  }
}

onMounted(() => {
  window.addEventListener("keydown", onKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeyDown);
});
</script>

<template>
  <div class="presenter flex h-screen w-screen flex-col bg-background">
    <div class="flex min-h-0 flex-1 items-center justify-center px-8 py-8">
      <div class="w-full max-w-[1200px]">
        <DeckSlide
          v-if="currentSlide"
          :key="currentSlide.index"
          :slide="currentSlide"
        />
        <p v-else class="text-center text-sm text-text-secondary">
          No slides to present.
        </p>
      </div>
    </div>

    <div
      v-if="slideCount > 0"
      class="pointer-events-none absolute bottom-4 right-4 select-none font-mono text-[13px] text-text-secondary/60"
    >
      {{ currentIndex + 1 }} / {{ slideCount }}
    </div>

    <button
      type="button"
      class="absolute left-4 top-4 flex items-center gap-1.5 rounded-input border border-border bg-surface/80 px-2.5 py-1.5 text-[12px] text-text-secondary opacity-40 backdrop-blur transition hover:opacity-100"
      title="Exit (Esc)"
      @click="exit"
    >
      <Icon name="i-lucide-x" size="14" />
      Exit
    </button>
  </div>
</template>
