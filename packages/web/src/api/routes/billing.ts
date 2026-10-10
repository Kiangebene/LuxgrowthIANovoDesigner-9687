import { Autumn } from "autumn-js";
import { z } from "zod";
import { authed } from "../middleware/auth";
const autumn = new Autumn();
export const billing = {
  customer: authed.handler(({ context }) =>
    autumn.customers.getOrCreate({
      customerId: context.user.id,
      name: context.user.name,
      email: context.user.email,
    }),
  ),
  checkout: authed
    .input(
      z.object({
        planId: z.enum([
          "lux_essentiel",
          "lux_croissance",
          "lux_performance",
          "lux_essentiel_annual",
          "lux_croissance_annual",
          "lux_performance_annual",
        ]),
      }),
    )
    .handler(async ({ input, context }) => {
      await autumn.customers.getOrCreate({
        customerId: context.user.id,
        name: context.user.name,
        email: context.user.email,
      });
      return autumn.billing.attach({
        customerId: context.user.id,
        planId: input.planId,
        successUrl: `${process.env.WEBSITE_URL}/dashboard?tab=billing`,
        redirectMode: "always",
      });
    }),
  portal: authed.handler(({ context }) =>
    autumn.billing.openCustomerPortal({
      customerId: context.user.id,
      returnUrl: `${process.env.WEBSITE_URL}/dashboard?tab=billing`,
    }),
  ),
};
