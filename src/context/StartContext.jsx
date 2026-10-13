// StartContext: estado do "APERTE START". Na primeira tela só o início
// aparece; apertar START (ou clicar no menu) libera as outras seções.
import { createContext, useCallback, useContext, useLayoutEffect, useState } from "react";
import { flushSync } from "react-dom";
import { coinSound } from "../lib/sound.js";

const StartContext = createContext({ started: false, pressStart: () => {} });

export function StartProvider({ children }) {
  const [started, setStarted] = useState(false);

  // a classe "locked" no <body> esconde as seções pelo CSS (App.css)
  useLayoutEffect(() => {
    document.body.classList.toggle("locked", !started);
  }, [started]);

  // flushSync: as seções aparecem na hora, antes do navegador rolar até o link
  const pressStart = useCallback((withSound = false) => {
    if (withSound) coinSound();
    flushSync(() => setStarted(true));
  }, []);

  return <StartContext.Provider value={{ started, pressStart }}>{children}</StartContext.Provider>;
}

export const useStart = () => useContext(StartContext);
