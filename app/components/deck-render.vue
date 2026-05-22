<script setup lang="ts">
import type { Slide } from "~/lib/slides";
import { renderDeck } from "~/lib/slides";

const props = defineProps<{
  markdown: string;
}>();

const slides = ref<Slide[]>([]);
let renderToken = 0;

async function update(md: string) {
  const token = ++renderToken;
  const next = await renderDeck(md);
  if (token === renderToken)
    slides.value = next;
}

watch(() => props.markdown, update, { immediate: true });
</script>

<template>
  <div class="space-y-6">
    <DeckSlide
      v-for="slide in slides"
      :key="slide.index"
      :slide="slide"
      class="max-w-3xl"
    />

    <p v-if="slides.length === 0" class="text-center text-sm text-text-secondary">
      Start typing to see slides here.
    </p>
  </div>
</template>
