// localStorage / sessionStorage sem quebrar quando o navegador bloqueia.
export const store = {
  get(k, session) { try { return (session ? sessionStorage : localStorage).getItem(k); } catch { return null; } },
  set(k, v, session) { try { (session ? sessionStorage : localStorage).setItem(k, v); } catch { /* sem armazenamento */ } },
};

export const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
