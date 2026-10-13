// Hero: tela inicial com o nome completo, a frase de apresentação,
// o botão APERTE START e os blocos de tecnologias.
import SITE_CONFIG from "../config/siteConfig.js";
import { useLang } from "../context/LanguageContext.jsx";
import { useStart } from "../context/StartContext.jsx";
import "./Hero.css";

const T = {
  pt: { sub: "Estudante de Engenharia de Software na PUC Minas. Cada projeto é uma fase concluída.", cta: "APERTE START", welcome: "BEM-VINDO!", stack: "Tecnologias que uso" },
  en: { sub: "Software Engineering student at PUC Minas. Every project is a cleared stage.", cta: "PRESS START", welcome: "WELCOME!", stack: "Technologies I use" },
};

const TILES = [
  ["</>", "HTML", "#d9532b"], ["{ }", "CSS", "#2f5bd6"], ["JS", "JS", "#e8cf3c", "#1a1204"],
  ["Ja", "JAVA", "#c8650f"], ["Re", "REACT", "#2a7f94"], ["Git", "GIT", "#d0502a"],
];

export default function Hero() {
  const t = T[useLang().lang];
  const { started, pressStart } = useStart();
  // o nome é quebrado só entre palavras (nunca no meio de uma palavra)
  const words = SITE_CONFIG.fullName.toUpperCase().split(/\s+/);

  function onStart(e) {
    e.preventDefault();
    pressStart(!started);
    document.getElementById("sobre")?.scrollIntoView();
  }

  return (
    <section className="hero" id="top">
      <div className="hero-text">
        <div className="p1 px">PLAYER 1</div>
        <h1>
          {words.map((w, i) => (
            <span key={i}><span className="w">{w}</span>{i < words.length - 1 ? " " : ""}</span>
          ))}
        </h1>
        <p className="sub">{t.sub}</p>
        <a className="btn" id="start" href="#sobre" onClick={onStart}>
          <span className={started ? undefined : "blink"} aria-hidden="true">{started ? "★" : "▶"}</span> {started ? t.welcome : t.cta}
        </a>
      </div>
      <div className="stack" role="list" aria-label={t.stack}>
        {TILES.map(([ic, name, c, txt]) => (
          <div className="tile" role="listitem" key={name}>
            <i style={{ "--c": c, ...(txt ? { "--t": txt } : {}) }} aria-hidden="true">{ic}</i>{name}
          </div>
        ))}
      </div>
    </section>
  );
}
