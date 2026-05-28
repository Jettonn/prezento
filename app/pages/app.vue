<script setup lang="ts">
import { APP_NAME } from "~/lib/constants";

definePageMeta({
  middleware: ["auth"],
});

useHead({ title: `My decks · ${APP_NAME}` });

type DeckRow = {
  slug: string;
  title: string | null;
  isPublic: boolean;
  createdAt: number;
  updatedAt: number;
};

const authStore = useAuthStore();

const { data, refresh, pending } = await useFetch<{ decks: DeckRow[] }>("/api/decks", {
  key: "my-decks",
});

const decks = computed<DeckRow[]>(() => data.value?.decks ?? []);

const pendingDeleteSlug = ref<string | null>(null);
const deleting = ref<string | null>(null);
const deleteError = ref<string | null>(null);

const deckPendingDelete = computed(() =>
  decks.value.find(d => d.slug === pendingDeleteSlug.value) ?? null,
);

function askDelete(slug: string) {
  deleteError.value = null;
  pendingDeleteSlug.value = slug;
}

function cancelDelete() {
  pendingDeleteSlug.value = null;
}

async function confirmDelete() {
  const slug = pendingDeleteSlug.value;
  if (!slug)
    return;
  deleting.value = slug;
  deleteError.value = null;
  try {
    await $fetch(`/api/decks/${slug}`, { method: "DELETE" });
    pendingDeleteSlug.value = null;
    await refresh();
  }
  catch (err) {
    deleteError.value = err instanceof Error ? err.message : "Could not delete deck";
  }
  finally {
    deleting.value = null;
  }
}

async function handleSignOut() {
  await authStore.signOut();
}

function displayTitle(d: DeckRow): string {
  return d.title?.trim() ? d.title : "Untitled deck";
}
</script>

<template>
  <div class="min-h-dvh bg-background text-text">
    <header class="border-b border-border bg-surface">
      <div class="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
        <NuxtLink to="/app" class="flex items-center gap-2">
          <Icon
            name="i-lucide-asterisk"
            class="text-primary"
            size="22"
          />
          <span class="text-[15px] font-semibold tracking-tight">{{ APP_NAME }}</span>
        </NuxtLink>
        <div class="flex items-center gap-3">
          <NuxtLink
            to="/new"
            class="flex items-center gap-1.5 rounded-input bg-primary px-3 py-1.5 text-[13px] font-medium text-white transition hover:bg-primary-hover"
          >
            <Icon name="i-lucide-plus" size="14" />
            New deck
          </NuxtLink>
          <div v-if="authStore.user" class="flex items-center gap-2">
            <UserAvatar :image="authStore.user.image" :name="authStore.user.name" />
            <button
              type="button"
              class="rounded-input border border-border bg-surface px-3 py-1.5 text-[13px] text-text-secondary transition hover:bg-background"
              @click="handleSignOut"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-4xl px-6 py-10">
      <div class="mb-6 flex items-baseline justify-between">
        <h1 class="text-[22px] font-semibold tracking-tight">
          My decks
        </h1>
        <span v-if="decks.length" class="text-[13px] text-text-secondary">
          {{ decks.length }} {{ decks.length === 1 ? "deck" : "decks" }}
        </span>
      </div>

      <div v-if="pending && !decks.length" class="rounded-input border border-border bg-surface px-4 py-8 text-center text-[13px] text-text-secondary">
        Loading…
      </div>

      <div v-else-if="!decks.length" class="rounded-input border border-dashed border-border bg-surface px-6 py-12 text-center">
        <Icon
          name="i-lucide-presentation"
          size="28"
          class="mx-auto text-text-secondary"
        />
        <h2 class="mt-3 text-[15px] font-medium">
          No decks yet
        </h2>
        <p class="mt-1 text-[13px] text-text-secondary">
          Start with markdown — get a shareable deck in seconds.
        </p>
        <NuxtLink
          to="/new"
          class="mt-5 inline-flex items-center gap-1.5 rounded-input bg-primary px-3 py-1.5 text-[13px] font-medium text-white transition hover:bg-primary-hover"
        >
          <Icon name="i-lucide-plus" size="14" />
          Create your first deck
        </NuxtLink>
      </div>

      <ul v-else class="divide-y divide-border overflow-hidden rounded-input border border-border bg-surface">
        <li
          v-for="d in decks"
          :key="d.slug"
          class="flex items-center gap-4 px-4 py-3"
        >
          <Icon
            :name="d.isPublic ? 'i-lucide-globe' : 'i-lucide-lock'"
            :class="d.isPublic ? 'text-primary' : 'text-text-secondary'"
            size="14"
          />
          <div class="min-w-0 flex-1">
            <NuxtLink
              :to="`/d/${d.slug}/edit`"
              class="block truncate text-[14px] font-medium text-text hover:text-primary"
            >
              {{ displayTitle(d) }}
            </NuxtLink>
            <div class="text-[12px] text-text-secondary">
              Updated {{ useTimeAgo(new Date(d.updatedAt)).value }}
            </div>
          </div>
          <div class="flex items-center gap-1">
            <NuxtLink
              :to="`/d/${d.slug}`"
              class="rounded-input border border-transparent px-2 py-1 text-[12px] text-text-secondary transition hover:border-border hover:bg-background"
              title="View"
            >
              <Icon name="i-lucide-eye" size="14" />
            </NuxtLink>
            <NuxtLink
              :to="`/d/${d.slug}/edit`"
              class="rounded-input border border-transparent px-2 py-1 text-[12px] text-text-secondary transition hover:border-border hover:bg-background"
              title="Edit"
            >
              <Icon name="i-lucide-pencil" size="14" />
            </NuxtLink>
            <button
              type="button"
              class="rounded-input border border-transparent px-2 py-1 text-[12px] text-text-secondary transition hover:border-border hover:bg-background hover:text-red-600"
              title="Delete"
              @click="askDelete(d.slug)"
            >
              <Icon name="i-lucide-trash-2" size="14" />
            </button>
          </div>
        </li>
      </ul>
    </main>

    <div
      v-if="deckPendingDelete"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      @click.self="cancelDelete"
    >
      <div class="w-full max-w-sm rounded-input border border-border bg-surface p-5 shadow-lg">
        <h2 class="text-[15px] font-semibold">
          Delete this deck?
        </h2>
        <p class="mt-1.5 text-[13px] text-text-secondary">
          "{{ displayTitle(deckPendingDelete) }}" will be removed. Anyone with the share link will get a 404.
        </p>
        <div v-if="deleteError" class="mt-3 rounded-input border border-red-300 bg-red-50 px-3 py-2 text-[12px] text-red-700">
          {{ deleteError }}
        </div>
        <div class="mt-5 flex justify-end gap-2">
          <button
            type="button"
            :disabled="!!deleting"
            class="rounded-input border border-border bg-surface px-3 py-1.5 text-[13px] font-medium text-text transition hover:bg-background disabled:opacity-60"
            @click="cancelDelete"
          >
            Cancel
          </button>
          <button
            type="button"
            :disabled="!!deleting"
            class="flex items-center gap-1.5 rounded-input bg-red-600 px-3 py-1.5 text-[13px] font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
            @click="confirmDelete"
          >
            <Icon
              :name="deleting ? 'i-lucide-loader-2' : 'i-lucide-trash-2'"
              :class="deleting && 'animate-spin'"
              size="14"
            />
            {{ deleting ? "Deleting…" : "Delete" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
