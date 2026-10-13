// Section: título, texto de abertura e conteúdo de uma seção do portfólio.
import { useLang } from "../context/LanguageContext.jsx";
import "./Section.css";

const WIP = { pt: "", en: "" };

export default function Section({ section, children }) {
  const { lang } = useLang();
  return (
    <section id={section.id} aria-labelledby={`h-${section.id}`}>
      <h2 id={`h-${section.id}`}>{section.title[lang]}</h2>
      {section.lead && <p className="lead">{section.lead[lang]}</p>}
      <div className="section-body">
        {children ?? (
          <p className="wip"><span className="blink" aria-hidden="true">▶</span> {WIP[lang]}</p>
        )}
      </div>
    </section>
  );
}