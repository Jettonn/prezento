import type { H3Event } from "h3";

type DeckOwnership = {
  ownerUserId: number | null;
  anonOwnerToken: string | null;
};

export function isDeckOwner(event: H3Event, deckRow: DeckOwnership): boolean {
  const userId = event.context.user?.id;
  if (userId && deckRow.ownerUserId === userId) {
    return true;
  }
  if (deckRow.anonOwnerToken) {
    const cookieHash = readAnonTokenHash(event);
    if (cookieHash && cookieHash === deckRow.anonOwnerToken) {
      return true;
    }
  }
  return false;
}
