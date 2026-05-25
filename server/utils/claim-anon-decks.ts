import type { H3Event } from "h3";
import { and, eq, isNull } from "drizzle-orm";

import db from "~/lib/db";
import { deck } from "~/lib/db/schema";

export async function claimAnonDecksForUser(event: H3Event, userId: number): Promise<void> {
  const hash = readAnonTokenHash(event);
  if (!hash)
    return;

  await db
    .update(deck)
    .set({ ownerUserId: userId, anonOwnerToken: null })
    .where(and(eq(deck.anonOwnerToken, hash), isNull(deck.ownerUserId)));

  clearAnonCookie(event);
}
