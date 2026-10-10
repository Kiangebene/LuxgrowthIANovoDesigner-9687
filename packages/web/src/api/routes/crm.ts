import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import { authed } from "../middleware/auth";
import { db } from "../database";
import { leads } from "../database/schema";
import { Autumn } from "autumn-js";
const autumn = new Autumn();
const crmBase = authed.use(async ({ context, next }) => {
  const { allowed } = await autumn.check({ customerId: context.user.id, featureId: "lux_crm" });
  if (!allowed)
    throw new ORPCError("FORBIDDEN", {
      message: "Le CRM est inclus dans les abonnements payants.",
    });
  return next();
});
const fields = z.object({
  name: z.string().min(2).max(100),
  email: z.email(),
  company: z.string().max(100),
  status: z.enum(["new", "contacted", "qualified", "won"]),
  note: z.string().max(2000),
});
export const crm = {
  list: authed.handler(({ context }) =>
    db.select().from(leads).where(eq(leads.userId, context.user.id)).orderBy(desc(leads.createdAt)),
  ),
  create: crmBase.input(fields).handler(async ({ input, context }) => {
    const [lead] = await db
      .insert(leads)
      .values({ ...input, id: crypto.randomUUID(), userId: context.user.id, createdAt: Date.now() })
      .returning();
    return lead;
  }),
  update: crmBase.input(fields.extend({ id: z.string() })).handler(async ({ input, context }) => {
    const { id, ...data } = input;
    return db
      .update(leads)
      .set(data)
      .where(and(eq(leads.id, id), eq(leads.userId, context.user.id)))
      .returning();
  }),
  remove: crmBase.input(z.object({ id: z.string() })).handler(({ input, context }) =>
    db
      .delete(leads)
      .where(and(eq(leads.id, input.id), eq(leads.userId, context.user.id)))
      .returning(),
  ),
};
