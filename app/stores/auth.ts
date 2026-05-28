import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/vue";

import { defineStore } from "pinia";

export const useAuthStore = defineStore("authStore", () => {
  const authClient = createAuthClient({
    plugins: [emailOTPClient()],
  });

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

  async function sendOtp(email: string) {
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "sign-in",
    });
    if (error)
      throw new Error(error.message ?? "Failed to send code");
  }

  async function verifyOtp(email: string, otp: string) {
    const { error } = await authClient.signIn.emailOtp({ email, otp });
    if (error)
      throw new Error(error.message ?? "Invalid or expired code");
  }

  async function signOut() {
    await authClient.signOut();
    navigateTo("/");
  }

  return {
    init,
    signIn,
    sendOtp,
    verifyOtp,
    signOut,
    loading,
    user,
  };
});
