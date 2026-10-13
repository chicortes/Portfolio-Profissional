// Header: logo 1UP, menu de navegação (gerado das seções) e troca de idioma.
import { useEffect, useState } from "react";
import { useLang } from "../context/LanguageContext.jsx";
import { useStart } from "../context/StartContext.jsx";
import "./Header.css";

const T = {
  pt: { home: "INÍCIO", menu: "Principal" },
  en: { home: "HOME", menu: "Main" },
};

export default function Header({ sections, inert }) {
  const { lang, setLang } = useLang();
  const { pressStart } = useStart();
  const [active, setActive] = useState("top");
  const t = T[lang];
  const links = [{ id: "top", label: t.home }, ...sections.map((s) => ({ id: s.id, label: s.nav[lang] }))];

  // destaca no menu a seção que está na tela
  useEffect(() => {
    const ids = ["top", ...sections.map((s) => s.id)];
    function onScroll() {
      let id = "top";
      ids.forEach((k) => {
        const el = document.getElementById(k);
        if (el && el.offsetParent !== null && el.getBoundingClientRect().top < innerHeight * 0.45) id = k;
      });
      setActive(id);
    }
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => { removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); };
  }, [sections]);

  return (
    <header id="header" inert={inert}>
      <div className="bar">
        <a className="up px" href="#top">1UP</a>
        <nav aria-label={t.menu}>
          {links.map((l) => (
            <a key={l.id} href={`#${l.id}`} className={active === l.id ? "on" : undefined} aria-current={active === l.id ? "location" : undefined}
              onClick={() => { if (l.id !== "top") pressStart(); }}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="tools" role="group" aria-label="Idioma / Language">
          <button type="button" lang="pt-BR" aria-label="Português" aria-pressed={lang === "pt"} onClick={() => setLang("pt")}>PT</button>
          <button type="button" lang="en" aria-label="English" aria-pressed={lang === "en"} onClick={() => setLang("en")}>EN</button>
        </div>
      </div>
    </header>
  );
}
