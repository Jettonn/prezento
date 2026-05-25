import { z } from "zod";

import db from "~/lib/db";
import { deck } from "~/lib/db/schema";
import { deriveDeckTitle } from "~/lib/slides";
import { generateSlug } from "~/lib/slug";

const BodySchema = z.object({
  markdown: z.string().max(200_000),
  title: z.string().trim().max(200).optional(),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, BodySchema.parse);
  const now = Date.now();

  const title = body.title?.length
    ? body.title
    : deriveDeckTitle(body.markdown);

  const signedInUserId = event.context.user?.id ?? null;
  const anonTokenHash = signedInUserId
    ? null
    : getOrIssueAnonToken(event).hash;

  for (let attempt = 0; attempt < 5; attempt++) {
    const slug = generateSlug();
    try {
      await db.insert(deck).values({
        slug,
        title: title ?? null,
        markdown: body.markdown,
        ownerUserId: signedInUserId,
        anonOwnerToken: anonTokenHash,
        createdAt: now,
        updatedAt: now,
      });
      return { slug };
    }
    catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("UNIQUE") && message.includes("slug"))
        continue;
      throw err;
    }
  }

  throw createError({
    statusCode: 500,
    statusMessage: "Could not allocate a unique slug",
  });
});
