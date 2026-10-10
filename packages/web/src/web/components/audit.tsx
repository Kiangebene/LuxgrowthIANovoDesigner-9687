import { useState } from "react";
import {
  Globe,
  Search,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
  ExternalLink,
} from "lucide-react";
import { useLanguage } from "../lib/i18n";
import { useAudit } from "../queries/platform";
import { Dialog } from "./dialog";
export type AuditResult = {
  url: string;
  title: string;
  score: number;
  elapsed: number;
  size: number;
  checks: { id: string; ok: boolean; value: string }[];
  createdAt: number;
};
const labels: Record<string, [string, string, string, string]> = {
  https: [
    "Connexion sécurisée",
    "Ligação segura",
    "Activez HTTPS pour sécuriser votre site.",
    "Ative HTTPS para proteger o site.",
  ],
  title: [
    "Titre de la page",
    "Título da página",
    "Ajoutez un titre descriptif de 10 à 70 caractères.",
    "Adicione um título descritivo de 10 a 70 caracteres.",
  ],
  description: [
    "Description SEO",
    "Descrição SEO",
    "Rédigez une description de 50 à 170 caractères.",
    "Escreva uma descrição de 50 a 170 caracteres.",
  ],
  h1: [
    "Titre principal H1",
    "Título principal H1",
    "Utilisez un seul titre H1 par page.",
    "Use um único título H1 por página.",
  ],
  mobile: [
    "Adaptation mobile",
    "Adaptação móvel",
    "Ajoutez une balise meta viewport.",
    "Adicione a meta tag viewport.",
  ],
  alt: [
    "Textes alternatifs des images",
    "Textos alternativos das imagens",
    "Décrivez les images avec un attribut alt.",
    "Descreva as imagens com um atributo alt.",
  ],
  canonical: [
    "URL canonique",
    "URL canónico",
    "Définissez une URL canonique.",
    "Defina um URL canónico.",
  ],
  speed: [
    "Temps de récupération HTML",
    "Tempo de obtenção do HTML",
    "Optimisez le temps de réponse du serveur.",
    "Otimize o tempo de resposta do servidor.",
  ],
  social: [
    "Aperçu sur les réseaux",
    "Pré-visualização nas redes",
    "Ajoutez les métadonnées Open Graph.",
    "Adicione metadados Open Graph.",
  ],
  lang: [
    "Langue de la page",
    "Idioma da página",
    "Déclarez la langue dans la balise html.",
    "Declare o idioma na tag html.",
  ],
};
export function AuditReport({ result }: { result: AuditResult }) {
  const { t } = useLanguage();
  return (
    <div className="audit-report">
      <div className="score-summary">
        <div
          className="score-ring"
          style={{ "--score": `${result.score}%` } as React.CSSProperties}
        >
          <strong>
            {result.score}
            <small>/100</small>
          </strong>
        </div>
        <div>
          <span className="eyebrow">
            {t("VOTRE DIAGNOSTIC DIGITAL", "O SEU DIAGNÓSTICO DIGITAL")}
          </span>
          <h3>
            {result.score >= 80
              ? t("De bonnes bases pour grandir.", "Uma boa base para crescer.")
              : t("Du potentiel à exploiter.", "Potencial para aproveitar.")}
          </h3>
          <a href={result.url} target="_blank" rel="noreferrer">
            {result.url}
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
      <p className="muted small-text">
        {t(
          "Audit technique du HTML public. Ne mesure pas le trafic, le classement Google ou les performances JavaScript.",
          "Auditoria técnica do HTML público. Não mede tráfego, posicionamento no Google nem desempenho JavaScript.",
        )}
      </p>
      <div className="audit-checks">
        {result.checks.map((c) => {
          const l = labels[c.id];
          return (
            <div className={`audit-check ${c.ok ? "pass" : "warn"}`} key={c.id}>
              {c.ok ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <div>
                <strong>{t(l[0], l[1])}</strong>
                <p>{c.ok ? c.value : t(l[2], l[3])}</p>
                {!c.ok && <small>{c.value}</small>}
              </div>
              <span>{c.ok ? t("Validé", "Validado") : t("À améliorer", "A melhorar")}</span>
            </div>
          );
        })}
      </div>
      <p className="muted small-text">
        {t(
          "Les résultats sont un instantané de la page analysée.",
          "Os resultados são uma fotografia da página analisada.",
        )}{" "}
        · {new Date(result.createdAt).toLocaleString()}
      </p>
    </div>
  );
}
export function AuditForm({
  compact = false,
  onResult,
}: {
  compact?: boolean;
  onResult?: (r: AuditResult) => void;
}) {
  const { t } = useLanguage();
  const mutation = useAudit();
  const [url, setUrl] = useState("");
  const [report, setReport] = useState<AuditResult | null>(null);
  return (
    <>
      <form
        className={compact ? "audit-form compact" : "audit-form"}
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            const r = await mutation.mutateAsync({ url });
            if (onResult) onResult(r);
            else setReport(r);
          } catch {}
        }}
      >
        <div className="audit-label">
          <span className="audit-search">
            <Search size={24} />
          </span>
          <h3>
            <span>{t("Analyse gratuite", "Análise gratuita")}</span>
            <br />
            {t("de votre site web", "do seu site web")}
          </h3>
        </div>
        {!compact && (
          <p>
            {t(
              "Découvrez en quelques secondes les opportunités d’amélioration de votre visibilité en ligne.",
              "Descubra em segundos oportunidades para melhorar a sua visibilidade online.",
            )}
          </p>
        )}
        <div className="audit-inputs">
          <label className="url-input">
            <Globe size={17} />
            <input
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={t("https://votre-site-web.be", "https://o-seu-site.pt")}
              aria-label={t("Adresse de votre site", "Endereço do seu site")}
            />
          </label>
          <button className="button" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <LoaderCircle className="spin" size={16} />
                {t("Analyse…", "A analisar…")}
              </>
            ) : (
              <>
                {t("Analyser gratuitement", "Analisar gratuitamente")}
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </div>
      </form>
      {mutation.isError && (
        <div className="error audit-error" role="alert">
          {mutation.error.message}
        </div>
      )}
      {report && (
        <Dialog
          title={t("Votre analyse de site", "A análise do seu site")}
          onClose={() => setReport(null)}
          wide
        >
          <AuditReport result={report} />
          <a className="button full" href="/connexion?mode=signup">
            {t("Créer mon espace et conserver mes analyses", "Criar conta e guardar análises")}
            <ArrowRight size={16} />
          </a>
        </Dialog>
      )}
    </>
  );
}
