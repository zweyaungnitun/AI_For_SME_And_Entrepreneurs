"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useBrief } from "@/components/brief/brief-provider";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { TranscriptPanel, type TranscriptTurn } from "@/components/voice/transcript-panel";
import { VoiceControls } from "@/components/voice/voice-controls";
import { VoiceVisualizer, type VoiceStatus } from "@/components/voice/voice-visualizer";

type SpeechRec = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: {
    resultIndex: number;
    results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }>;
  }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

function getRecognition(): SpeechRec | null {
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRec;
    webkitSpeechRecognition?: new () => SpeechRec;
  };
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  return Ctor ? new Ctor() : null;
}

function VoiceView() {
  const params = useSearchParams();
  const { analyze } = useBrief();
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [draft, setDraft] = useState("");
  const [turns, setTurns] = useState<TranscriptTurn[]>([]);
  const recRef = useRef<SpeechRec | null>(null);
  const listenBuffer = useRef("");
  const sending = useRef(false);

  useEffect(() => {
    const preset = params.get("prompt");
    if (preset) setDraft(preset);
  }, [params]);

  useEffect(() => {
    return () => {
      recRef.current?.stop();
      window.speechSynthesis?.cancel();
    };
  }, []);

  function talk() {
    const rec = getRecognition();
    if (!rec) {
      setStatus("error");
      return;
    }
    rec.lang = "en-US";
    rec.continuous = true;
    rec.interimResults = true;
    listenBuffer.current = "";
    rec.onresult = (event) => {
      let text = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        text += result[0].transcript;
        if (result.isFinal) {
          listenBuffer.current = `${listenBuffer.current} ${result[0].transcript}`.trim();
        }
      }
      setDraft(listenBuffer.current || text);
    };
    rec.onerror = () => setStatus("error");
    rec.onend = () => undefined;
    recRef.current = rec;
    rec.start();
    setStatus("listening");
  }

  function stop() {
    recRef.current?.stop();
    const text = (listenBuffer.current || draft).trim();
    setStatus("idle");
    if (text) void sendText(text);
  }

  async function sendText(text: string) {
    const message = text.trim();
    if (!message || sending.current) return;
    sending.current = true;
    recRef.current?.stop();
    window.speechSynthesis?.cancel();

    const userTurn: TranscriptTurn = {
      id: `u-${Date.now()}`,
      role: "user",
      text: message,
    };
    const copilotId = `c-${Date.now()}`;
    setTurns((t) => [...t, userTurn, { id: copilotId, role: "copilot", text: "" }]);
    setDraft("");
    listenBuffer.current = "";
    setStatus("processing");

    const reply = await analyze(message, (acc) => {
      setTurns((t) =>
        t.map((turn) => (turn.id === copilotId ? { ...turn, text: acc } : turn)),
      );
    });

    sending.current = false;
    const finalText =
      reply ||
      "Unable to analyze the shop right now. Please try again.";
    setTurns((t) =>
      t.map((turn) => (turn.id === copilotId ? { ...turn, text: finalText } : turn)),
    );
    speak(finalText);
  }

  function speak(text: string) {
    if (!window.speechSynthesis || !text.trim()) {
      setStatus("idle");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text.slice(0, 500));
    utterance.onstart = () => setStatus("speaking");
    utterance.onend = () => setStatus("idle");
    utterance.onerror = () => setStatus("idle");
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Talk to the copilot</h1>
        <p className="mt-1 text-sm text-muted">
          Ask about cash, suppliers, team load, or what not to restock. Text works if the mic is blocked.
        </p>
      </div>
      <VoiceVisualizer status={status} />
      <Card className="min-h-48">
        <TranscriptPanel turns={turns} />
      </Card>
      <VoiceControls
        status={status}
        draft={draft}
        onDraft={setDraft}
        onTalk={talk}
        onStop={stop}
        onSend={() => void sendText(draft)}
      />
    </div>
  );
}

export default function VoicePage() {
  return (
    <AppShell>
      <Suspense fallback={<p className="text-sm text-muted">Loading voice…</p>}>
        <VoiceView />
      </Suspense>
    </AppShell>
  );
}
