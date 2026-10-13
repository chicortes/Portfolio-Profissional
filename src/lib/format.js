// Formatação de textos, datas e números conforme o idioma.
export const pad = (n) => String(n).padStart(2, "0");

export const fill = (str, vars) => str.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");

export const locale = (lang) => (lang === "pt" ? "pt-BR" : "en-US");

const MONTHS = {
  pt: ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"],
  en: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
};
// fmtMonth("2026-05", "pt") → "MAI 2026"
export function fmtMonth(d, lang) {
  const [y, m] = d.split("-").map(Number);
  return `${MONTHS[lang][(m || 1) - 1]} ${y}`;
}
