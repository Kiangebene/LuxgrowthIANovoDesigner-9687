import { CheckCircle2, LoaderCircle, ArrowRight } from "lucide-react";
import { useEnquiry } from "../queries/platform";
import { useLanguage } from "../lib/i18n";
import { Dialog } from "./dialog";
export function EnquiryDialog({
  type,
  onClose,
}: {
  type: "contact" | "demo" | "website";
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const mutation = useEnquiry();
  return (
    <Dialog
      onClose={onClose}
      title={
        type === "demo"
          ? t("Parlons de votre croissance", "Vamos falar do seu crescimento")
          : type === "website"
            ? t("Votre nouveau site commence ici", "O seu novo site começa aqui")
            : t("Contactez notre équipe", "Contacte a nossa equipa")
      }
    >
      {mutation.isSuccess ? (
        <div className="success-state">
          <CheckCircle2 size={48} />
          <h3>{t("Votre demande a été enregistrée.", "O seu pedido foi guardado.")}</h3>
          <p>
            {t(
              "Merci ! Votre demande est disponible pour l’équipe LuxGrowth.",
              "Obrigado! O seu pedido está disponível para a equipa LuxGrowth.",
            )}
          </p>
          <button className="button" onClick={onClose}>
            {t("Terminer", "Concluir")}
          </button>
        </div>
      ) : (
        <>
          <p className="muted">
            {t(
              "Décrivez votre projet. Construisons la prochaine étape, ensemble.",
              "Descreva o seu projeto. Vamos construir o próximo passo, juntos.",
            )}
          </p>
          <form
            className="stack-form"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              mutation.mutate({
                name: String(f.get("name")),
                email: String(f.get("email")),
                company: String(f.get("company")),
                message: String(f.get("message")),
                type,
              });
            }}
          >
            <label>
              {t("Nom complet", "Nome completo")}
              <input aria-label={t("Nom complet", "Nome completo")}
                name="name"
                minLength={2}
                required
                placeholder={t("Votre nom", "O seu nome")}
              />
            </label>
            <label>
              Email
              <input aria-label="Email" name="email" type="email" required placeholder="vous@entreprise.lu" />
            </label>
            <label>
              {t("Entreprise", "Empresa")}
              <input aria-label={t("Entreprise", "Empresa")}
                name="company"
                placeholder={t("Nom de votre entreprise", "Nome da sua empresa")}
              />
            </label>
            <label>
              {t("Votre projet", "O seu projeto")}
              <textarea aria-label={t("Votre projet", "O seu projeto")}
                name="message"
                minLength={5}
                required
                rows={3}
                placeholder={t(
                  "Vos objectifs, votre site, vos besoins…",
                  "Objetivos, site, necessidades…",
                )}
              />
            </label>
            <label className="check-label">
              <input aria-label="Consentement / Consentimento" type="checkbox" required />
              {t(
                "J’accepte le traitement de ces informations pour répondre à ma demande.",
                "Aceito o tratamento destes dados para responder ao meu pedido.",
              )}
            </label>
            {mutation.isError && <div className="error">{mutation.error.message}</div>}
            <button className="button full" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <LoaderCircle className="spin" size={18} />
              ) : (
                <ArrowRight size={18} />
              )}{" "}
              {t("Envoyer ma demande", "Enviar pedido")}
            </button>
          </form>
        </>
      )}
    </Dialog>
  );
}
