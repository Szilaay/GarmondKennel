import { query } from "@/lib/db";
import { ensureDatabaseSchema } from "@/lib/schema";

export async function GET() {
  try {
    await ensureDatabaseSchema();
    await query("SELECT 1");
    return Response.json({ status: "ok", database: "connected" });
  } catch {
    return Response.json({ status: "error", database: "unavailable" }, { status: 503 });
  }
}
