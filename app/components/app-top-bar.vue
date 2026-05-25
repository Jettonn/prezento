<script setup lang="ts">
import { APP_NAME } from "~/lib/constants";

type SaveState = "idle" | "saving" | "saved" | "error";

const props = withDefaults(defineProps<{
  deckTitle?: string;
  saveState?: SaveState;
  savedAt?: Date | null;
  shareUrl?: string;
  editUrl?: string;
  readOnly?: boolean;
  canPresent?: boolean;
  isOwner?: boolean;
  isPublic?: boolean;
  visibilityBusy?: boolean;
}>(), {
  deckTitle: "",
  saveState: "idle",
  savedAt: null,
  shareUrl: "",
  editUrl: "",
  readOnly: false,
  canPresent: false,
  isOwner: false,
  isPublic: false,
  visibilityBusy: false,
});

defineEmits<{
  (e: "update:deckTitle", value: string): void;
  (e: "present"): void;
  (e: "toggleVisibility"): void;
}>();

const copied = ref(false);
let copyResetTimer: ReturnType<typeof setTimeout> | null = null;

function resetCopied() {
  copied.value = false;
}

async function handleShare() {
  if (!props.shareUrl)
    return;
  try {
    await navigator.clipboard.writeText(props.shareUrl);
    copied.value = true;
    if (copyResetTimer)
      clearTimeout(copyResetTimer);
    copyResetTimer = setTimeout(resetCopied, 1800);
  }
  catch {
    copied.value = false;
  }
}

const timeAgo = useTimeAgo(computed(() => props.savedAt ?? new Date()), {
  updateInterval: 30_000,
});

const saveLabel = computed(() => {
  switch (props.saveState) {
    case "saving": return "Saving…";
    case "saved": return props.savedAt ? `Saved ${timeAgo.value}` : "Saved";
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
        :readonly="readOnly"
        :tabindex="readOnly ? -1 : 0"
        class="w-[260px] rounded-input border border-transparent bg-transparent px-2 py-1 text-sm font-medium text-text outline-none transition placeholder:text-text-secondary read-only:cursor-default read-only:hover:border-transparent hover:border-border focus:border-border focus:bg-background"
        @input="$emit('update:deckTitle', ($event.target as HTMLInputElement).value)"
      >
      <Icon
        v-if="!readOnly"
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
        v-if="isOwner"
        type="button"
        :disabled="visibilityBusy"
        class="flex items-center gap-1.5 rounded-input border border-border bg-surface px-3 py-1.5 text-[13px] font-medium text-text transition hover:bg-background disabled:opacity-60"
        :title="isPublic ? 'Anyone with the link can view. Click to make private.' : 'Only you can see this deck. Click to share.'"
        @click="$emit('toggleVisibility')"
      >
        <Icon
          :name="visibilityBusy ? 'i-lucide-loader-2' : (isPublic ? 'i-lucide-globe' : 'i-lucide-lock')"
          :class="[visibilityBusy && 'animate-spin', isPublic && 'text-primary']"
          size="14"
        />
        {{ isPublic ? "Public" : "Private" }}
      </button>

      <button
        type="button"
        :disabled="!canPresent"
        class="flex items-center gap-1.5 rounded-input border border-border bg-surface px-3 py-1.5 text-[13px] font-medium text-text transition hover:bg-background disabled:opacity-60"
        :title="canPresent ? 'Enter presenter mode' : 'Available after first slide'"
        @click="$emit('present')"
      >
        <Icon name="i-lucide-play" size="14" />
        Present
      </button>

      <button
        v-if="isPublic || !isOwner"
        type="button"
        :disabled="!shareUrl"
        :title="shareUrl ? 'Copy share link' : 'Save the deck first'"
        class="flex items-center gap-1.5 rounded-input border border-border bg-surface px-3 py-1.5 text-[13px] font-medium text-text transition hover:bg-background disabled:opacity-60"
        @click="handleShare"
      >
        <Icon
          :name="copied ? 'i-lucide-check' : 'i-lucide-share-2'"
          :class="copied && 'text-primary'"
          size="14"
        />
        {{ copied ? "Link copied" : "Share" }}
      </button>

      <NuxtLink
        v-if="editUrl"
        :to="editUrl"
        class="flex items-center gap-1.5 rounded-input border border-border bg-surface px-3 py-1.5 text-[13px] font-medium text-text transition hover:bg-background"
      >
        <Icon name="i-lucide-pencil" size="14" />
        Edit
      </NuxtLink>

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
