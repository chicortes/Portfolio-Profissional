// Galo: botão com um galo em pixel art (embaixo dos atributos, no Sobre Mim).
// Ao clicar, avisa que sou atleticano e mostra os próximos jogos e o último
// resultado do Atlético Mineiro. Fonte: API pública da ESPN (sem chave, com
// CORS), a mesma usada no portfólio do Prof. João Paulo Aramuni.
import { useEffect, useRef, useState } from "react";
import { useLang } from "../context/LanguageContext.jsx";
import { locale } from "../lib/format.js";
import { chip } from "../lib/sound.js";
import { store, reducedMotion } from "../lib/storage.js";
import PixelArt from "./PixelArt.jsx";
import "./Galo.css";

const T = {
  pt: {
    btn: "MEU TIME", msg: "SOU ATLETICANO! Torço pro Clube Atlético Mineiro. GALO É O MAIOR DE MINAS! 🐓",
    cal: "PRÓXIMOS JOGOS DO GALO", last: "ÚLTIMO JOGO", loading: "Buscando o calendário do Galo...",
    error: "O calendário não carregou agora.", empty: "Nenhum jogo marcado no momento.",
    tbd: "horário a definir", espn: "Calendário completo na ESPN",
  },
  en: {
    btn: "MY TEAM", msg: "I'M AN ATLÉTICO MINEIRO FAN! Go Galo! 🐓",
    cal: "ATLÉTICO'S NEXT MATCHES", last: "LAST MATCH", loading: "Fetching Atlético's schedule...",
    error: "The schedule didn't load right now.", empty: "No matches scheduled right now.",
    tbd: "time TBD", espn: "Full schedule on ESPN",
  },
};

const TEAM_ID = "7632"; // id do Atlético-MG na ESPN
const API = `https://site.api.espn.com/apis/site/v2/sports/soccer/all/teams/${TEAM_ID}/schedule`;
const PAGE = "https://www.espn.com.br/futebol/time/calendario/_/id/7632/atletico-mg";
const NEXT = 5, TZ = "America/Sao_Paulo";

// Galo original em pixel art (não é o escudo do clube)
const GALO = [
  "...R.R.R......",
  "...RRRRR......",
  "....KKKK......",
  "...KWKKKK.....",
  ".YYKKKKKK...K.",
  "..YRKKKK...KK.",
  "...RKKKK..KKKK",
  "....KKKKKKKKK.",
  "...KKWWWKKKKK.",
  "..KKWWWWWKKK..",
  "..KKKWWWKKK...",
  "...KKKKKKK....",
  ".....Y..Y.....",
  ".....Y..Y.....",
  "....YY.YY.....",
];
const PALETTE = { K: "#111", W: "#fff", R: "#e0352b", Y: "#f0c05a" };

// ---- dados da ESPN ----
const score = (v) => {
  const n = v && typeof v === "object" ? (v.value ?? v.displayValue) : v;
  return n === undefined || n === null || n === "" ? null : Number(n);
};
function normalize(ev) {
  const c = (ev.competitions || [])[0] || {};
  const teams = (c.competitors || []).map((x) => ({
    id: String(x.team?.id ?? x.id),
    name: x.team?.shortDisplayName || x.team?.displayName || "?",
    home: x.homeAway === "home",
    goals: score(x.score),
  }));
  const home = teams.find((x) => x.home) || teams[0], away = teams.find((x) => x !== home);
  return {
    id: ev.id, date: Date.parse(ev.date), timeOk: ev.timeValid !== false && c.timeValid !== false,
    league: ev.league?.name || "", venue: (c.venue || ev.venue || {}).fullName || "",
    state: (c.status || ev.status || {}).type?.state || "pre", home, away,
  };
}
async function loadMatches() {
  const cached = store.get("galo", true);
  if (cached) { try { const c = JSON.parse(cached); if (Date.now() - c.at < 10 * 60 * 1000) return c.data; } catch { /* cache inválido */ } }
  const get = (url) => fetch(url).then((r) => (r.ok ? r.json() : Promise.reject(r.status)));
  const [fix, res] = await Promise.allSettled([get(API + "?fixture=true"), get(API)]);
  if (fix.status === "rejected") throw new Error("ESPN");
  const next = (fix.value.events || []).map(normalize).filter((e) => e.state !== "post").sort((a, b) => a.date - b.date).slice(0, NEXT);
  const done = res.status === "fulfilled" ? (res.value.events || []).map(normalize).filter((e) => e.state === "post").sort((a, b) => a.date - b.date) : [];
  const data = { next, last: done[done.length - 1] || null };
  store.set("galo", JSON.stringify({ at: Date.now(), data }), true);
  return data;
}

export function GaloButton({ open, onToggle }) {
  const t = T[useLang().lang];
  const [cheer, setCheer] = useState(0);
  function click() {
    if (!open) { chip([[523, 0, 0.16], [784, 0.18, 0.16]]); setCheer((n) => n + 1); } // "GA-LO!"
    onToggle();
  }
  return (
    <button type="button" className="galo" aria-expanded={open} aria-controls="galo-panel" onClick={click}>
      <span className="galo-icon" key={cheer} data-cheer={cheer > 0 || undefined}><PixelArt rows={GALO} palette={PALETTE} px={3} /></span>
      <span>{t.btn}</span>
    </button>
  );
}

function Teams({ match, withScore }) {
  const side = (x) => <span className={x.id === TEAM_ID ? "us" : undefined}>{x.name}{withScore && x.goals != null ? ` ${x.goals}` : ""}</span>;
  return <p className="teams">{side(match.home)} <span className="x">x</span> {side(match.away)}</p>;
}

export function GaloPanel({ open }) {
  const { lang } = useLang();
  const t = T[lang];
  const [state, setState] = useState("idle"); // idle | loading | ready | error
  const [data, setData] = useState(null);
  const panel = useRef(null);

  useEffect(() => {
    if (!open) return;
    panel.current?.scrollIntoView({ block: "nearest", behavior: reducedMotion() ? "auto" : "smooth" });
    if (state === "loading" || state === "ready") return;
    setState("loading");
    loadMatches().then((d) => { setData(d); setState("ready"); }).catch(() => setState("error"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const day = new Intl.DateTimeFormat(locale(lang), { timeZone: TZ, weekday: "short", day: "2-digit", month: "2-digit" });
  const hour = new Intl.DateTimeFormat(locale(lang), { timeZone: TZ, hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  const dayText = (d) => day.format(d).replace(/\./g, "").toUpperCase();
  const espn = <p className="links"><a href={PAGE} target="_blank" rel="noopener noreferrer">{t.espn} ▸</a></p>;

  return (
    <div className="galo-panel" id="galo-panel" hidden={!open} ref={panel}>
      <p className="galo-msg">{t.msg}</p>
      <div className="card">
        <div className="tt"><span>{t.cal}</span><span>ESPN</span></div>
        <div className="b galo-cal" aria-live="polite">
          {(state === "idle" || state === "loading") && <p className="muted"><span className="blink" aria-hidden="true">▶</span> {t.loading}</p>}
          {state === "error" && <><p className="muted">{t.error}</p>{espn}</>}
          {state === "ready" && (
            <>
              {data.next.length ? (
                <ol className="matches">
                  {data.next.map((m) => (
                    <li key={m.id}>
                      <p className="when">{dayText(m.date)}, {m.timeOk ? hour.format(m.date) : t.tbd}</p>
                      <Teams match={m} withScore={m.state === "in"} />
                      <p className="muted">{[m.league, m.venue].filter(Boolean).join(", ")}</p>
                    </li>
                  ))}
                </ol>
              ) : <p className="muted">{t.empty}</p>}
              {data.last && (
                <div className="galo-last">
                  <h3 className="mini">{t.last}</h3>
                  <Teams match={data.last} withScore />
                  <p className="muted">{dayText(data.last.date)}, {data.last.league}</p>
                </div>
              )}
              {espn}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
