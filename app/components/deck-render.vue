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
    <article
      v-for="slide in slides"
      :key="slide.index"
      :data-slide-index="slide.index"
      class="slide-card relative mx-auto flex aspect-video w-full max-w-3xl flex-col overflow-hidden rounded-card border border-border bg-surface shadow-soft"
    >
      <div class="flex items-start justify-between px-8 pt-6 text-[12px] text-text-secondary">
        <span>prezento</span>
        <span class="font-mono">{{ String(slide.index + 1).padStart(2, "0") }}</span>
      </div>
      <div
        class="slide-content min-h-0 flex-1 overflow-hidden px-10 py-6 text-[18px] leading-snug"
        v-html="slide.contentHtml"
      />
    </article>

    <p v-if="slides.length === 0" class="text-center text-sm text-text-secondary">
      Start typing to see slides here.
    </p>
  </div>
</template>

<style scoped>
.slide-content :deep(h1) {
  font-size: 44px;
  line-height: 1.1;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--color-text);
  margin: 0 0 12px;
}
.slide-content :deep(h2) {
  font-size: 32px;
  line-height: 1.15;
  font-weight: 600;
  letter-spacing: -0.015em;
  color: var(--color-text);
  margin: 0 0 12px;
}
.slide-content :deep(h3) {
  font-size: 22px;
  font-weight: 600;
  color: var(--color-text);
  margin: 8px 0;
}
.slide-content :deep(p) {
  color: var(--color-text);
  margin: 0 0 10px;
}
.slide-content :deep(ul) {
  padding-left: 1.25em;
  margin: 0 0 10px;
  list-style-type: disc;
}
.slide-content :deep(ol) {
  padding-left: 1.5em;
  margin: 0 0 10px;
  list-style-type: decimal;
}
.slide-content :deep(li) {
  margin: 4px 0;
  color: var(--color-text);
}
.slide-content :deep(li::marker) {
  color: var(--color-primary);
}
.slide-content :deep(blockquote) {
  border-left: 3px solid var(--color-primary);
  padding-left: 12px;
  color: var(--color-text-secondary);
  font-style: italic;
  margin: 0 0 10px;
}
.slide-content :deep(code) {
  background: var(--color-background);
  padding: 1px 6px;
  border-radius: 6px;
  font-size: 0.9em;
}
.slide-content :deep(pre) {
  margin: 8px 0;
  padding: 14px 16px;
  border-radius: var(--radius-card);
  font-size: 14px;
  line-height: 1.55;
  overflow-x: auto;
}
.slide-content :deep(pre code) {
  background: transparent;
  padding: 0;
}
.slide-content :deep(a) {
  color: var(--color-primary);
  text-decoration: underline;
}
.slide-content :deep(strong) {
  color: var(--color-text);
  font-weight: 600;
}
.slide-content :deep(em) {
  color: var(--color-primary);
}
.slide-content :deep(hr) {
  border: 0;
  border-top: 1px solid var(--color-border);
  margin: 16px 0;
}
</style>
