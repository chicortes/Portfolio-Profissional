// Seções do portfólio, na ordem em que aparecem na página e no menu.
// O componente de cada seção é ligado em src/main.js (pelo id).
export const SECTIONS = [
  {
    id: "sobre",
    nav: { pt: "SOBRE", en: "ABOUT" },
    title: { pt: "SOBRE MIM", en: "ABOUT ME" },
  },
  {
    id: "projetos",
    nav: { pt: "PROJETOS", en: "PROJECTS" },
    title: { pt: "PROJETOS", en: "PROJECTS" },
    lead: { pt: "Linha do tempo do primeiro projeto ao mais recente.", en: "A timeline from my first project to the latest." },
  },
  {
    id: "github",
    nav: { pt: "GITHUB", en: "GITHUB" },
    title: { pt: "PLACAR DO GITHUB", en: "GITHUB SCOREBOARD" },
    lead: { pt: "Números ao vivo do meu perfil no GitHub.", en: "Live numbers from my GitHub profile." },
  },
  {
    id: "experiencias",
    nav: { pt: "EXPERIÊNCIAS", en: "EXPERIENCE" },
    title: { pt: "EXPERIÊNCIAS", en: "EXPERIENCE" },
    lead: { pt: "Estágios, freelas, open source e eventos técnicos, do mais recente ao mais antigo.", en: "Internships, freelance work, open source and tech events, most recent first." },
  },
  {
    id: "spotify",
    nav: { pt: "SPOTIFY", en: "SPOTIFY" },
    title: { pt: "SPOTIFY", en: "SPOTIFY" },
    lead: { pt: "A trilha sonora de quem programa: o que eu ouço enquanto escrevo código.", en: "A coder's soundtrack: what I listen to while writing code." },
  },
  {
    id: "contato",
    nav: { pt: "CONTATO", en: "CONTACT" },
    title: { pt: "CONTATO", en: "CONTACT" },
    lead: { pt: "Vaga de estágio, projeto ou só um oi: escolha um canal ou deixe uma mensagem no formulário.", en: "Internship, project or just saying hi: pick a channel or leave a message in the form." },
  },
  {
    id: "jogos",
    nav: { pt: "JOGOS", en: "GAMES" },
    title: { pt: "JOGOS", en: "GAMES" },
    lead: { pt: "Fim da fase. Hora do bônus: clique na tela ou aperte espaço para voar.", en: "Stage clear. Bonus round: click the screen or press space to fly." },
  },
];
