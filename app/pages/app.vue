<script setup lang="ts">
import { APP_NAME } from "~/lib/constants";

definePageMeta({
  middleware: ["auth"],
});

const authStore = useAuthStore();

async function handleSignOut() {
  await authStore.signOut();
}
</script>

<template>
  <div class="min-h-screen bg-stone-50 text-stone-900">
    <header class="border-b border-stone-200 bg-white">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <NuxtLink to="/app" class="flex items-center gap-2">
          <Icon
            name="i-lucide-square-dashed"
            class="text-emerald-700"
            size="22"
          />
          <span class="text-lg font-semibold tracking-tight">{{ APP_NAME }}</span>
        </NuxtLink>
        <div class="flex items-center gap-3">
          <div v-if="authStore.user" class="flex items-center gap-3">
            <UserAvatar
              :image="authStore.user.image"
              :name="authStore.user.name"
            />
            <div class="text-right text-sm leading-tight">
              <div class="font-medium text-stone-900">
                {{ authStore.user.name }}
              </div>
              <div class="text-xs text-stone-500">
                {{ authStore.user.email }}
              </div>
            </div>
          </div>
          <button
            type="button"
            class="rounded-md border border-stone-200 px-3 py-2 text-sm text-stone-700 hover:bg-stone-100"
            @click="handleSignOut"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-5xl px-6 py-16">
      <h1 class="font-serif text-3xl font-normal tracking-tight">
        Welcome{{ authStore.user?.name ? `, ${authStore.user.name.split(" ")[0]}` : "" }}.
      </h1>
      <p class="mt-2 max-w-xl text-stone-600">
        This is your protected area. Replace this page with the surface of your app.
      </p>

      <div class="mt-10 rounded-lg border border-stone-200 bg-white p-6">
        <h2 class="font-semibold">
          You're authenticated.
        </h2>
        <p class="mt-1 text-sm text-stone-500">
          Build features here. The auth session is available via <code class="rounded bg-stone-100 px-1 py-0.5 font-mono text-xs">useAuthStore()</code> on the client and on <code class="rounded bg-stone-100 px-1 py-0.5 font-mono text-xs">event.context.user</code> on the server (see <code class="rounded bg-stone-100 px-1 py-0.5 font-mono text-xs">server/utils/auth.ts</code>).
        </p>
      </div>
    </main>
  </div>
</template>
