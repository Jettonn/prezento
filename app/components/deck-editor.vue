<script setup lang="ts">
type Cursor = {
  line: number;
  col: number;
  words: number;
};

defineProps<{
  modelValue: string;
}>();

defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const cursor = ref<Cursor>({ line: 1, col: 1, words: 0 });
</script>

<template>
  <main class="grid min-h-0 min-w-0 flex-1 grid-cols-2">
    <section class="flex min-h-0 min-w-0 flex-col border-r border-border bg-surface">
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
          <MarkdownEditor
            :model-value="modelValue"
            @update:model-value="$emit('update:modelValue', $event)"
            @cursor="cursor = $event"
          />
          <template #fallback>
            <div class="flex h-full items-center justify-center text-sm text-text-secondary">
              Loading editor…
            </div>
          </template>
        </ClientOnly>
      </div>

      <div class="flex items-center justify-between gap-3 border-t border-border px-3 py-2 text-[12px] text-text-secondary">
        <span class="font-mono">
          Ln {{ cursor.line }}, Col {{ cursor.col }} &nbsp;·&nbsp; Markdown &nbsp;·&nbsp; {{ cursor.words }} words
        </span>
        <slot name="footer-action" />
      </div>
    </section>

    <section class="flex min-h-0 min-w-0 flex-col">
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
        <DeckRender :markdown="modelValue" />
      </div>

      <slot name="preview-footer" />
    </section>
  </main>
</template>
