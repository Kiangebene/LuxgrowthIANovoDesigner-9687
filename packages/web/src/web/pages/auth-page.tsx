import { useState } from "react";
import { Redirect } from "wouter";
import { ArrowLeft, ArrowRight, LoaderCircle, ShieldCheck, Eye, EyeOff, Check } from "lucide-react";
import { Brand } from "../components/brand";
import { useLanguage } from "../lib/i18n";
import { authClient } from "../lib/auth";
import { PreviewDashboard } from "../components/preview-dashboard";
export default function AuthPage() {
  const { t, lang, setLang } = useLanguage();
  const [signup, setSignup] = useState(
    new URLSearchParams(window.location.search).get("mode") === "signup",
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const plan = new URLSearchParams(window.location.search).get("plan");
  const destination = plan
    ? `/dashboard?tab=billing&plan=${encodeURIComponent(plan)}`
    : "/dashboard";
  if (session) return <Redirect to={destination} />;
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    const data = new FormData(e.currentTarget);
    try {
      const credentials = {
        email: String(data.get("email")),
        password: String(data.get("password")),
      };
      const r = signup
        ? await authClient.signUp.email({ ...credentials, name: String(data.get("name")) })
        : await authClient.signIn.email(credentials);
      if (r.error)
        setError(
          t(
            "Impossible de continuer. Vérifiez vos informations : ",
            "Não foi possível continuar. Verifique os dados: ",
          ) + (r.error.message ?? ""),
        );
      else window.location.href = destination;
    } catch {
      setError(t("Connexion indisponible. Réessayez.", "Ligação indisponível. Tente novamente."));
    } finally {
      setPending(false);
    }
  }
  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div className="auth-top">
          <Brand />
          <button className="language" onClick={() => setLang(lang === "fr" ? "pt" : "fr")}>
            {lang.toUpperCase()} ⌄
          </button>
        </div>
        <a className="back-link" href="/">
          <ArrowLeft size={16} />
          {t("Retour à l’accueil", "Voltar ao início")}
        </a>
        <div className="auth-content">
          <span className="eyebrow gold">
            {t("VOTRE CROISSANCE COMMENCE ICI", "O SEU CRESCIMENTO COMEÇA AQUI")}
          </span>
          <h1>
            {signup
              ? t("Faisons grandir votre activité.", "Vamos fazer crescer o seu negócio.")
              : t("Heureux de vous retrouver.", "Bom tê-lo de volta.")}
          </h1>
          <p className="muted">
            {signup
              ? t(
                  "Créez votre espace. Vos trois premières analyses sont offertes.",
                  "Crie o seu painel. As primeiras três análises são gratuitas.",
                )
              : t(
                  "Connectez-vous à votre espace LuxGrowth AI.",
                  "Entre no seu painel LuxGrowth AI.",
                )}
          </p>
          <div className="auth-tabs">
            <button
              className={!signup ? "active" : ""}
              onClick={() => {
                setSignup(false);
                setError("");
              }}
            >
              {t("Connexion", "Entrar")}
            </button>
            <button
              className={signup ? "active" : ""}
              onClick={() => {
                setSignup(true);
                setError("");
              }}
            >
              {t("Créer un compte", "Criar conta")}
            </button>
          </div>
          <button
            className="google-button full"
            disabled={pending || isPending}
            onClick={async () => {
              setPending(true);
              setError("");
              try {
                const r = await authClient.managedAuth.signIn({ provider: "google" });
                if (r.error && r.error.code !== "POPUP_CLOSED")
                  setError(
                    r.error.message ??
                      t("Connexion Google impossible.", "Não foi possível entrar com Google."),
                  );
              } catch (e) {
                setError(e instanceof Error ? e.message : "Erreur Google");
              } finally {
                setPending(false);
              }
            }}
          >
            <span className="google-g">G</span>
            {t("Continuer avec Google", "Continuar com Google")}
          </button>
          <div className="divider">
            <span>{t("ou avec votre email", "ou com o seu email")}</span>
          </div>
          <form className="stack-form" onSubmit={submit}>
            {signup && (
              <label>
                {t("Nom complet", "Nome completo")}
                <input aria-label={t("Nom complet", "Nome completo")}
                  name="name"
                  autoComplete="name"
                  minLength={2}
                  required
                  placeholder={t("Votre nom", "O seu nome")}
                />
              </label>
            )}
            <label>
              Email
              <input aria-label="Email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="vous@entreprise.lu"
              />
            </label>
            <label>
              {t("Mot de passe", "Palavra-passe")}
              <div className="password-input">
                <input aria-label={t("Mot de passe", "Palavra-passe")}
                  name="password"
                  type={show ? "text" : "password"}
                  minLength={8}
                  autoComplete={signup ? "new-password" : "current-password"}
                  required
                  placeholder={t("8 caractères minimum", "Mínimo de 8 caracteres")}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  aria-label={t("Afficher le mot de passe", "Mostrar palavra-passe")}
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
            {signup && (
              <label className="check-label">
                <input aria-label="Consentement / Consentimento" required type="checkbox" />
                {t(
                  "J’accepte la création de mon compte et le stockage de mes données.",
                  "Aceito a criação da minha conta e o armazenamento dos meus dados.",
                )}
              </label>
            )}
            {error && (
              <div className="error" role="alert">
                {error}
              </div>
            )}
            <button className="button full" disabled={pending || isPending}>
              {pending ? <LoaderCircle className="spin" size={18} /> : <ArrowRight size={18} />}{" "}
              {signup ? t("Créer mon espace", "Criar o meu painel") : t("Me connecter", "Entrar")}
            </button>
          </form>
          <p className="auth-security">
            <ShieldCheck size={14} />
            {t(
              "Vos données restent dans votre espace privé.",
              "Os seus dados ficam no seu painel privado.",
            )}
          </p>
        </div>
      </div>
      <div className="auth-visual">
        <div className="auth-visual-inner">
          <span className="eyebrow">UNE PLATEFORME. DES RÉSULTATS.</span>
          <h2>
            {t("Plus de visibilité.", "Mais visibilidade.")}
            <br />
            <span>{t("Plus de clients.", "Mais clientes.")}</span>
          </h2>
          <PreviewDashboard large />
          <div className="auth-benefits">
            {[
              t("Vos analyses en un seul endroit", "As análises num só lugar"),
              t("Chaque contact, chaque opportunité", "Cada contacto, cada oportunidade"),
              t(
                "Un abonnement adapté à vos ambitions",
                "Uma assinatura à medida das suas ambições",
              ),
            ].map((v) => (
              <span key={v}>
                <Check size={17} />
                {v}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
