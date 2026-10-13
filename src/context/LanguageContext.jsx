// LanguageContext: idioma do site (PT/EN), compartilhado por todos os
// componentes. Cada componente guarda os próprios textos em { pt, en }.
import { createContext, useContext, useEffect, useState } from "react";
import { store } from "../lib/storage.js";

const LanguageContext = createContext({ lang: "pt", setLang: () => {} });

function initialLang() {
  const pick = new URLSearchParams(location.search).get("lang") || store.get("lang") || (navigator.language || "pt").slice(0, 2);
  return pick === "en" ? "en" : "pt";
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(initialLang);
  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
    store.set("lang", lang);
  }, [lang]);
  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>;
}

export const useLang = () => useContext(LanguageContext);
