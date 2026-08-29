import { specialists } from "@/lib/agents/registry";

export async function GET() {
  return Response.json({
    conductor: {
      id: "conductor",
      name: "Conductor",
      title: "Routes, sequences, synthesizes",
      blurb: "Reads the shop snapshot, keeps Finance first, and writes one next-best-action brief.",
    },
    specialists: specialists.map((a) => ({
      id: a.id,
      name: a.name,
      title: a.title,
      blurb: a.blurb,
      accent: a.accent,
      tools: a.tools,
    })),
  });
}
