<script setup lang="ts">
import { APP_NAME, APP_TAGLINE } from "~/lib/constants";

const authStore = useAuthStore();
</script>

<template>
  <div class="min-h-screen bg-stone-50 text-stone-900">
    <header class="border-b border-stone-200/70 bg-stone-50/80 backdrop-blur">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <NuxtLink to="/" class="flex items-center gap-2">
          <Icon
            name="i-lucide-square-dashed"
            class="text-emerald-700"
            size="22"
          />
          <span class="text-lg font-semibold tracking-tight">{{ APP_NAME }}</span>
        </NuxtLink>
        <div class="flex items-center gap-3">
          <template v-if="authStore.user">
            <NuxtLink
              to="/app"
              class="flex items-center gap-2 rounded-full border border-stone-200 bg-white py-1 pr-4 pl-1 text-sm font-medium text-stone-800 shadow-sm transition hover:border-stone-300 hover:bg-stone-50"
            >
              <UserAvatar
                :image="authStore.user.image"
                :name="authStore.user.name"
                :size="28"
              />
              Open app
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink
              to="/sign-in"
              class="text-sm text-stone-700 hover:text-stone-900"
            >
              Log in
            </NuxtLink>
            <NuxtLink
              to="/sign-in"
              class="rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
            >
              Get started
            </NuxtLink>
          </template>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 class="font-serif text-5xl leading-[1.05] font-normal tracking-tight text-stone-900 lg:text-6xl">
        Welcome to <em class="italic">{{ APP_NAME }}</em>.
      </h1>
      <p class="mx-auto mt-6 max-w-md text-lg text-stone-600">
        {{ APP_TAGLINE }}
      </p>
      <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
        <NuxtLink
          v-if="!authStore.user"
          to="/sign-in"
          class="rounded-md bg-emerald-700 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-800"
        >
          Get started
        </NuxtLink>
        <NuxtLink
          v-else
          to="/app"
          class="rounded-md bg-emerald-700 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-800"
        >
          Open app
        </NuxtLink>
        <a
          href="https://github.com/Jettonn/nuxt-template"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-1 text-sm font-medium text-stone-700 hover:text-stone-900"
        >
          View source
          <Icon name="i-lucide-arrow-up-right" size="16" />
        </a>
      </div>
    </main>

    <footer class="border-t border-stone-200 py-8">
      <div class="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 text-xs text-stone-500">
        <span class="flex items-center gap-2">
          <Icon
            name="i-lucide-square-dashed"
            class="text-emerald-700"
            size="14"
          />
          {{ APP_NAME }}
        </span>
        <span>© {{ new Date().getFullYear() }} {{ APP_NAME }}</span>
      </div>
    </footer>
  </div>
</template>
