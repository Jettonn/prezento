<script setup lang="ts">
type Props = {
  image?: string | null;
  name?: string | null;
  size?: number;
};

const props = withDefaults(defineProps<Props>(), {
  image: null,
  name: null,
  size: 32,
});

const errored = ref(false);

const WHITESPACE_RE = /\s+/u;

watch(() => props.image, () => {
  errored.value = false;
});

const showImage = computed(() => Boolean(props.image) && !errored.value);

const initials = computed(() => {
  const raw = (props.name ?? "").trim();
  if (!raw)
    return "?";
  const parts = raw.split(WHITESPACE_RE).filter(Boolean);
  if (parts.length === 1)
    return parts[0]!.charAt(0).toUpperCase();
  return (parts[0]!.charAt(0) + parts.at(-1)!.charAt(0)).toUpperCase();
});

// Deterministic palette from name → keeps the same color for the same user.
const palette = [
  { bg: "bg-emerald-100", fg: "text-emerald-800" },
  { bg: "bg-amber-100", fg: "text-amber-800" },
  { bg: "bg-sky-100", fg: "text-sky-800" },
  { bg: "bg-rose-100", fg: "text-rose-800" },
  { bg: "bg-violet-100", fg: "text-violet-800" },
  { bg: "bg-teal-100", fg: "text-teal-800" },
];

const tone = computed(() => {
  const raw = (props.name ?? "").trim() || "?";
  let hash = 0;
  for (let i = 0; i < raw.length; i++)
    hash = (hash * 31 + raw.charCodeAt(i)) >>> 0;
  return palette[hash % palette.length]!;
});

const dimension = computed(() => `${props.size}px`);
const fontSize = computed(() => `${Math.max(10, Math.round(props.size * 0.4))}px`);
</script>

<template>
  <span
    class="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-stone-200"
    :class="[showImage ? 'bg-white' : tone.bg]"
    :style="{ width: dimension, height: dimension }"
  >
    <img
      v-if="showImage"
      :src="image!"
      :alt="name || 'User avatar'"
      referrerpolicy="no-referrer"
      class="h-full w-full object-cover"
      @error="errored = true"
    >
    <span
      v-else
      class="font-medium tracking-wide select-none"
      :class="tone.fg"
      :style="{ fontSize }"
      :aria-label="name || 'User avatar'"
    >
      {{ initials }}
    </span>
  </span>
</template>
