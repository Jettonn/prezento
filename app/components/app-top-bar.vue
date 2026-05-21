<script setup lang="ts">
import { APP_NAME } from "~/lib/constants";

type SaveState = "idle" | "saving" | "saved" | "error";

const props = withDefaults(defineProps<{
  deckTitle?: string;
  saveState?: SaveState;
}>(), {
  deckTitle: "",
  saveState: "idle",
});

defineEmits<{
  (e: "update:deckTitle", value: string): void;
  (e: "present"): void;
  (e: "share"): void;
}>();

const saveLabel = computed(() => {
  switch (props.saveState) {
    case "saving": return "Saving…";
    case "saved": return "Saved just now";
    case "error": return "Save failed";
    default: return "";
  }
});

const saveIcon = computed(() => {
  switch (props.saveState) {
    case "saving": return "i-lucide-loader-2";
    case "saved": return "i-lucide-cloud-check";
    case "error": return "i-lucide-cloud-alert";
    default: return "i-lucide-cloud";
  }
});
</script>

<template>
  <header
    class="flex h-14 items-center gap-4 border-b border-border bg-surface px-4"
  >
    <NuxtLink to="/" class="flex items-center gap-2 pr-2">
      <Icon
        name="i-lucide-asterisk"
        class="text-primary"
        size="22"
      />
      <span class="text-[15px] font-semibold tracking-tight">{{ APP_NAME }}</span>
    </NuxtLink>

    <div class="flex items-center gap-1.5">
      <input
        :value="deckTitle"
        type="text"
        placeholder="Untitled deck"
        class="w-[260px] rounded-input border border-transparent bg-transparent px-2 py-1 text-sm font-medium text-text outline-none transition placeholder:text-text-secondary hover:border-border focus:border-border focus:bg-background"
        @input="$emit('update:deckTitle', ($event.target as HTMLInputElement).value)"
      >
      <Icon
        name="i-lucide-chevron-down"
        class="text-text-secondary"
        size="14"
      />
    </div>

    <div
      v-if="saveState !== 'idle'"
      class="flex items-center gap-1.5 text-[13px] text-text-secondary"
    >
      <Icon
        :name="saveIcon"
        :class="saveState === 'saving' && 'animate-spin'"
        size="14"
      />
      <span>{{ saveLabel }}</span>
    </div>

    <div class="ml-auto flex items-center gap-2">
      <button
        type="button"
        disabled
        class="flex items-center gap-1.5 rounded-input border border-border bg-surface px-3 py-1.5 text-[13px] font-medium text-text transition hover:bg-background disabled:opacity-60"
        title="Available after first slide"
        @click="$emit('present')"
      >
        <Icon name="i-lucide-play" size="14" />
        Present
      </button>

      <button
        type="button"
        class="flex items-center gap-1.5 rounded-input border border-border bg-surface px-3 py-1.5 text-[13px] font-medium text-text transition hover:bg-background"
        @click="$emit('share')"
      >
        <Icon name="i-lucide-share-2" size="14" />
        Share
      </button>

      <button
        type="button"
        disabled
        title="Coming soon"
        class="flex items-center gap-1.5 rounded-input bg-primary px-3 py-1.5 text-[13px] font-medium text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
      >
        Export
        <Icon name="i-lucide-chevron-down" size="14" />
      </button>

      <button
        type="button"
        disabled
        title="Dark mode coming soon"
        class="flex h-8 w-8 items-center justify-center rounded-input border border-border bg-surface text-text-secondary transition hover:bg-background disabled:opacity-60"
      >
        <Icon name="i-lucide-sun" size="14" />
      </button>
    </div>
  </header>
</template>
