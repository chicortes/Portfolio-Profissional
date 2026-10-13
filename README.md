
---

# 🕹️ Portfólio Arcade 👨‍💻

> [!NOTE]
> Portfólio profissional bilíngue (PT/EN) com estética de fliperama, desenvolvido no Laboratório 01 de DIAW (Engenharia de Software, PUC Minas).

---

## 🚧 Status do Projeto

![Status](https://img.shields.io/badge/Status-Sprint_01_concluída-blue?style=for-the-badge)

---

## 📝 Sobre o Projeto

Website de portfólio profissional de **Francisco de Castro Côrtes Netto**, estudante de Engenharia de Software na PUC Minas. O objetivo é apresentar minha trajetória, habilidades, projetos e formas de contato de maneira moderna e acessível, com uma identidade visual de fliperama: o visitante insere uma ficha, aperta START e passa pelas "fases" da minha carreira.

---

## ✨ Funcionalidades Planejadas

- 👤 **Sobre Mim:** apresentação em português e inglês com formação, área de atuação, interesses e objetivos.
- 🗂️ **Projetos:** linha do tempo do mais antigo ao mais recente, com nome, descrição, tecnologias, link do GitHub e imagem ou GIF.
- 💼 **Experiências:** estágios, freelas, open source e eventos técnicos, com instituição, cargo, período e descrição.
- 📨 **Contato:** ícones clicáveis (e-mail, LinkedIn, GitHub) e formulário com envio por e-mail.

---

## 🛠 Tecnologias Previstas

* **Front-end:** React (componentes `.jsx` com o `.css` ao lado), HTML5, CSS3 e JavaScript
* **Build Tool:** Vite
* **Envio de e-mail:** EmailJS
* **Hospedagem:** Vercel
* **Protótipos:** Figma

---

## 🎨 Protótipos (Figma)

Wireframes de média fidelidade feitos no Figma: [abrir o protótipo]().
---

## 🔧 Como Executar

Pré-requisito: **Node.js 20.19 ou superior**.

```bash
git clone https://github.com/chicortes/Portfolio-Profissional.git
cd Portfolio-Profissional
npm install
npm run dev
```

O site abre em **http://localhost:5173**.

---

## 📂 Estrutura Inicial

```
.
├── index.html              # 🏠 Página única com a <div id="root"> do React
├── vite.config.js          # ⚙️ Vite com o plugin do React
├── package.json            # 📦 Dependências e scripts (dev, build, preview)
├── public/favicon.svg      # 👾 Ícone do site
└── src
    ├── main.jsx            # 🚀 Ponto de entrada
    ├── App.jsx             # 🧩 Monta a página
    ├── App.css             # 🎨 Estilos globais (cores, fontes, botões, cards)
    ├── components          # 🧱 Intro, Header, Hero, Section e Footer (.jsx + .css)
    ├── context             # 🌎 Idioma (PT/EN) e estado do START
    ├── config/siteConfig.js# 🔧 Nome e links
    ├── data/sectionsData.js# 📑 Seções e nomes do menu
    └── lib                 # 🛠️ Formatação, armazenamento e som
```

O layout principal já tem **cabeçalho** (menu com links para as seções e troca PT/EN), **área de conteúdo** com as seções Sobre Mim, Projetos, Experiências e Contato (ainda "em construção") e **rodapé**.

---

## 👥 Autores

| 👤 Nome | :octocat: GitHub |
|---------|-----------------|
| Francisco de Castro Côrtes Netto | [@chicortes](https://github.com/chicortes) |

---

## 📄 Licença

Este projeto é distribuído sob a **[Licença MIT](./LICENSE)**.
