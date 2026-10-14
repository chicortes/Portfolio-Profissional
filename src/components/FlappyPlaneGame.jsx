// FlappyPlaneGame
import { useEffect, useRef } from "react";
import { useLang } from "../context/LanguageContext.jsx";
import { store } from "../lib/storage.js";
import "./FlappyPlaneGame.css";

const T = {
  pt: { hint: "ESPAÇO OU TOQUE", score: "PONTOS", best: "RECORDE", start: "CLIQUE OU ESPAÇO PARA VOAR", over: "GAME OVER", retry: "CLIQUE OU R PARA JOGAR DE NOVO" },
  en: { hint: "SPACE OR TAP", score: "SCORE", best: "BEST", start: "CLICK OR SPACE TO FLY", over: "GAME OVER", retry: "CLICK OR R TO PLAY AGAIN" },
};

// avião em pixel art
const PLANE = [
  "..Y.........",
  "..YW........",
  ".YWWWWWWWWL.",
  "WWWWLWLWLWWW",
  "..WWWWWW....",
  "....WW......"
];

export default function FlappyPlaneGame() {
  const { lang } = useLang();
  const canvas = useRef(null);
  const langRef = useRef(lang);
  const redraw = useRef(() => {});

  // troca de idioma: o próximo quadro já sai com os textos novos
  useEffect(() => { langRef.current = lang; redraw.current(); }, [lang]);

  useEffect(() => {
    const cv = canvas.current, ctx = cv.getContext("2d");
    const W = cv.width, H = cv.height;
    const GRAVITY = 900, FLAP = -270, SPEED = 220, SPAWN = 1.5;   // px/s², px/s, px/s, s
    const CLOUD = [
      "....WWWW......",
      "..WWWWWWWW....",
      ".WWWWWWWWWWW..",
      "WWWWWWWWWWWWWW",
      "LWWWWWWWWWWWWL",
      ".LLLLLLLLLLLL."
    ];
    const PX = 4;   // tamanho do pixel dos sprites no canvas
    let st, raf = 0, last = 0, running = false;
    const best = () => Number(store.get("flappy-best") || 0);

    function reset() {
      st = { mode: "ready", y: H / 2, vy: 0, clouds: [], spawn: .4, score: 0 };
    }

    function sprite(rows, x, y, pal) {
      rows.forEach((row, j) => [...row].forEach((c, i) => { if (pal[c]) { ctx.fillStyle = pal[c]; ctx.fillRect(Math.round(x + i * PX), Math.round(y + j * PX), PX, PX); } }));
    }
    function text(s, x, y, size, color, align = "center") {
      ctx.font = `${size}px "Press Start 2P", monospace`; ctx.textAlign = align; ctx.textBaseline = "middle";
      ctx.fillStyle = "#080412"; ctx.fillText(s, x + 2, y + 2);
      ctx.fillStyle = color; ctx.fillText(s, x, y);
    }

    function flap() {
      if (st.mode === "over") { reset(); st.mode = "play"; return; }
      if (st.mode === "ready") st.mode = "play";
      st.vy = FLAP;
    }

    function update(dt) {
      if (st.mode !== "play") return;
      st.vy += GRAVITY * dt; st.y += st.vy * dt;
      if (st.y < 0) { st.y = 0; st.vy = 0; }
      st.spawn -= dt;
      if (st.spawn <= 0) { st.spawn += SPAWN; st.clouds.push({ x: W, y: Math.random() * (H - 30) }); }
      const px = 60, pw = 12 * PX, ph = 6 * PX;
      st.clouds.forEach(c => { c.x -= SPEED * dt; });
      for (const c of st.clouds) {
        const hit = px + 4 < c.x + 14 * PX - 4 && px + pw - 4 > c.x + 4 && st.y + 3 < c.y + 6 * PX - 3 && st.y + ph - 3 > c.y + 3;
        if (hit) return gameOver();
      }
      const before = st.clouds.length;
      st.clouds = st.clouds.filter(c => c.x > -14 * PX);
      st.score += before - st.clouds.length;   // cada nuvem que passa vale 1 ponto
      if (st.y > H - ph) return gameOver();
    }
    function gameOver() {
      st.mode = "over";
      if (st.score > best()) store.set("flappy-best", String(st.score));
    }

    function draw() {
      const t = T[langRef.current];
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#1f1340"); g.addColorStop(1, "#34205f");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#ffffff22";
      for (let i = 0; i < 40; i++) ctx.fillRect((i * 97 + (performance.now() / 60 | 0)) % W, (i * 53) % H, 2, 2);
      st.clouds.forEach(c => sprite(CLOUD, c.x, c.y, { W: "#efeaff", L: "#a992e8" }));
      const tilt = st.mode === "play" && st.vy < 0 ? -2 : 0;
      ctx.globalAlpha = st.mode === "over" ? .5 : 1;
      sprite(PLANE, 60, st.y + tilt, { W: "#efeaff", L: "#a992e8", Y: "#f0c05a" });
      ctx.globalAlpha = 1;
      text(`${t.score} ${String(st.score).padStart(3, "0")}`, 12, 18, 10, "#f0c05a", "left");
      text(`${t.best} ${String(Math.max(best(), st.score)).padStart(3, "0")}`, W - 12, 18, 10, "#efeaff", "right");
      if (st.mode === "ready") text(t.start, W / 2, H / 2 + 50, 9, "#efeaff");
      if (st.mode === "over") { text(t.over, W / 2, H / 2 - 10, 18, "#f0c05a"); text(t.retry, W / 2, H / 2 + 22, 8, "#efeaff"); }
    }

    function loop(now) {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, .05); last = now;
      update(dt); draw();
      raf = requestAnimationFrame(loop);
    }

    function run() {   // o loop só roda enquanto alguém está jogando
      if (running) return;
      running = true; last = performance.now(); raf = requestAnimationFrame(loop);
    }
    function pause() { running = false; cancelAnimationFrame(raf); draw(); }

    const onPointer = (e) => { if (e.button > 0) return; e.preventDefault(); cv.focus({ preventScroll: true }); flap(); run(); };
    const onKey = (e) => {
      if (e.code === "Space" || e.key === "ArrowUp") { e.preventDefault(); flap(); run(); }
      if ((e.key === "r" || e.key === "R") && st.mode === "over") { reset(); st.mode = "play"; run(); }
    };
    // pausa quando o jogo sai da tela
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting && running) { if (st.mode === "play") { st.mode = "ready"; st.vy = 0; } pause(); }
    }));
    io.observe(cv);
    cv.addEventListener("pointerdown", onPointer);
    cv.addEventListener("keydown", onKey);

    reset(); draw();
    redraw.current = () => { if (!running) draw(); };
    if (document.fonts) document.fonts.ready.then(() => redraw.current());
    // saiu da página: para tudo de verdade
    return () => {
      running = false; cancelAnimationFrame(raf); io.disconnect();
      cv.removeEventListener("pointerdown", onPointer);
      cv.removeEventListener("keydown", onKey);
      redraw.current = () => {};
    };
  }, []);

  return (
    <div className="flappy card">
      <div className="tt"><span>FLAPPY PLANE</span><span>{T[lang].hint}</span></div>
      <canvas ref={canvas} width="480" height="300" tabIndex={0} aria-label="Flappy Plane" />
    </div>
  );
}
