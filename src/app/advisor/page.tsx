"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  flagged?: boolean;
};

const QUICK_PROMPTS = [
  "What should I focus on this week?",
  "How can I improve my cash flow?",
  "Help me analyze my inventory",
  "What are my biggest business risks?",
];

const GUARDRAILS = {
  maxMessageLength: 1000,
  minMessageLength: 3,
  blockedTopics: [
    "loan approval",
    "guarantee profit",
    "illegal",
    "gambling",
    "cryptocurrency investment advice",
  ],
  rateLimit: {
    maxMessagesPerMinute: 10,
    maxMessagesPerHour: 50,
  },
};

export default function AdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your Foundry AI Business Advisor. I can help you with financial planning, inventory management, market analysis, and strategic decisions for your Myanmar SME. What would you like to discuss today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messageCount, setMessageCount] = useState({ minute: 0, hour: 0, lastMinute: Date.now() });

  function validateInput(text: string): { valid: boolean; error?: string } {
    // Length check
    if (text.length < GUARDRAILS.minMessageLength) {
      return { valid: false, error: "Message too short. Please provide more details." };
    }
    if (text.length > GUARDRAILS.maxMessageLength) {
      return {
        valid: false,
        error: `Message too long. Please keep it under ${GUARDRAILS.maxMessageLength} characters.`,
      };
    }

    // Content check
    const lowerText = text.toLowerCase();
    for (const topic of GUARDRAILS.blockedTopics) {
      if (lowerText.includes(topic)) {
        return {
          valid: false,
          error:
            "I cannot provide advice on this topic. Please focus on operational business decisions, financial planning, or market analysis.",
        };
      }
    }

    return { valid: true };
  }

  function checkRateLimit(): { allowed: boolean; error?: string } {
    const now = Date.now();
    const minuteElapsed = now - messageCount.lastMinute > 60000;

    if (minuteElapsed) {
      setMessageCount({ minute: 1, hour: messageCount.hour + 1, lastMinute: now });
      return { allowed: true };
    }

    if (messageCount.minute >= GUARDRAILS.rateLimit.maxMessagesPerMinute) {
      return {
        allowed: false,
        error: "Too many messages. Please wait a moment before sending another message.",
      };
    }

    if (messageCount.hour >= GUARDRAILS.rateLimit.maxMessagesPerHour) {
      return {
        allowed: false,
        error: "Hourly message limit reached. Please try again later.",
      };
    }

    setMessageCount((prev) => ({ ...prev, minute: prev.minute + 1, hour: prev.hour + 1 }));
    return { allowed: true };
  }

  async function handleSend(text: string) {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    // Validate input
    const validation = validateInput(trimmedText);
    if (!validation.valid) {
      setError(validation.error || "Invalid input");
      return;
    }

    // Check rate limit
    const rateCheck = checkRateLimit();
    if (!rateCheck.allowed) {
      setError(rateCheck.error || "Rate limit exceeded");
      return;
    }

    setError(null);
    setInput("");

    // Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmedText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    // Simulate AI response
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: generateSafeResponse(trimmedText),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setError("Failed to get response. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function generateSafeResponse(query: string): string {
    const lower = query.toLowerCase();

    // Safety check
    if (
      lower.includes("guarantee") ||
      lower.includes("promise") ||
      lower.includes("sure profit")
    ) {
      return "I cannot guarantee specific outcomes or promise profits. Business involves risks, and results depend on many factors. However, I can help you analyze your current situation and suggest strategies based on data.";
    }

    // Contextual responses
    if (lower.includes("cash") || lower.includes("flow")) {
      return "Based on your current financial data, I recommend focusing on: (1) Collecting overdue receivables within 7 days, (2) Negotiating extended payment terms with key suppliers, and (3) Reducing slow-moving inventory. Would you like me to analyze specific transactions?";
    }

    if (lower.includes("inventory") || lower.includes("stock")) {
      return "I can help you analyze your inventory turnover. From your data, items sitting longer than 30 days are tying up working capital. Consider: (1) Promotional pricing for slow-movers, (2) Adjusting reorder quantities, and (3) Focusing on high-turnover products.";
    }

    if (lower.includes("market") || lower.includes("competition")) {
      return "For market analysis, consider: (1) Your pricing compared to competitors in your area, (2) Customer concentration (are you too dependent on few buyers?), and (3) New customer acquisition opportunities. Would you like me to dive deeper into any of these areas?";
    }

    return "I can help you with financial planning, inventory management, market analysis, and strategic decisions. For the best advice, please share specific details about your business situation or ask about a particular challenge you're facing.";
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">AI Business Advisor</h1>
          <p className="mt-1 text-sm text-muted">
            Get personalized advice and strategic guidance for your SME
          </p>
        </div>

        {/* Guardrail Notice */}
        <Card>
          <div className="flex items-start gap-3">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-amber-100 text-xl dark:bg-amber-900/30">
              🛡️
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold">Safe & Responsible AI</p>
              <p className="text-xs text-muted">
                This advisor provides operational guidance based on your business data. It cannot
                approve loans, guarantee outcomes, or provide investment advice. All suggestions
                should be validated with your own judgment and professional advisors.
              </p>
            </div>
          </div>
        </Card>

        {/* Messages */}
        <Card>
          <div className="space-y-4">
            <div className="max-h-[500px] space-y-4 overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      AI
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    {msg.flagged && (
                      <p className="mt-2 text-xs opacity-70">⚠️ Content moderated</p>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-muted text-sm font-bold">
                      You
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    AI
                  </div>
                  <div className="rounded-2xl bg-muted px-4 py-3">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/40 [animation-delay:0ms]" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/40 [animation-delay:150ms]" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/40 [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Quick Prompts */}
        {messages.length <= 1 && (
          <div className="grid gap-2 sm:grid-cols-2">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <Button
                key={idx}
                variant="secondary"
                onClick={() => handleSend(prompt)}
                className="h-auto justify-start whitespace-normal py-3 text-left text-sm"
                disabled={loading}
              >
                {prompt}
              </Button>
            ))}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-900/10">
            <p className="text-sm text-red-900 dark:text-red-300">⚠️ {error}</p>
          </div>
        )}

        {/* Input */}
        <Card>
          <div className="space-y-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(input);
                }
              }}
              placeholder="Ask about your business, finances, inventory, or strategy... (Press Enter to send)"
              className="min-h-[100px] w-full resize-none rounded-lg border border-border bg-background p-3 text-sm outline-none focus:border-primary"
              disabled={loading}
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted">
                {input.length}/{GUARDRAILS.maxMessageLength} characters
              </p>
              <Button onClick={() => handleSend(input)} disabled={loading || !input.trim()}>
                {loading ? "Thinking..." : "Send Message"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Usage Stats */}
        <div className="rounded-lg border border-border bg-muted/20 p-4">
          <p className="text-xs text-muted">
            Messages this session: {messages.filter((m) => m.role === "user").length} · Rate limit:{" "}
            {messageCount.minute}/{GUARDRAILS.rateLimit.maxMessagesPerMinute} per minute
          </p>
        </div>
      </div>
    </AppShell>
  );
}
