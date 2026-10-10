import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Brand } from "./brand";
import { useLanguage } from "../lib/i18n";
import { authClient } from "../lib/auth";
export function Header() {
  const { t, lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const { data: session } = authClient.useSession();
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand />
        <nav className={open ? "open" : ""}>
          {[
            ["Solutions", "Soluções", "solutions"],
            ["Tarifs", "Preços", "tarifs"],
            ["Secteurs", "Setores", "secteurs"],
            ["Ressources", "Recursos", "ressources"],
            ["À propos", "Sobre", "apropos"],
          ].map(([fr, pt, id]) => (
            <a onClick={() => setOpen(false)} key={id} href={`/#${id}`}>
              {t(fr, pt)}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="language"
            onClick={() => setLang(lang === "fr" ? "pt" : "fr")}
            aria-label={t("Changer de langue", "Mudar idioma")}
          >
            {lang.toUpperCase()}
            <span>⌄</span>
          </button>
          <a
            className="button outline small login-link"
            href={session ? "/dashboard" : "/connexion"}
          >
            {session ? t("Mon espace", "Meu painel") : t("Connexion", "Entrar")}
          </a>
          <a className="button small" href={session ? "/dashboard" : "/connexion?mode=signup"}>
            {t("Démarrer", "Começar")}
            <ArrowUpRight size={14} />
          </a>
          <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
