import { and, eq, isNull } from "drizzle-orm";
import { z } from "zod";

import db from "~/lib/db";
import { deck } from "~/lib/db/schema";

const BodySchema = z.object({
  isPublic: z.boolean(),
});

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "Missing slug" });
  }

  const body = await readValidatedBody(event, BodySchema.parse);

  const found = await db.query.deck.findFirst({
    where: and(eq(deck.slug, slug), isNull(deck.deletedAt)),
    columns: { id: true, ownerUserId: true, anonOwnerToken: true },
  });

  if (!found) {
    throw createError({ statusCode: 404, statusMessage: "Deck not found" });
  }

  if (!isDeckOwner(event, found)) {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }

  await db
    .update(deck)
    .set({ isPublic: body.isPublic })
    .where(eq(deck.id, found.id));

  return { isPublic: body.isPublic };
});
