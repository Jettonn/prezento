import type { InferSelectModel } from "drizzle-orm";
import type { H3Event } from "h3";
import type { session, user } from "~/lib/db/schema/auth";

type SessionSelect = InferSelectModel<typeof session>;
type UserSelect = InferSelectModel<typeof user>;

// eslint-disable-next-line ts/consistent-type-definitions
interface AuthenticatedEvent extends H3Event {
  context: H3Event["context"] & {
    session: SessionSelect;
    user: UserSelect;
  };
}

export function defineAuthenticatedEventHandler<T>(
  handler: (event: AuthenticatedEvent) => T | Promise<T>,
) {
  return defineEventHandler(async (event) => {
    if (!event.context.user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    }
    return handler(event as AuthenticatedEvent);
  });
}
