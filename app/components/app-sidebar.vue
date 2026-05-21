<script setup lang="ts">
type SlideEntry = {
  number: number;
  title: string;
};

withDefaults(defineProps<{
  slides?: SlideEntry[];
  selectedIndex?: number;
}>(), {
  slides: () => [],
  selectedIndex: 0,
});

const authStore = useAuthStore();

const bottomNav = [
  { label: "Templates", icon: "i-lucide-layout-template" },
  { label: "Themes", icon: "i-lucide-palette" },
  { label: "Snippets", icon: "i-lucide-code" },
  { label: "Assets", icon: "i-lucide-image" },
  { label: "Settings", icon: "i-lucide-settings" },
];
</script>

<template>
  <aside class="flex w-[220px] shrink-0 flex-col border-r border-border bg-surface">
    <div class="p-3">
      <button
        type="button"
        class="flex w-full items-center justify-center gap-1.5 rounded-input bg-primary px-3 py-2 text-[13px] font-medium text-white transition hover:bg-primary-hover"
      >
        <Icon name="i-lucide-plus" size="14" />
        New Slide
      </button>
    </div>

    <nav class="flex-1 overflow-y-auto px-2 pb-2">
      <ul class="space-y-0.5">
        <li v-for="(slide, idx) in slides" :key="slide.number">
          <div
            class="group flex items-center gap-2 rounded-input px-2 py-1.5 text-[13px] transition hover:bg-background"
            :class="idx === selectedIndex && 'border border-border bg-background'"
          >
            <Icon
              name="i-lucide-grip-vertical"
              size="12"
              class="text-text-secondary/40 group-hover:text-text-secondary"
            />
            <span class="w-4 text-text-secondary tabular-nums">{{ slide.number }}</span>
            <span class="truncate text-text">{{ slide.title }}</span>
          </div>
        </li>

        <li v-if="slides.length === 0" class="px-2 py-3 text-[13px] text-text-secondary">
          No slides yet
        </li>
      </ul>
    </nav>

    <div class="border-t border-border px-2 py-2">
      <ul class="space-y-0.5">
        <li v-for="item in bottomNav" :key="item.label">
          <button
            type="button"
            class="flex w-full items-center gap-2 rounded-input px-2 py-1.5 text-[13px] text-text-secondary transition hover:bg-background hover:text-text"
          >
            <Icon :name="item.icon" size="14" />
            {{ item.label }}
          </button>
        </li>
      </ul>
    </div>

    <div class="flex items-center gap-2 border-t border-border p-3">
      <UserAvatar
        v-if="authStore.user"
        :image="authStore.user.image"
        :name="authStore.user.name"
        :size="32"
      />
      <div v-else class="flex h-8 w-8 items-center justify-center rounded-full bg-background text-text-secondary">
        <Icon name="i-lucide-user" size="14" />
      </div>

      <div class="min-w-0 flex-1 text-[13px] leading-tight">
        <div class="truncate font-medium text-text">
          {{ authStore.user?.name ?? "Guest" }}
        </div>
        <div class="truncate text-text-secondary">
          {{ authStore.user?.email ?? "Not signed in" }}
        </div>
      </div>

      <Icon
        name="i-lucide-chevron-down"
        size="14"
        class="text-text-secondary"
      />
    </div>
  </aside>
</template>
