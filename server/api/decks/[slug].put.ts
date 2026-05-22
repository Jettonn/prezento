import { and, eq, isNull } from "drizzle-orm";
import { z } from "zod";

import db from "~/lib/db";
import { deck } from "~/lib/db/schema";

const BodySchema = z.object({
  markdown: z.string().max(200_000),
  title: z.string().trim().max(200).nullish(),
});

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "Missing slug" });
  }

  const body = await readValidatedBody(event, BodySchema.parse);

  const found = await db.query.deck.findFirst({
    where: and(eq(deck.slug, slug), isNull(deck.deletedAt)),
    columns: { id: true },
  });

  if (!found) {
    throw createError({ statusCode: 404, statusMessage: "Deck not found" });
  }

  const normalizedTitle = body.title == null
    ? null
    : (body.title.length === 0 ? null : body.title);

  await db
    .update(deck)
    .set({
      markdown: body.markdown,
      title: normalizedTitle,
    })
    .where(eq(deck.id, found.id));

  return { ok: true, savedAt: Date.now() };
});
