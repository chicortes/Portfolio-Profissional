// Projetos: qualquer ordem, o site ordena do mais antigo ao mais recente pela data (AAAA-MM).
//   img:  print ou GIF do projeto funcionando (telas, login, interações). Salve o
//         arquivo em public/img/projetos/ e escreva "/img/projetos/nome.gif".
//         Vazio ("") mostra um quadro com o nome do projeto.
//   demo: link do projeto publicado (opcional).
const GH = "https://github.com/chicortes/";

export const PROJECTS = [
  {
    name: "Mini Ecommerce",
    date: "2026-05",
    tech: ["HTML", "CSS", "JavaScript"],
    repo: GH + "trabalho-pratico-semana-9-DIW",
    demo: "",
    img: "/img/projetos/miniecomerce.png",
    pt: "Trabalho prático de DIW: loja com cards de produtos montados por JavaScript a partir de dados e uma área de detalhes de cada item.",
    en: "Web development assignment: a store whose product cards are built with JavaScript from data, plus a detail view for each item.",
  },
  {
    name: "API Clima BH",
    date: "2026-08",
    tech: ["Java 21", "Spring Boot", "Maven", "REST", "Open-Meteo"],
    repo: GH + "DIAW-At01",
    demo: "",
    img: "/img/projetos/Apirest.png",
    pt: "API REST em Spring Boot que consulta o Open-Meteo e devolve o clima atual e a previsão dos próximos dias de Belo Horizonte no endpoint /climaBH. Feita em dupla.",
    en: "Spring Boot REST API that queries Open-Meteo and returns Belo Horizonte's current weather and forecast at the /climaBH endpoint. Built in a pair.",
  },
  {
    name: "Portfólio Arcade",
    date: "2026-10",
    tech: ["HTML", "CSS", "JavaScript", "Vite", "EmailJS", "Vercel"],
    repo: GH + "Portfolio-Profissional",
    demo: "",
    img: "/img/projetos/portfolio.png",
    pt: "Este site: portfólio bilíngue com estética de fliperama, placar do GitHub, player do Spotify, calendário do Galo, jogo Flappy Plane e formulário com envio de e-mail.",
    en: "This site: a bilingual arcade-style portfolio with a GitHub scoreboard, Spotify player, Atlético match calendar, a Flappy Plane game and a working email form.",
  },
  {
    name: "Práticas de Programação Modular",
    date: "2026-10",
    tech: ["Java", "POO"],
    repo: GH + "PM-Praticas",
    demo: "",
    img: "",
    pt: "Exercícios práticos da disciplina de Programação Modular, aplicando encapsulamento, classes e responsabilidades bem divididas em Java.",
    en: "Hands-on exercises from the Modular Programming course, applying encapsulation, classes and well-split responsibilities in Java.",
  },
];
