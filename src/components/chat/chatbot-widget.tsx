"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useBrief } from "@/components/brief/brief-provider";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm your SME advisor. Ask me about cash flow, suppliers, market position, or financial planning.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { analyze, snapshot } = useBrief();

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

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-110 hover:shadow-xl"
        aria-label="Open chat"
      >
        <ChatIcon />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex w-96 flex-col rounded-2xl border border-border bg-surface shadow-2xl">
      <div className="flex items-center justify-between border-b border-border bg-primary px-4 py-3 text-white">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-green-400" />
          <div>
            <p className="font-semibold">SME Advisor</p>
            <p className="text-xs opacity-90">{snapshot.context.name}</p>
          </div>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/20"
          aria-label="Close chat"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="flex h-96 flex-col gap-3 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-primary text-white"
                  : "bg-muted text-ink"
              }`}
            >
              {msg.content || <span className="italic opacity-50">Thinking...</span>}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-border p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about your business..."
            disabled={sending}
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-50"
          />
          <Button onClick={handleSend} disabled={sending || !input.trim()} size="sm">
            {sending ? "..." : "Send"}
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted">
          💡 Try: &quot;What should I prioritize today?&quot;
        </p>
      </div>
    </div>
  );
}

function ChatIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
