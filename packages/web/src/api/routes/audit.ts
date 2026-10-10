import { z } from "zod";
import { ORPCError } from "@orpc/server";
import { lookup } from "node:dns/promises";
import { load } from "cheerio";
import { eq, desc } from "drizzle-orm";
import { db } from "../database";
import { audits } from "../database/schema";
import { withUser, authed } from "../middleware/auth";
import { Autumn } from "autumn-js";
const autumn = new Autumn();
const rate = new Map<string, number[]>();
async function safeUrl(raw: string) {
  const u = new URL(raw);
  if (
    !["https:", "http:"].includes(u.protocol) ||
    u.username ||
    u.password ||
    (u.port && !["80", "443"].includes(u.port))
  )
    throw new Error("URL publique HTTP/HTTPS requise.");
  const host = u.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".local") || host.endsWith(".internal"))
    throw new Error("Adresse privée interdite.");
  const ips = await lookup(host, { all: true });
  for (const { address } of ips) {
    if (address.includes(":")) {
      if (!/^2[0-9a-f]{3}:/i.test(address)) throw new Error("Adresse privée interdite.");
    } else {
      const [a, b] = address.split(".").map(Number);
      if (
        a === 0 ||
        a === 10 ||
        a === 127 ||
        a >= 224 ||
        (a === 169 && b === 254) ||
        (a === 172 && b >= 16 && b <= 31) ||
        (a === 192 && b === 168) ||
        (a === 100 && b >= 64 && b <= 127) ||
        (a === 198 && (b === 18 || b === 19))
      )
        throw new Error("Adresse privée interdite.");
    }
  }
  return u;
}
export const audit = {
  run: withUser
    .input(z.object({ url: z.string().min(3).max(2048) }))
    .handler(async ({ input, context }) => {
      const key =
        context.user?.id ?? context.headers.get("x-forwarded-for")?.split(",")[0] ?? "anonymous";
      const now = Date.now();
      const recent = (rate.get(key) ?? []).filter((t) => now - t < 3600000);
      if (recent.length >= 10)
        throw new ORPCError("TOO_MANY_REQUESTS", {
          message: "Limite horaire atteinte. Réessayez plus tard.",
        });
      rate.set(key, [...recent, now]);
      if (context.user) {
        const check = await autumn.check({ customerId: context.user.id, featureId: "lux_audits" });
        if (!check.allowed)
          throw new ORPCError("FORBIDDEN", {
            message: "Quota d’analyses atteint. Choisissez un abonnement.",
          });
      }
      try {
        let u = await safeUrl(/^https?:\/\//i.test(input.url) ? input.url : `https://${input.url}`);
        const started = Date.now();
        let res: Response | undefined;
        for (let i = 0; i < 5; i++) {
          res = await fetch(u, {
            redirect: "manual",
            signal: AbortSignal.timeout(12000),
            headers: { "User-Agent": "LuxGrowthAudit/1.0" },
          });
          if (res.status >= 300 && res.status < 400) {
            const loc = res.headers.get("location");
            if (!loc) throw new Error("Redirection invalide.");
            await res.body?.cancel();
            u = await safeUrl(new URL(loc, u).href);
          } else break;
        }
        if (!res?.ok) throw new Error(`Site inaccessible (HTTP ${res?.status}).`);
        if (!res.headers.get("content-type")?.includes("text/html"))
          throw new Error("Cette adresse ne renvoie pas de page HTML.");
        const reader = res.body!.getReader();
        let size = 0;
        const chunks: Uint8Array[] = [];
        while (true) {
          const part = await reader.read();
          if (part.done) break;
          size += part.value.length;
          if (size > 2_000_000) {
            await reader.cancel();
            throw new Error("Page trop volumineuse (limite 2 Mo).");
          }
          chunks.push(part.value);
        }
        const html = Buffer.concat(chunks).toString("utf8");
        const $ = load(html);
        const elapsed = Date.now() - started;
        const title = $("title").first().text().trim();
        const description = $('meta[name="description"]').attr("content")?.trim() ?? "";
        const imgs = $("img");
        const altMissing = imgs.filter((_, el) => !$(el).attr("alt")).length;
        const checks = [
          { id: "https", ok: u.protocol === "https:", value: u.protocol.replace(":", "") },
          { id: "title", ok: title.length >= 10 && title.length <= 70, value: title || "—" },
          {
            id: "description",
            ok: description.length >= 50 && description.length <= 170,
            value: description || "—",
          },
          { id: "h1", ok: $("h1").length === 1, value: String($("h1").length) },
          {
            id: "mobile",
            ok: !!$('meta[name="viewport"]').length,
            value: $('meta[name="viewport"]').attr("content") ?? "—",
          },
          { id: "alt", ok: altMissing === 0, value: `${altMissing} / ${imgs.length}` },
          {
            id: "canonical",
            ok: !!$('link[rel="canonical"]').length,
            value: $('link[rel="canonical"]').attr("href") ?? "—",
          },
          { id: "speed", ok: elapsed < 2000, value: `${elapsed} ms` },
          {
            id: "social",
            ok: !!$('meta[property="og:title"]').length,
            value: $('meta[property="og:title"]').attr("content") ?? "—",
          },
          { id: "lang", ok: !!$("html").attr("lang"), value: $("html").attr("lang") ?? "—" },
        ];
        const result = {
          url: u.href,
          title,
          score: Math.round((checks.filter((c) => c.ok).length / checks.length) * 100),
          elapsed,
          size,
          checks,
          createdAt: Date.now(),
        };
        if (context.user) {
          await db
            .insert(audits)
            .values({
              id: crypto.randomUUID(),
              userId: context.user.id,
              url: u.href,
              result: JSON.stringify(result),
              createdAt: Date.now(),
            });
          await autumn.track({ customerId: context.user.id, featureId: "lux_audits", value: 1 });
        }
        return result;
      } catch (e) {
        throw new ORPCError("BAD_REQUEST", {
          message: e instanceof Error ? e.message : "Analyse indisponible.",
        });
      }
    }),
  history: authed.handler(({ context }) =>
    db
      .select()
      .from(audits)
      .where(eq(audits.userId, context.user.id))
      .orderBy(desc(audits.createdAt))
      .limit(50),
  ),
};
