// siteConfig.js: dados pessoais e links. Troque pelos seus.
const SITE_CONFIG = {
  firstName: "Francisco",
  fullName: "Francisco de Castro Côrtes Netto",
  period: 2, // período atual do curso (aparece como "LV 02")
  avatar: "https://github.com/chicortes.png", // ou "/img/avatar.jpg" (em public/img)
  cv: { pt: "", en: "" }, // ex.: "/cv/cv-pt.pdf" (em public/cv); vazio esconde o botão

  github: "chicortes", // usuário do placar do GitHub

  links: {
    email: "seuemail@exemplo.com", // TROQUE: seu e-mail
    linkedin: "https://www.linkedin.com/in/seu-usuario", // TROQUE: seu LinkedIn
    github: "https://github.com/chicortes",
    instagram: "", // opcional: vazio esconde o ícone
  },

  // Player do Spotify: no Spotify, abra a playlist/álbum/música > ... >
  // Compartilhar > Incorporar e copie o endereço de dentro do src="...".
  // Vazio esconde a seção.
  spotifyEmbed: "https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator&theme=0",
};

export default SITE_CONFIG;
