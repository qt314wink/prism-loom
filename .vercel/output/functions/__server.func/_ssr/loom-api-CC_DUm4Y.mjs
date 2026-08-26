import { i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-yVh5aYtX.mjs";
import { a as PLATE_BY_ID, s as authMiddleware } from "./plates-C7M5RyGg.mjs";
import { join } from "node:path";
import { readFile } from "node:fs/promises";
//#region node_modules/.nitro/vite/services/ssr/assets/loom-api-CC_DUm4Y.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var listLooms_createServerFn_handler = createServerRpc({
	id: "3e3baa55764a723a1e615f520d21153aac81f2f94ae3443312b91e62cd91ddb9",
	name: "listLooms",
	filename: "src/lib/loom-api.ts"
}, (opts) => listLooms.__executeServer(opts));
var listLooms = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listLooms_createServerFn_handler, async ({ context }) => {
	return (await getSql())`select id, title, sequence_json, motion_id, created_at from looms where user_id = ${context.userId} order by created_at desc`;
});
var saveLoom_createServerFn_handler = createServerRpc({
	id: "9b4abe1b7bbeb2637fae46c38613a2ad12a1a6af5acfbcd4c4cd6aeee8bca16a",
	name: "saveLoom",
	filename: "src/lib/loom-api.ts"
}, (opts) => saveLoom.__executeServer(opts));
var saveLoom = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	title: input.title.trim().slice(0, 80) || "Untitled loom",
	sequence: input.sequence.slice(0, 16),
	motionId: input.motionId.slice(0, 40)
})).handler(saveLoom_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const id = crypto.randomUUID();
	await sql`insert into looms (id, user_id, title, sequence_json, motion_id)
      values (${id}, ${context.userId}, ${data.title}, ${JSON.stringify(data.sequence)}, ${data.motionId})`;
	return {
		ok: true,
		id
	};
});
var forgeKeyframe_createServerFn_handler = createServerRpc({
	id: "5533e0724290a930b3bec20e728320fd69f8f328d3a9b0fda85a634a25f6c40d",
	name: "forgeKeyframe",
	filename: "src/lib/loom-api.ts"
}, (opts) => forgeKeyframe.__executeServer(opts));
var forgeKeyframe = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	plateId: input.plateId,
	prompt: input.prompt.trim().slice(0, 800)
})).handler(forgeKeyframe_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "AI is not available in this environment"
	};
	const plate = PLATE_BY_ID[data.plateId];
	if (!plate) return {
		ok: false,
		error: "Unknown plate"
	};
	if (!data.prompt) return {
		ok: false,
		error: "Prompt required"
	};
	let bytes;
	try {
		bytes = await readFile(join(process.cwd(), "public", plate.src.replace(/^\//, "")));
	} catch {
		return {
			ok: false,
			error: "Could not read plate"
		};
	}
	const b64 = `data:${plate.src.endsWith(".png") ? "image/png" : "image/jpeg"};base64,${bytes.toString("base64")}`;
	const res = await fetch("https://api.x.ai/v1/images/edits", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-imagine-image-2.0",
			prompt: data.prompt,
			image: {
				type: "base64",
				base64: b64
			}
		})
	});
	if (!res.ok) {
		const text = await res.text().catch(() => "");
		return {
			ok: false,
			error: `Imagine error ${res.status}${text ? `: ${text.slice(0, 180)}` : ""}`
		};
	}
	const url = (await res.json()).data?.[0]?.url;
	if (!url) return {
		ok: false,
		error: "No image returned"
	};
	return {
		ok: true,
		url
	};
});
//#endregion
export { forgeKeyframe_createServerFn_handler, listLooms_createServerFn_handler, saveLoom_createServerFn_handler };
