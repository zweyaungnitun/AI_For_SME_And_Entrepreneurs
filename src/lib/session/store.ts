import type { ChatTurn } from "@/lib/agents/types";
import { mergeLedger, seedLedger } from "@/lib/ledger/seed";
import type { Ledger } from "@/lib/ledger/types";
import { DEFAULT_SHOP_ID } from "@/lib/sme/catalog";

type Session = {
  id: string;
  shopId: string;
  turns: ChatTurn[];
  ledger: Ledger;
  createdAt: number;
};

const sessions = new Map<string, Session>();

export function getSession(id?: string, shopId = DEFAULT_SHOP_ID) {
  if (id && sessions.has(id)) {
    const existing = sessions.get(id) as Session;
    if (existing.shopId !== shopId) {
      existing.shopId = shopId;
      existing.ledger = seedLedger(shopId);
    }
    return existing;
  }
  const session: Session = {
    id: crypto.randomUUID(),
    shopId,
    turns: [],
    ledger: seedLedger(shopId),
    createdAt: Date.now(),
  };
  sessions.set(session.id, session);
  return session;
}

export function appendTurn(id: string, turn: ChatTurn) {
  const session = getSession(id);
  session.turns.push(turn);
  session.turns = session.turns.slice(-16);
  return session;
}

export function patchLedger(id: string, patch: Partial<Ledger>) {
  const session = getSession(id);
  session.ledger = mergeLedger(session.ledger, patch);
  return session;
}
