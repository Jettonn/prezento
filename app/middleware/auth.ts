export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  await authStore.init();
  if (!authStore.user) {
    return navigateTo({
      path: "/",
      query: { redirect: to.fullPath },
    });
  }
});
