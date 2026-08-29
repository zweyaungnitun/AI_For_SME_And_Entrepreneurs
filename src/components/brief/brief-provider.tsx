"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { buildBriefFromMemos } from "@/lib/brief/build-from-memos";
import { composeAnalyzePrompt, DEMO_SNAPSHOT } from "@/lib/brief/demo-data";
import { runCrewStream } from "@/lib/brief/run-crew";
import type { BusinessSnapshot, FinancialInputs } from "@/lib/brief/types";
import type { BusinessContext } from "@/lib/agents/types";

const STORAGE_KEY = "sme-copilot-brief";

type AnalyzeStatus = "idle" | "running" | "done";

type BriefContextValue = {
  snapshot: BusinessSnapshot;
  status: AnalyzeStatus;
  error: string | null;
  mode: "demo" | "llm";
  sessionId?: string;
  streamingReply: string;
  setContext: (patch: Partial<BusinessContext>) => void;
  setFinancials: (patch: Partial<FinancialInputs>) => void;
  analyze: (message?: string, onToken?: (text: string) => void) => Promise<string>;
  reset: () => void;
};

const BriefContext = createContext<BriefContextValue | null>(null);

function loadSnapshot(): BusinessSnapshot {
  if (typeof window === "undefined") return DEMO_SNAPSHOT;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return DEMO_SNAPSHOT;
    return { ...DEMO_SNAPSHOT, ...JSON.parse(raw) } as BusinessSnapshot;
  } catch {
    return DEMO_SNAPSHOT;
  }
}

export function BriefProvider({ children }: { children: React.ReactNode }) {
  const [snapshot, setSnapshot] = useState<BusinessSnapshot>(DEMO_SNAPSHOT);
  const [hydrated, setHydrated] = useState(false);
  const [status, setStatus] = useState<AnalyzeStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"demo" | "llm">("demo");
  const [sessionId, setSessionId] = useState<string>();
  const [streamingReply, setStreamingReply] = useState("");

  useEffect(() => {
    setSnapshot(loadSnapshot());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  }, [snapshot, hydrated]);

  const setContext = useCallback((patch: Partial<BusinessContext>) => {
    setSnapshot((s) => ({ ...s, context: { ...s.context, ...patch } }));
  }, []);

  const setFinancials = useCallback((patch: Partial<FinancialInputs>) => {
    setSnapshot((s) => ({ ...s, financials: { ...s.financials, ...patch } }));
  }, []);

  const analyze = useCallback(
    async (message?: string, onToken?: (text: string) => void) => {
      if (status === "running") return "";
      setStatus("running");
      setError(null);
      setStreamingReply("");

      const prompt = message?.trim() || composeAnalyzePrompt(snapshot);
      let acc = "";
      let lastReply = "";

      await runCrewStream(
        { message: prompt, sessionId, context: snapshot.context },
        (event) => {
          if (event.type === "error") {
            setError("Unable to analyze the business right now. Please try again.");
            return;
          }
          if (event.type === "session") {
            setSessionId(event.sessionId);
            setMode(event.mode);
          }
          if (event.type === "token") {
            acc += event.text;
            setStreamingReply(acc);
            onToken?.(acc);
          }
          if (event.type === "done") {
            lastReply = event.reply || acc;
            setSnapshot((current) =>
              buildBriefFromMemos(event.memos, event.reply, current),
            );
            setStreamingReply(lastReply);
            onToken?.(lastReply);
          }
        },
      );

      setStatus("done");
      return lastReply;
    },
    [sessionId, snapshot, status],
  );

  const reset = useCallback(() => {
    setSnapshot(DEMO_SNAPSHOT);
    setStatus("idle");
    setError(null);
    setStreamingReply("");
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      snapshot,
      status,
      error,
      mode,
      sessionId,
      streamingReply,
      setContext,
      setFinancials,
      analyze,
      reset,
    }),
    [
      snapshot,
      status,
      error,
      mode,
      sessionId,
      streamingReply,
      setContext,
      setFinancials,
      analyze,
      reset,
    ],
  );

  return <BriefContext.Provider value={value}>{children}</BriefContext.Provider>;
}

export function useBrief() {
  const ctx = useContext(BriefContext);
  if (!ctx) throw new Error("useBrief must be used inside BriefProvider");
  return ctx;
}
