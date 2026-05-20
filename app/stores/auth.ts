import { createAuthClient } from "better-auth/vue";

import { defineStore } from "pinia";

export const useAuthStore = defineStore("authStore", () => {
  const authClient = createAuthClient();

  const session = ref<Awaited<ReturnType<typeof authClient.useSession>> | null>(null);

  async function init() {
    if (session.value)
      return;
    const data = await authClient.useSession(useFetch);
    session.value = data;
  }

  const user = computed(() => session.value?.data?.user);
  const loading = computed(() => session.value?.isPending);

  async function signIn() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/app",
      errorCallbackURL: "/?error=auth",
    });
  }

  async function signOut() {
    await authClient.signOut();
    navigateTo("/");
  }

  return {
    init,
    signIn,
    signOut,
    loading,
    user,
  };
});
