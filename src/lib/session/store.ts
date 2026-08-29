import type { ChatTurn } from "@/lib/agents/types";

type Session = {
  id: string;
  turns: ChatTurn[];
  createdAt: number;
};

const sessions = new Map<string, Session>();

export function getSession(id?: string) {
  if (id && sessions.has(id)) return sessions.get(id) as Session;
  const session: Session = {
    id: crypto.randomUUID(),
    turns: [],
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
