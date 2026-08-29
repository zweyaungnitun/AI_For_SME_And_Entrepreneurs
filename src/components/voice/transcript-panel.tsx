export type TranscriptTurn = {
  id: string;
  role: "user" | "copilot";
  text: string;
};

export function TranscriptPanel({ turns }: { turns: TranscriptTurn[] }) {
  if (turns.length === 0) {
    return (
      <p className="text-center text-sm text-muted">
        Press Talk, or type a question. Try: “Who should I follow up for payment?”
      </p>
    );
  }

  return (
    <ol className="space-y-3">
      {turns.map((turn) => (
        <li
          key={turn.id}
          className={
            turn.role === "user"
              ? "ml-8 rounded-2xl rounded-br-md bg-primary px-4 py-3 text-sm text-white"
              : "mr-8 rounded-2xl rounded-bl-md border border-border bg-surface px-4 py-3 text-sm text-ink"
          }
        >
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide opacity-70">
            {turn.role === "user" ? "You" : "Copilot"}
          </p>
          <p className="whitespace-pre-wrap leading-relaxed">{turn.text}</p>
        </li>
      ))}
    </ol>
  );
}
