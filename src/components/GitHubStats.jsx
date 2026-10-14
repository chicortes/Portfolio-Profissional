// GitHubStats: placar do GitHub com repositórios, estrelas, seguidores,
// contribuições, sequências, linguagens e calendário em pixel art.
// Se o GitHub não responder, usa os números de src/data/gitHubSnapshot.js.
import { useEffect, useRef, useState } from "react";
import SITE_CONFIG from "../config/siteConfig.js";
import { useLang } from "../context/LanguageContext.jsx";
import { fill, locale } from "../lib/format.js";
import { loadGitHub, snapshotData, snapshotDate, streaks } from "../lib/githubStats.js";
import "./GitHubStats.css";

const T = {
  pt: {
    repos: "REPOSITÓRIOS", stars: "ESTRELAS", followers: "SEGUIDORES", contrib: "CONTRIBUIÇÕES EM 12 MESES",
    streak: "SEQUÊNCIA ATUAL", best: "MAIOR SEQUÊNCIA", days: "dias", day: "dia",
    langs: "LINGUAGENS DOS REPOSITÓRIOS", cal: "CONTRIBUIÇÕES NO ÚLTIMO ANO", less: "menos", more: "mais",
    loading: "Carregando o placar...", profile: "Ver perfil no GitHub", since: "No GitHub desde {y}",
    contribs: "{n} contribuições em {d}", snapshot: "Mostrando os números salvos em {d}, porque o GitHub não respondeu agora.",
  },
  en: {
    repos: "REPOSITORIES", stars: "STARS", followers: "FOLLOWERS", contrib: "CONTRIBUTIONS IN 12 MONTHS",
    streak: "CURRENT STREAK", best: "LONGEST STREAK", days: "days", day: "day",
    langs: "REPOSITORY LANGUAGES", cal: "CONTRIBUTIONS IN THE LAST YEAR", less: "less", more: "more",
    loading: "Loading the scoreboard...", profile: "View GitHub profile", since: "On GitHub since {y}",
    contribs: "{n} contributions on {d}", snapshot: "Showing numbers saved on {d}, because GitHub didn't respond right now.",
  },
};

// Cores das linguagens mais comuns (as outras usam a paleta do site)
const LANG_COLORS = { Java: "#e76f00", JavaScript: "#f1e05a", HTML: "#e34c26", CSS: "#663399", Python: "#3572a5", TypeScript: "#3178c6", C: "#8b8b8b", "C++": "#f34b7d", "C#": "#178600", PHP: "#4f5d95", Shell: "#89e051", Kotlin: "#a97bff", Dart: "#00b4ab", Go: "#00add8" };
const SPARE = ["#a992e8", "#f0c05a", "#efeaff", "#6b4fc4", "#d9d4ea"];
const LEVELS = ["#2a1b52", "#5a3fa8", "#8f72e0", "#c9a54e", "#f0c05a"];

// 53 colunas (semanas) x 7 linhas (domingo a sábado), como no GitHub
function Calendar({ days, t, lang }) {
  const today = new Date().toISOString().slice(0, 10);
  const list = days.filter((d) => d[0] <= today).slice(-371);
  if (!list.length) return null;
  const first = new Date(list[0][0] + "T12:00:00Z").getUTCDay();
  const cells = [...Array(first).fill(null), ...list];
  const cols = Math.ceil(cells.length / 7), S = 11;
  const fmt = new Intl.DateTimeFormat(locale(lang), { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  return (
    <div className="gh-block">
      <h3 className="mini">{t.cal}</h3>
      <div className="gh-cal">
        <svg viewBox={`0 0 ${cols * S} ${7 * S}`} width={cols * S} height={7 * S} shapeRendering="crispEdges" role="img" aria-label={t.cal}>
          {cells.map((c, i) => c && (
            <rect key={c[0]} x={Math.floor(i / 7) * S} y={(i % 7) * S} width={S - 2} height={S - 2} fill={LEVELS[Math.min(4, c[2] ?? 0)]}>
              <title>{fill(t.contribs, { n: c[1], d: fmt.format(new Date(c[0] + "T12:00:00Z")) })}</title>
            </rect>
          ))}
        </svg>
      </div>
      <p className="gh-legend">{t.less} {LEVELS.map((c) => <i key={c} style={{ background: c }} />)} {t.more}</p>
    </div>
  );
}

export default function GitHubStats() {
  const { lang } = useLang();
  const t = T[lang];
  const user = SITE_CONFIG.github;
  const [data, setData] = useState(null);
  const [fromSnapshot, setFromSnapshot] = useState(false);
  const root = useRef(null);

  // só busca quando a seção chega perto da tela (economiza o limite da API)
  useEffect(() => {
    let active = true;
    const start = () => loadGitHub(user)
      .then((d) => { if (active) setData(d); })
      .catch(() => { if (active) { setData(snapshotData()); setFromSnapshot(true); } }); // GitHub fora: números salvos
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); start(); } }, { rootMargin: "400px" });
    io.observe(root.current);
    return () => { active = false; io.disconnect(); };
  }, [user]);

  const profile = <p className="links"><a href={`https://github.com/${user}`} target="_blank" rel="noopener noreferrer">{t.profile} ▸</a></p>;
  if (!data) return <div className="gh" ref={root} aria-live="polite"><p className="gh-msg"><span className="blink" aria-hidden="true">▶</span> {t.loading}</p></div>;

  const n = new Intl.NumberFormat(locale(lang));
  const st = data.days ? streaks(data.days) : null;
  const days = (v) => <>{n.format(v)} <small>{v === 1 ? t.day : t.days}</small></>;
  const score = [
    [t.repos, n.format(data.repos)],
    [t.stars, n.format(data.stars)],
    [t.followers, n.format(data.followers)],
    ...(data.total != null ? [[t.contrib, n.format(data.total)]] : []),
    ...(st ? [[t.streak, days(st.cur)], [t.best, days(st.best)]] : []),
  ];
  const totalLang = data.langs.reduce((a, l) => a + l[1], 0) || 1;
  let spare = 0;
  const langs = data.langs.map(([name, count]) => ({ name, pct: count / totalLang, color: LANG_COLORS[name] || SPARE[spare++ % SPARE.length] }));

  return (
    <div className="gh" ref={root} aria-live="polite">
      <div className="card gh-board">
        <div className="tt"><span>PLAYER: @{user}</span><span>{data.since ? fill(t.since, { y: data.since }) : ""}</span></div>
        <dl className="gh-score">
          {score.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
        </dl>
      </div>
      {langs.length > 0 && (
        <div className="gh-block">
          <h3 className="mini">{t.langs}</h3>
          <div className="gh-bar" role="img" aria-label={langs.map((l) => `${l.name} ${Math.round(l.pct * 100)}%`).join(", ")}>
            {langs.map((l) => <span key={l.name} style={{ flex: l.pct, background: l.color }} />)}
          </div>
          <ul className="gh-langs">
            {langs.map((l) => <li key={l.name}><i style={{ background: l.color }} />{l.name} <small>{Math.round(l.pct * 100)}%</small></li>)}
          </ul>
        </div>
      )}
      {data.days && <Calendar days={data.days} t={t} lang={lang} />}
      {fromSnapshot && (
        <p className="gh-msg">{fill(t.snapshot, { d: new Intl.DateTimeFormat(locale(lang), { dateStyle: "medium", timeZone: "UTC" }).format(new Date(snapshotDate() + "T12:00:00Z")) })}</p>
      )}
      {profile}
    </div>
  );
}
