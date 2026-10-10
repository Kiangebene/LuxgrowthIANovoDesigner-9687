import { useState } from "react";
import { Check, ArrowRight, LoaderCircle } from "lucide-react";
import { useLanguage } from "../lib/i18n";
import { authClient } from "../lib/auth";
import { useCheckout } from "../queries/platform";
export function Pricing({
  dashboard = false,
  onWebsite,
}: {
  dashboard?: boolean;
  onWebsite?: () => void;
}) {
  const { t } = useLanguage();
  const [annual, setAnnual] = useState(false);
  const { data: session } = authClient.useSession();
  const checkout = useCheckout();
  const tiers = [
    {
      id: "essentiel",
      name: t("Essentiel", "Essencial"),
      description: t("Site web professionnel", "Site profissional"),
      price: 99,
      features: [
        t("Site web professionnel", "Site profissional"),
        t("1 site inclus", "1 site incluído"),
        t("CRM de base", "CRM básico"),
        t("10 analyses / mois", "10 análises / mês"),
        t("Support par email", "Suporte por email"),
      ],
    },
    {
      id: "croissance",
      name: t("Croissance", "Crescimento"),
      description: t("Site web pro + activité connectée", "Site profissional + negócio conectado"),
      price: 149,
      features: [
        t("Jusqu’à 3 sites", "Até 3 sites"),
        t("CRM avancé", "CRM avançado"),
        t("Automatisations", "Automações"),
        t("30 analyses / mois", "30 análises / mês"),
        t("Support prioritaire", "Suporte prioritário"),
      ],
    },
    {
      id: "performance",
      name: "Performance",
      description: t("Toute votre entreprise, connectée", "Toda a sua empresa, conectada"),
      price: 199,
      features: [
        t("Sites web illimités", "Sites ilimitados"),
        t("CRM complet", "CRM completo"),
        t("Automatisations avancées", "Automações avançadas"),
        t("100 analyses / mois", "100 análises / mês"),
        t("Accompagnement dédié", "Acompanhamento dedicado"),
      ],
    },
  ];
  return (
    <section id="tarifs" className="pricing-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">
            {t("DES SOLUTIONS ADAPTÉES À VOTRE ACTIVITÉ", "SOLUÇÕES ADAPTADAS AO SEU NEGÓCIO")}
          </span>
          <h2>{t("Des plans simples et évolutifs", "Planos simples e evolutivos")}</h2>
          <p>
            {t(
              "Choisissez le plan qui correspond à vos besoins. Grandissez à votre rythme.",
              "Escolha o plano certo para as suas necessidades. Cresça ao seu ritmo.",
            )}
          </p>
        </div>
        <div className="billing-toggle">
          <button className={!annual ? "active" : ""} onClick={() => setAnnual(false)}>
            {t("Mensuel", "Mensal")}
          </button>
          <button className={annual ? "active" : ""} onClick={() => setAnnual(true)}>
            {t("Annuel", "Anual")}
          </button>
          <span>-20%</span>
        </div>
      </div>
      <div className={dashboard ? "pricing-grid dashboard-pricing" : "pricing-grid"}>
        {tiers.map((p, i) => (
          <div className={`price-card ${i === 1 ? "popular" : ""}`} key={p.id}>
            {i === 1 && (
              <span className="popular-tag">{t("Le plus populaire", "Mais popular")}</span>
            )}
            <h3>{p.name}</h3>
            <p className="price-description">{p.description}</p>
            <div className="price">
              <strong>
                €
                {annual
                  ? (p.price * 0.8).toLocaleString("fr-FR", { maximumFractionDigits: 2 })
                  : p.price}
              </strong>
              <span>/{t("mois", "mês")}</span>
            </div>
            <small className="price-note">
              {annual
                ? t(
                    `€${(p.price * 12 * 0.8).toFixed(2)} facturés annuellement`,
                    `€${(p.price * 12 * 0.8).toFixed(2)} faturados anualmente`,
                  )
                : t("Facturation mensuelle", "Faturação mensal")}
            </small>
            <ul>
              {p.features.map((f) => (
                <li key={f}>
                  <Check size={15} />
                  {f}
                </li>
              ))}
            </ul>
            <button
              className={`button full ${i !== 1 ? "outline" : ""}`}
              disabled={checkout.isPending}
              onClick={async () => {
                const planId = `lux_${p.id}${annual ? "_annual" : ""}`;
                if (!session) {
                  window.location.href = `/connexion?mode=signup&plan=${planId}`;
                  return;
                }
                try {
                  const r = await checkout.mutateAsync({ planId: planId as "lux_essentiel" });
                  if (r.paymentUrl) window.location.assign(r.paymentUrl);
                } catch {}
              }}
            >
              {checkout.isPending ? (
                <LoaderCircle className="spin" size={16} />
              ) : (
                <>
                  {t("Choisir ce plan", "Escolher plano")}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        ))}
        {!dashboard && (
          <div className="website-offer">
            <span className="offer-top">
              {t("UN SITE QUI FAIT LA DIFFÉRENCE", "UM SITE QUE FAZ A DIFERENÇA")}
            </span>
            <h3>
              {t("Offre spéciale", "Oferta especial")}
              <br />
              {t("Site web offert", "Site grátis")}
              <span className="gift-icon">＋</span>
            </h3>
            <div className="laptop-art">
              <div className="laptop-screen">
                <div className="tiny-header">
                  LUXGROWTH <span>● ● ●</span>
                </div>
                <div className="tiny-site">
                  <div>
                    <span>
                      VOTRE AVENIR
                      <br />
                      <b>COMMENCE ICI.</b>
                    </span>
                    <i />
                  </div>
                  <div className="tiny-picture" />
                </div>
              </div>
              <div className="laptop-base" />
            </div>
            <p>
              {t(
                "Un site professionnel inclus dans votre abonnement SaaS de 12 mois.",
                "Um site profissional incluído na sua assinatura SaaS de 12 meses.",
              )}
            </p>
            <button className="offer-link" onClick={onWebsite}>
              {t("Découvrir l’offre", "Descobrir oferta")}
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
      {checkout.isError && <div className="error">{checkout.error.message}</div>}
      <p className="pricing-footnote">
        {t(
          "Prix indicatifs en euros, hors taxes. Engagement de 12 mois pour l’offre site inclus. Checkout de test en USD (99 / 149 / 199 USD) : la devise EUR doit être activée dans Autumn avant lancement.",
          "Preços indicativos em euros, sem impostos. Compromisso de 12 meses para a oferta de site incluído. Checkout de teste em USD (99 / 149 / 199 USD): ative EUR no Autumn antes do lançamento.",
        )}
      </p>
    </section>
  );
}
