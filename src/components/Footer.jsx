// Footer: rodapé com nome, ano e link para voltar ao topo.
import SITE_CONFIG from "../config/siteConfig.js";
import { useLang } from "../context/LanguageContext.jsx";
import "./Footer.css";

const T = {
  pt: { end: "GAME OVER? Não: continue e fale comigo.", top: "▲ TOPO" },
  en: { end: "GAME OVER? No: keep going and talk to me.", top: "▲ TOP" },
};

export default function Footer({ inert }) {
  const t = T[useLang().lang];
  return (
    <footer id="footer" inert={inert}>
      <div className="bar foot">
        <p><span className="blink" aria-hidden="true">■</span> {t.end}</p>
        <p>© {new Date().getFullYear()} {SITE_CONFIG.fullName}. {t.made}</p>
        <a className="top px" href="#top">{t.top}</a>
      </div>
    </footer>
  );
}
