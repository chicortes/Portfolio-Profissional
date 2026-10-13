// Experiências: tipo, período, cargo, instituição, descrição e tecnologias.
// As atuais aparecem primeiro, depois da mais recente para a mais antiga.
import { EXPERIENCES } from "../data/experiencesData.js";
import { useLang } from "../context/LanguageContext.jsx";
import { fmtMonth } from "../lib/format.js";
import "./Experiencias.css";

const T = {
  pt: {
    present: "ATUAL", tech: "Tecnologias usadas",
    types: { estagio: "ESTÁGIO", emprego: "EMPREGO", freela: "FREELA", opensource: "OPEN SOURCE", evento: "EVENTO", academico: "ACADÊMICO", voluntario: "VOLUNTÁRIO" },
  },
  en: {
    present: "PRESENT", tech: "Technologies used",
    types: { estagio: "INTERNSHIP", emprego: "JOB", freela: "FREELANCE", opensource: "OPEN SOURCE", evento: "EVENT", academico: "ACADEMIC", voluntario: "VOLUNTEER" },
  },
};

export default function Experiencias() {
  const { lang } = useLang();
  const t = T[lang];
  const xs = [...EXPERIENCES].sort((a, b) => (b.end || "9999").localeCompare(a.end || "9999") || b.start.localeCompare(a.start));

  return (
    <div className="exp">
      {xs.map((x) => {
        const period = x.end && x.end === x.start ? fmtMonth(x.start, lang) : `${fmtMonth(x.start, lang)} – ${x.end ? fmtMonth(x.end, lang) : t.present}`;
        return (
          <article className="card" key={x.org + x.start}>
            <div className="tt"><span>{t.types[x.type] || x.type}</span><span>{period}</span></div>
            <div className="b">
              <h3>{x[lang].role}</h3>
              <p className="org">@ {x.link ? <a href={x.link} target="_blank" rel="noopener noreferrer">{x.org}</a> : x.org}</p>
              <p>{x[lang].desc}</p>
              {x.tech?.length > 0 && (
                <ul className="tags" aria-label={t.tech}>{x.tech.map((s) => <li key={s}>{s}</li>)}</ul>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
