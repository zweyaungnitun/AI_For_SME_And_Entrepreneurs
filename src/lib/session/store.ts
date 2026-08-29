import type { ChatTurn } from "@/lib/agents/types";
import { mergeLedger, seedLedger } from "@/lib/ledger/seed";
import type { Ledger } from "@/lib/ledger/types";
import { DEFAULT_SHOP_ID, isKnownShop } from "@/lib/sme/catalog";

type Session = {
  id: string;
  shopId: string;
  turns: ChatTurn[];
  ledger: Ledger;
  createdAt: number;
};

const sessions = new Map<string, Session>();

/**
 * A crew session is one tenant. Existing sessions never switch shopId.
 * A mismatched client shopId is ignored so one business cannot read another.
 */
export function getSession(id?: string, shopId = DEFAULT_SHOP_ID) {
  if (id && sessions.has(id)) {
    return sessions.get(id) as Session;
  }
  const tenant = isKnownShop(shopId) ? shopId : DEFAULT_SHOP_ID;
  const session: Session = {
    id: crypto.randomUUID(),
    shopId: tenant,
    turns: [],
    ledger: seedLedger(tenant),
    createdAt: Date.now(),
  };
  sessions.set(session.id, session);
  return session;
}

export function appendTurn(id: string, turn: ChatTurn) {
  const session = sessions.get(id);
  if (!session) return getSession(id);
  session.turns.push(turn);
  session.turns = session.turns.slice(-16);
  return session;
}

export function patchLedger(id: string, patch: Partial<Ledger>) {
  const session = sessions.get(id);
  if (!session) return getSession(id);
  session.ledger = mergeLedger(session.ledger, patch);
  return session;
}
