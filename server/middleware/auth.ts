import { auth } from "~/lib/auth";

export default defineEventHandler(async (event) => {
  if (event.path.startsWith("/app") || event.path.startsWith("/api")) {
    const session = await auth.api.getSession({
      headers: event.headers,
    });

    if (session?.user) {
      event.context.session = session.session;
      event.context.user = session.user;
    }

    if (event.path.startsWith("/app") && !session?.user) {
      await sendRedirect(event, "/", 302);
    }
  }
});
