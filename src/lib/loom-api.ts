import { createServerFn } from "@tanstack/react-start";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { PLATE_BY_ID, type PlateId } from "@/lib/plates";

export const listLooms = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<{
      id: string;
      title: string;
      sequence_json: string;
      motion_id: string;
      created_at: string;
    }>`select id, title, sequence_json, motion_id, created_at from looms where user_id = ${context.userId} order by created_at desc`;
  });

export const saveLoom = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { title: string; sequence: PlateId[]; motionId: string }) => ({
    title: input.title.trim().slice(0, 80) || "Untitled loom",
    sequence: input.sequence.slice(0, 16),
    motionId: input.motionId.slice(0, 40),
  }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const id = crypto.randomUUID();
    await sql`insert into looms (id, user_id, title, sequence_json, motion_id)
      values (${id}, ${context.userId}, ${data.title}, ${JSON.stringify(data.sequence)}, ${data.motionId})`;
    return { ok: true as const, id };
  });

export const forgeKeyframe = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { plateId: PlateId; prompt: string }) => ({
    plateId: input.plateId,
    prompt: input.prompt.trim().slice(0, 800),
  }))
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "AI is not available in this environment" };
    const plate = PLATE_BY_ID[data.plateId];
    if (!plate) return { ok: false as const, error: "Unknown plate" };
    if (!data.prompt) return { ok: false as const, error: "Prompt required" };

    let bytes: Buffer;
    try {
      bytes = await readFile(join(process.cwd(), "public", plate.src.replace(/^\//, "")));
    } catch {
      return { ok: false as const, error: "Could not read plate" };
    }
    const mime = plate.src.endsWith(".png") ? "image/png" : "image/jpeg";
    const b64 = `data:${mime};base64,${bytes.toString("base64")}`;

    const res = await fetch("https://api.x.ai/v1/images/edits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-imagine-image-2.0",
        prompt: data.prompt,
        image: { type: "base64", base64: b64 },
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { ok: false as const, error: `Imagine error ${res.status}${text ? `: ${text.slice(0, 180)}` : ""}` };
    }
    const body = (await res.json()) as { data?: { url?: string }[] };
    const url = body.data?.[0]?.url;
    if (!url) return { ok: false as const, error: "No image returned" };
    return { ok: true as const, url };
  });
