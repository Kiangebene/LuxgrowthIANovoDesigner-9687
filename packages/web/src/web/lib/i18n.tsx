import { createContext, useContext, useState, useEffect } from "react";
type Lang = "fr" | "pt";
const LanguageContext = createContext({
  lang: "fr" as Lang,
  setLang: (_lang: Lang) => {},
  t: (fr: string, _pt: string) => fr,
});
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, set] = useState<Lang>((localStorage.getItem("lux-language") as Lang) || "fr");
  useEffect(() => {document.documentElement.lang=lang;document.title=lang==="fr"?"LuxGrowth AI — Plus de visibilité. Plus de clients.":"LuxGrowth AI — Mais visibilidade. Mais clientes.";},[lang]);
  const setLang = (l: Lang) => {
    set(l);
    localStorage.setItem("lux-language", l);
    document.documentElement.lang = l;
  };
  return (
    <LanguageContext.Provider value={{ lang, setLang, t: (fr, pt) => (lang === "fr" ? fr : pt) }}>
      {children}
    </LanguageContext.Provider>
  );
}
export const useLanguage = () => useContext(LanguageContext);
