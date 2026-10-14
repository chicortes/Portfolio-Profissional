// Dados do placar do GitHub (usado por components/GitHubStats.jsx).
// Fontes públicas, sem chave: GitHub REST API (perfil e repositórios) e
// github-contributions-api (calendário). As respostas ficam guardadas por
// 30 min na sessão (a API sem token permite 60 consultas por hora).
import { GITHUB_SNAPSHOT as SNAPSHOT } from "../data/gitHubSnapshot.js";
import { store } from "./storage.js";

const CACHE_MS = 30 * 60 * 1000;

async function getJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url} ${r.status}`);
  return r.json();
}

export async function loadGitHub(user) {
  const key = "gh-" + user;
  const cached = store.get(key, true);
  if (cached) { try { const c = JSON.parse(cached); if (Date.now() - c.at < CACHE_MS) return c.data; } catch { /* cache inválido */ } }
  const [profile, repos] = await Promise.all([
    getJSON(`https://api.github.com/users/${user}`),
    getJSON(`https://api.github.com/users/${user}/repos?per_page=100&type=owner`),
  ]);
  let cal = null;
  try { cal = await getJSON(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`); } catch { /* sem calendário */ }
  const own = repos.filter((r) => !r.fork);
  const langs = {};
  own.forEach((r) => { if (r.language) langs[r.language] = (langs[r.language] || 0) + 1; });
  const data = {
    repos: profile.public_repos, followers: profile.followers, since: (profile.created_at || "").slice(0, 4),
    stars: own.reduce((n, r) => n + r.stargazers_count, 0),
    langs: Object.entries(langs).sort((a, b) => b[1] - a[1]),
    days: Array.isArray(cal?.contributions) ? cal.contributions.map((c) => [c.date, c.count, c.level]) : null,
    total: cal?.total ? (cal.total.lastYear ?? Object.values(cal.total).reduce((a, b) => a + b, 0)) : null,
  };
  if (!data.days) { data.days = snapshotData().days; data.total ??= SNAPSHOT.total; }
  store.set(key, JSON.stringify({ at: Date.now(), data }), true);
  return data;
}

// Números salvos em src/data/gitHubSnapshot.js, para quando o GitHub não responde
export function snapshotData() {
  const active = new Map(SNAPSHOT.active.map((d) => [d[0], d]));
  const days = [];
  for (let d = new Date(SNAPSHOT.from + "T12:00:00Z"); d.toISOString().slice(0, 10) <= SNAPSHOT.to; d.setUTCDate(d.getUTCDate() + 1)) {
    const k = d.toISOString().slice(0, 10);
    days.push(active.get(k) || [k, 0, 0]);
  }
  return { repos: SNAPSHOT.repos, followers: SNAPSHOT.followers, stars: SNAPSHOT.stars, since: SNAPSHOT.since, langs: SNAPSHOT.langs, days, total: SNAPSHOT.total };
}
export const snapshotDate = () => SNAPSHOT.at;

// Sequências: dias seguidos com pelo menos uma contribuição
export function streaks(days) {
  const today = new Date().toISOString().slice(0, 10);
  const past = days.filter((d) => d[0] <= today);
  let best = 0, run = 0;
  past.forEach((d) => { run = d[1] > 0 ? run + 1 : 0; best = Math.max(best, run); });
  let cur = 0;
  for (let i = past.length - 1; i >= 0; i--) {
    if (past[i][1] > 0) cur++;
    else if (i === past.length - 1) continue; // hoje ainda sem commit não zera
    else break;
  }
  return { cur, best };
}
