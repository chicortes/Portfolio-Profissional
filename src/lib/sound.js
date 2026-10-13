// Bipes de 8 bits com a Web Audio API (som da ficha, START, Galo).
let audio;

// notes: [[frequência em Hz, atraso em s, duração em s], ...]
export function chip(notes) {
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    notes.forEach(([f, delay, dur]) => {
      const o = audio.createOscillator(), g = audio.createGain(), t0 = audio.currentTime + delay;
      o.type = "square"; o.frequency.value = f; g.gain.value = 0.05;
      o.connect(g); g.connect(audio.destination); o.start(t0); o.stop(t0 + dur);
    });
  } catch { /* navegador sem áudio */ }
}

export const coinSound = () => chip([[988, 0, 0.25], [1319, 0.12, 0.25]]);
