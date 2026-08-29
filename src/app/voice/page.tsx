"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useBrief } from "@/components/brief/brief-provider";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mmk } from "@/lib/ledger/types";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

function VoiceView() {
  const params = useSearchParams();
  const { analyze, snapshot } = useBrief();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hello! I'm your SME advisor for ${snapshot.context.name}. I can help you with cash flow, collections, market position, financial planning, and more. What would you like to know?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const preset = params.get("prompt");
    if (preset) setInput(preset);
  }, [params]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || sending) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSending(true);

    const assistantId = `assistant-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "", timestamp: new Date() },
    ]);

    const reply = await analyze(userMessage.content, (acc) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === assistantId ? { ...msg, content: acc } : msg)),
      );
    });

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === assistantId
          ? { ...msg, content: reply || "Unable to analyze right now. Please try again." }
          : msg,
      ),
    );

    setSending(false);
  }

  const quickPrompts = [
    "What should I prioritize today?",
    "Show me my cash position",
    "Who should I collect from first?",
    "Analyze my market position",
  ];

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">AI Business Advisor</h1>
        <p className="text-sm text-muted">
          Ask me anything about {snapshot.context.name} · Cash: {mmk(parseInt(snapshot.financials.cashMmk || "0", 10))}
        </p>
      </div>

      <Card className="flex h-[600px] flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-5 py-3 ${
                  msg.role === "user"
                    ? "bg-primary text-white"
                    : "border border-border bg-surface text-ink"
                }`}
              >
                {msg.role === "assistant" && (
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-70">
                    SME Advisor
                  </p>
                )}
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {msg.content || <span className="italic opacity-50">Thinking...</span>}
                </p>
                <p className="mt-2 text-xs opacity-60">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-border p-4">
          {messages.length === 1 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setInput(prompt)}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted transition-colors hover:border-primary hover:text-primary"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask about cash flow, collections, market analysis..."
              disabled={sending}
              rows={1}
              className="flex-1 resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary disabled:opacity-50"
            />
            <Button
              onClick={handleSend}
              disabled={sending || !input.trim()}
              className="px-6"
            >
              {sending ? "..." : "Send"}
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </Card>
    </div>
  );
}

export default function VoicePage() {
  return (
    <AppShell>
      <Suspense fallback={<p className="text-sm text-muted">Loading advisor...</p>}>
        <VoiceView />
      </Suspense>
    </AppShell>
  );
}
