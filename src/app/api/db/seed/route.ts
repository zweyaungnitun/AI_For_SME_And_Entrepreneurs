import { dbConfigured } from "@/lib/config";
import { seedDemoData } from "@/lib/db/ensure";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!dbConfigured()) {
    return Response.json({
      ok: false,
      error: "DATABASE_URL is empty. In-memory demo still runs.",
    });
  }

  const tables = await seedDemoData();
  if (!tables) {
    return Response.json(
      { ok: false, error: "Unable to seed Neon right now." },
      { status: 500 },
    );
  }

  return Response.json({ ok: true, seeded: true });
}