// App.jsx: monta a página. O idioma e o "APERTE START" ficam em contextos,
// e cada seção do conteúdo recebe o seu componente (pelo id de sectionsData.js).
import { useState } from "react";
import { LanguageProvider, useLang } from "./context/LanguageContext.jsx";
import { StartProvider } from "./context/StartContext.jsx";
import SITE_CONFIG from "./config/siteConfig.js";
import { SECTIONS } from "./data/sectionsData.js";
import Section from "./components/Section.jsx";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Footer from "./components/Footer.jsx";
import Intro from "./components/Intro.jsx";
import SobreMim from "./components/SobreMim.jsx";
import Projetos from "./components/Projetos.jsx";
import Experiencias from "./components/Experiencias.jsx";
import Contato from "./components/Contato.jsx";

// Componente de cada seção. Seção sem componente aparece como "EM CONSTRUÇÃO".
const COMPONENTS = {
  sobre: SobreMim,
  projetos: Projetos,
  experiencias: Experiencias,
  contato: Contato,
};

// Seções que dependem de configuração somem quando ela está vazia
const sections = SECTIONS.filter((s) => (s.id !== "spotify" || SITE_CONFIG.spotifyEmbed) && (s.id !== "github" || SITE_CONFIG.github));

const SKIP = { pt: "Pular para o conteúdo", en: "Skip to content" };

function Page() {
  const { lang } = useLang();
  const [introOpen, setIntroOpen] = useState(true);

  return (
    <>
      <a className="skiplink" href="#conteudo" inert={introOpen}>{SKIP[lang]}</a>
      {introOpen && <Intro onEnd={() => setIntroOpen(false)} />}
      {/* enquanto a intro está aberta, o resto da página fica inerte */}
      <Header sections={sections} inert={introOpen} />
      <main id="conteudo" tabIndex={-1} inert={introOpen}>
        <Hero />
        {sections.map((s) => {
          const Content = COMPONENTS[s.id];
          return <Section key={s.id} section={s}>{Content ? <Content /> : null}</Section>;
        })}
      </main>
      <Footer inert={introOpen} />
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <StartProvider>
        <Page />
      </StartProvider>
    </LanguageProvider>
  );
}
