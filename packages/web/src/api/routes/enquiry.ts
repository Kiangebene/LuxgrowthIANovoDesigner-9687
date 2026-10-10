import { z } from "zod";
import { base } from "../__core/app";
import { db } from "../database";
import { enquiries } from "../database/schema";
export const enquiry = {
  create: base
    .input(
      z.object({
        name: z.string().min(2).max(100),
        email: z.email(),
        company: z.string().max(100),
        message: z.string().min(5).max(4000),
        type: z.enum(["contact", "demo", "website"]),
      }),
    )
    .handler(async ({ input }) => {
      await db
        .insert(enquiries)
        .values({ ...input, id: crypto.randomUUID(), createdAt: Date.now() });
      return { success: true };
    }),
};
