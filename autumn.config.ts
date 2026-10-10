import { feature, plan, item } from "atmn";
const crm = feature({ id: "lux_crm", name: "CRM LuxGrowth", type: "boolean" });
const audits = feature({
  id: "lux_audits",
  name: "Analyses de sites",
  type: "metered",
  consumable: true,
});
const free = plan({
  id: "lux_free",
  name: "Découverte",
  autoEnable: true,
  items: [item({ featureId: audits.id, included: 3, reset: { interval: "month" } })],
});
const tiers = [
  { id: "essentiel", name: "Essentiel", price: 99, audits: 10 },
  { id: "croissance", name: "Croissance", price: 149, audits: 30 },
  { id: "performance", name: "Performance", price: 199, audits: 100 },
];
const plans = tiers.flatMap((t) =>
  [false, true].map((year) =>
    plan({
      id: `lux_${t.id}${year ? "_annual" : ""}`,
      name: `${t.name}${year ? " annuel" : ""}`,
      price: {
        amount: year ? Math.round(t.price * 12 * 0.8 * 100) / 100 : t.price,
        interval: year ? "year" : "month",
      },
      items: [
        item({ featureId: crm.id }),
        item({ featureId: audits.id, included: t.audits, reset: { interval: "month" } }),
      ],
    }),
  ),
);
export default { features: [crm, audits], plans: [free, ...plans] };
