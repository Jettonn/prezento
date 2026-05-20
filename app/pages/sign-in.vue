<script setup lang="ts">
import { APP_NAME } from "~/lib/constants";

const authStore = useAuthStore();

await authStore.init();
if (authStore.user) {
  await navigateTo("/app");
}

const trustPoints = [
  {
    icon: "i-lucide-shield-check",
    title: "Your data stays yours",
    body: "We only request the minimum scopes needed to sign you in.",
  },
  {
    icon: "i-lucide-lock",
    title: "Private by design",
    body: "Sessions are stored server-side and signed with your own secret.",
  },
  {
    icon: "i-lucide-globe",
    title: "Built on open standards",
    body: "OAuth 2.0 with Google as the identity provider.",
  },
];

async function handleGoogle() {
  await authStore.signIn();
}
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-stone-50 px-6 py-12">
    <div class="w-full max-w-md">
      <NuxtLink to="/" class="mb-8 flex items-center gap-2">
        <Icon
          name="i-lucide-square-dashed"
          class="text-emerald-700"
          size="22"
        />
        <span class="text-lg font-semibold tracking-tight text-stone-900">{{ APP_NAME }}</span>
      </NuxtLink>

      <div class="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm sm:p-10">
        <h1 class="text-center font-serif text-3xl font-normal tracking-tight text-stone-900">
          Welcome to {{ APP_NAME }}
        </h1>
        <p class="mt-3 text-center text-sm text-stone-500">
          Sign in or create your account<br>
          to get started.
        </p>

        <button
          type="button"
          class="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-800 shadow-sm transition hover:border-stone-300 hover:bg-stone-50 disabled:opacity-50"
          :disabled="authStore.loading"
          @click="handleGoogle"
        >
          <svg
            viewBox="0 0 48 48"
            width="20"
            height="20"
            aria-hidden="true"
          >
            <path
              fill="#FFC107"
              d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
            />
            <path
              fill="#FF3D00"
              d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
            />
          </svg>
          Continue with Google
        </button>

        <div class="mt-8 flex items-center gap-3 text-xs text-stone-500">
          <span class="h-px flex-1 bg-stone-200" />
          <span class="tracking-wide uppercase">Secure and simple</span>
          <span class="h-px flex-1 bg-stone-200" />
        </div>

        <ul class="mt-6 space-y-5">
          <li
            v-for="t in trustPoints"
            :key="t.title"
            class="flex gap-3"
          >
            <Icon
              :name="t.icon"
              class="mt-0.5 shrink-0 text-emerald-700"
              size="20"
            />
            <div>
              <div class="text-sm font-semibold text-stone-900">
                {{ t.title }}
              </div>
              <p class="mt-1 text-sm text-stone-500">
                {{ t.body }}
              </p>
            </div>
          </li>
        </ul>

        <div class="mt-8 border-t border-stone-100 pt-6 text-center text-xs text-stone-500">
          By continuing, you agree to our
          <a href="#" class="text-emerald-700 hover:underline">Terms of Service</a>
          and
          <a href="#" class="text-emerald-700 hover:underline">Privacy Policy</a>.
        </div>
      </div>

      <p class="mt-8 text-center text-xs text-stone-400">
        © {{ new Date().getFullYear() }} {{ APP_NAME }}
      </p>
    </div>
  </main>
</template>
