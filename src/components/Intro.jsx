// Intro: gabinete de fliperama. Inserir a moeda dá zoom na tela e entra no
// portfólio. Roda sempre que a página abre; Esc ou "Pular intro" encerram.
import { useEffect, useRef, useState } from "react";
import SITE_CONFIG from "../config/siteConfig.js";
import { useLang } from "../context/LanguageContext.jsx";
import { coinSound } from "../lib/sound.js";
import { reducedMotion } from "../lib/storage.js";
import "./Intro.css";

const T = {
  pt: { tag: "DEV EM FORMAÇÃO", coin: "INSIRA UMA MOEDA", btn: "INSERIR MOEDA", skip: "Pular intro (Esc)", credit: "CRÉDITO 01" },
  en: { tag: "DEV IN TRAINING", coin: "INSERT COIN", btn: "INSERT COIN", skip: "Skip intro (Esc)", credit: "CREDIT 01" },
};

// enfeites pixel art ao redor do gabinete
const SPR = {
  alien: ["..#.....#..", "...#...#...", "..#######..", ".##.###.##.", "###########", "#.#######.#", "#.#.....#.#", "...##.##..."],
  star: ["...#...", "...#...", "#######", ".#####.", "..###..", ".##.##.", "#.....#"],
  coin: ["..###..", ".#####.", "###.###", "###.###", "###.###", ".#####.", "..###.."],
};
const ITEMS = [ // nome, cor, tamanho do pixel, lado, x, y
  ["alien", "#a992e8", 9, "l", "12%", "24%"], ["coin", "#f0c05a", 6, "l", "8%", "62%"],
  ["star", "#efeaff", 5, "l", "22%", "16%"], ["star", "#a992e8", 4, "l", "4%", "42%"], ["star", "#f0c05a", 4, "l", "17%", "78%"],
  ["alien", "#f0c05a", 9, "r", "12%", "32%"], ["coin", "#f0c05a", 6, "r", "8%", "20%"],
  ["star", "#efeaff", 5, "r", "20%", "24%"], ["star", "#a992e8", 4, "r", "5%", "50%"], ["star", "#f0c05a", 4, "r", "16%", "80%"],
];

function Sprite({ name, color, px }) {
  const m = SPR[name];
  return (
    <svg viewBox={`0 0 ${m[0].length} ${m.length}`} width={m[0].length * px} fill={color} shapeRendering="crispEdges">
      {m.flatMap((row, y) => [...row].map((ch, x) => (ch === "#" ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" /> : null)))}
    </svg>
  );
}

export default function Intro({ onEnd }) {
  const t = T[useLang().lang];
  const [phase, setPhase] = useState("idle");
  const [credit, setCredit] = useState(false);
  const zoomer = useRef(null), screen = useRef(null), coinBtn = useRef(null), timers = useRef([]);
  const done = useRef(false);

  function end() {
    if (done.current) return;
    done.current = true;
    setPhase("out");
    document.body.classList.remove("intro");
    if (location.hash) history.replaceState(null, "", location.pathname + location.search);
    scrollTo(0, 0);
    timers.current.push(setTimeout(() => { onEnd(); document.getElementById("start")?.focus({ preventScroll: true }); }, 700));
  }

  function insertCoin() {
    if (phase !== "idle") return;
    if (reducedMotion()) { coinSound(); return end(); }
    setPhase("coin");
    timers.current.push(setTimeout(() => { coinSound(); setCredit(true); }, 700));
    timers.current.push(setTimeout(() => {
      const z = zoomer.current, s = screen.current.getBoundingClientRect(), c = z.getBoundingClientRect();
      const cx = s.left + s.width / 2, cy = s.top + s.height / 2;
      const k = Math.max(innerWidth / s.width, innerHeight / s.height) * 1.05;
      z.style.transformOrigin = `${cx - c.left}px ${cy - c.top}px`;
      z.style.transform = `translate(${innerWidth / 2 - cx}px,${innerHeight / 2 - cy}px) scale(${k})`;
      setPhase("zoom");
    }, 1100));
    timers.current.push(setTimeout(end, 2700));
  }

  useEffect(() => {
    coinBtn.current?.focus();
    const onKey = (e) => { if (e.key === "Escape") end(); };
    document.addEventListener("keydown", onKey);
    const list = timers.current;
    return () => { document.removeEventListener("keydown", onKey); list.forEach(clearTimeout); };
  }, []);

  const zooming = phase === "zoom" || phase === "out";
  return (
    <div id="arc" role="dialog" aria-modal="true" aria-label="Intro" className={[zooming ? "go" : "", phase === "out" ? "out" : ""].join(" ")}>
      <div className="deco" aria-hidden="true">
        {ITEMS.map(([n, c, px, side, x, y], i) => (
          <span key={i} className="sp" style={{ [side === "l" ? "left" : "right"]: x, top: y, animationDelay: `${i * -0.3}s` }}>
            <Sprite name={n} color={c} px={px} />
          </span>
        ))}
        <div className="hud" style={{ left: "1.2rem", top: "calc(1.2rem + env(safe-area-inset-top,0px))" }}>1UP<br /><b>000000</b></div>
        <div className="hud" style={{ right: "1.2rem", top: "calc(1.2rem + env(safe-area-inset-top,0px))", textAlign: "right" }}>HI-SCORE<br /><b>002026</b></div>
        <div className="hud" style={{ left: "1.2rem", bottom: "calc(1.2rem + env(safe-area-inset-bottom,0px))" }}>CREDIT 00</div>
      </div>
      <div className={`zoomer${zooming ? " go" : ""}`} ref={zoomer}>
        <div className={`cab${phase !== "idle" ? " ins" : ""}`}>
          <div className="mq">{SITE_CONFIG.firstName.toUpperCase()}</div>
          <div className="bz">
            <div className="scr" ref={screen}>
              <span>★ {t.tag} ★</span><b>PLAYER 1</b>
              <span className="blink">{credit ? t.credit : t.coin}</span><span aria-hidden="true">👾</span>
            </div>
          </div>
          <div className="pn" aria-hidden="true">
            <div className="jy"><i /></div>
            <div className="sts"><span className="sb" /><span className="sb s2" /><small>START</small></div>
            <div className="bt"><span className="pb" /><span className="pb c2" /><span className="pb c3" /><span className="pb c4" /></div>
          </div>
          <div className="dr" onClick={insertCoin}>
            <div className="slot" /><div className="coin" />
            <button type="button" className="coinbtn" ref={coinBtn} disabled={phase !== "idle"} style={phase !== "idle" ? { animation: "none" } : undefined}>{t.btn}</button>
          </div>
          <div className="kick" />
        </div>
      </div>
      <button type="button" className="skip" onClick={end}>{t.skip}</button>
    </div>
  );
}