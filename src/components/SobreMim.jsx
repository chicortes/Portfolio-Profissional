// SobreMim: avatar (PLAYER 1), atributos, botão do Galo, apresentação em
// PT/EN e ficha com formação, área, interesses e objetivo.
import { useState } from "react";
import SITE_CONFIG from "../config/siteConfig.js";
import { ABOUT } from "../data/aboutData.js";
import { SKILLS } from "../data/skillsData.js";
import { useLang } from "../context/LanguageContext.jsx";
import { pad } from "../lib/format.js";
import { GaloButton, GaloPanel } from "./Galo.jsx";
import "./SobreMim.css";

const T = {
  pt: { stats: "ATRIBUTOS", lv: "Período do curso", photo: "Foto de ", of: "de 5", cv: "BAIXAR CURRÍCULO" },
  en: { stats: "STATS", lv: "Course semester", photo: "Photo of ", of: "of 5", cv: "DOWNLOAD RESUME" },
};

const initials = SITE_CONFIG.fullName.split(/\s+/).filter((w) => w.length > 2).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

export default function SobreMim() {
  const { lang } = useLang();
  const t = T[lang], A = ABOUT[lang];
  const [photoOk, setPhotoOk] = useState(Boolean(SITE_CONFIG.avatar));
  const [galoOpen, setGaloOpen] = useState(false);
  const cv = SITE_CONFIG.cv[lang] || SITE_CONFIG.cv.pt;

  return (
    <>
      <div className="about-grid">
        <div className="char">
          <figure className="avatar">
            <div className="pic">
              {photoOk
                ? <img src={SITE_CONFIG.avatar} alt={t.photo + SITE_CONFIG.fullName} onError={() => setPhotoOk(false)} />
                : <span aria-hidden="true">{initials}</span>}
            </div>
            <figcaption><span>PLAYER 1</span><span aria-label={`${t.lv}: ${SITE_CONFIG.period}`}>LV {pad(SITE_CONFIG.period)}</span></figcaption>
          </figure>
          <div>
            <h3 className="mini">{t.stats}</h3>
            <div className="stats">
              {SKILLS.map(([name, level]) => (
                <div className="stat" key={name}>
                  <span>{name}</span>
                  <span className="bar5" role="img" aria-label={`${level} ${t.of}`}>
                    {[1, 2, 3, 4, 5].map((i) => <b key={i} className={i <= level ? "on" : undefined} />)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div id="galo-slot"><GaloButton open={galoOpen} onToggle={() => setGaloOpen((o) => !o)} /></div>
        </div>
        <div className="about">
          {A.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          <dl className="sheet">
            {A.sheet.map(([k, v]) => [<dt key={k + "t"}>{k}</dt>, <dd key={k + "d"}>{v}</dd>])}
          </dl>
          {cv && <a className="btn sm" href={cv} download><span aria-hidden="true">▼</span> {t.cv}</a>}
        </div>
      </div>
      <GaloPanel open={galoOpen} />
    </>
  );
}
