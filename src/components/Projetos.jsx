// Projetos: linha do tempo do mais antigo ao mais recente. Cada projeto tem
// nome, descrição, tecnologias, link do GitHub e um print ou GIF.
import { useState } from "react";
import { PROJECTS } from "../data/projectsData.js";
import { useLang } from "../context/LanguageContext.jsx";
import { fmtMonth, pad } from "../lib/format.js";
import "./Projetos.css";

const T = {
  pt: { stage: "FASE", latest: "ATUAL", tech: "Tecnologias usadas", shot: "Tela do projeto ", repo: "Código no GitHub", demo: "Ver online" },
  en: { stage: "STAGE", latest: "LATEST", tech: "Technologies used", shot: "Screenshot of ", repo: "Code on GitHub", demo: "Live demo" },
};

function Thumb({ project, alt }) {
  const [ok, setOk] = useState(Boolean(project.img));
  return (
    <div className="thumb">
      <span className="ph" aria-hidden="true">{project.name}</span>
      {ok && <img src={project.img} alt={alt} loading="lazy" decoding="async" onError={() => setOk(false)} />}
    </div>
  );
}

export default function Projetos() {
  const { lang } = useLang();
  const t = T[lang];
  const ordered = [...PROJECTS].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <ol className="tl">
      {ordered.map((p, i) => {
        const last = i === ordered.length - 1;
        return (
          <li key={p.repo} className={last ? "last" : undefined}>
            <article className="proj">
              <Thumb project={p} alt={t.shot + p.name} />
              <div className="pinfo">
                <p className="stage">
                  {t.stage} {pad(i + 1)}{last ? ` ★ ${t.latest}` : ""} <time dateTime={p.date}>{fmtMonth(p.date, lang)}</time>
                </p>
                <h3>{p.name}</h3>
                <p>{p[lang]}</p>
                <p className="ptech"><span className="sr-only">{t.tech}: </span>{p.tech.join(" / ")}</p>
                <p className="links">
                  <a href={p.repo} target="_blank" rel="noopener noreferrer">{t.repo} ▸</a>
                  {p.demo && <a href={p.demo} target="_blank" rel="noopener noreferrer">{t.demo} ▸</a>}
                </p>
              </div>
            </article>
          </li>
        );
      })}
    </ol>
  );
}
