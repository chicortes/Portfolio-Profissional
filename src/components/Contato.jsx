// Contato: atalhos (e-mail, LinkedIn, GitHub, Instagram) e formulário com
// validação e envio de e-mail pelo EmailJS. Sem as chaves do EmailJS
// (.env.local / Vercel), o formulário abre o app de e-mail do visitante.
import { useRef, useState } from "react";
import SITE_CONFIG from "../config/siteConfig.js";
import EMAILJS_CONFIG, { emailJsReady } from "../config/emailJsConfig.js";
import { useLang } from "../context/LanguageContext.jsx";
import { fill, locale } from "../lib/format.js";
import "./Contato.css";

const T = {
  pt: {
    name: "NOME", email: "E-MAIL", msg: "MENSAGEM", send: "▶ ENVIAR", sending_btn: "ENVIANDO...",
    e_name: "Informe seu nome (pelo menos 2 letras).", e_email: "Informe um e-mail válido, como nome@exemplo.com.", e_msg: "Escreva uma mensagem com pelo menos 10 caracteres.",
    sending: "Enviando sua mensagem...", sent: "Mensagem enviada! Vou responder no e-mail que você informou.",
    mailto: "Abrindo seu aplicativo de e-mail para concluir o envio.", fail: "A mensagem não foi enviada. Tente de novo ou escreva direto para {email}.",
    subject: "Contato pelo portfólio: {name}", reply: "Recebi sua mensagem!",
  },
  en: {
    name: "NAME", email: "EMAIL", msg: "MESSAGE", send: "▶ SEND", sending_btn: "SENDING...",
    e_name: "Enter your name (at least 2 letters).", e_email: "Enter a valid email, like name@example.com.", e_msg: "Write a message with at least 10 characters.",
    sending: "Sending your message...", sent: "Message sent! I'll reply to the email you entered.",
    mailto: "Opening your email app to finish sending.", fail: "The message wasn't sent. Try again or write directly to {email}.",
    subject: "Portfolio contact: {name}", reply: "I got your message!",
  },
};

const ICONS = {
  email: <path d="M2 5h20v14H2V5zm2 2v.5l8 5 8-5V7H4zm16 3-8 5-8-5v7h16v-7z" />,
  linkedin: <path d="M4 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM2 9h4v12H2V9zm7 0h4v1.7c.6-1 2-2 4-2 4 0 4.5 2.6 4.5 6V21h-4v-5.5c0-1.5 0-3-2-3s-2.5 1.4-2.5 3V21H9V9z" />,
  github: <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.7.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2z" />,
  instagram: <path fillRule="evenodd" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM17.5 5.3a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z" />,
};
const LIMIT = { name: 100, email: 254, msg: 2000 };
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;
const handle = (url) => url.replace(/\/+$/, "").split("/").pop();

async function emailjsSend(templateId, params) {
  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ service_id: EMAILJS_CONFIG.SERVICE_ID, template_id: templateId, user_id: EMAILJS_CONFIG.PUBLIC_KEY, template_params: params }),
  });
  if (!res.ok) throw new Error(`EmailJS ${res.status}`);
}

export default function Contato() {
  const { lang } = useLang();
  const t = T[lang];
  const L = SITE_CONFIG.links;
  const [values, setValues] = useState({ name: "", email: "", msg: "", website: "" });
  const [errors, setErrors] = useState({ name: "", email: "", msg: "" }); // chave do texto (acompanha o idioma)
  const [status, setStatus] = useState({ key: "", kind: "" });
  const [sending, setSending] = useState(false);
  const refs = { name: useRef(null), email: useRef(null), msg: useRef(null) };

  const items = [
    ["email", L.email && `mailto:${L.email}`, "E-MAIL", L.email],
    ["linkedin", L.linkedin, "LINKEDIN", L.linkedin && "in/" + handle(L.linkedin)],
    ["github", L.github, "GITHUB", L.github && "@" + handle(L.github)],
    ["instagram", L.instagram, "INSTAGRAM", L.instagram && "@" + handle(L.instagram)],
  ].filter((i) => i[1]);

  // o erro de um campo some assim que a pessoa volta a digitar nele
  const change = (k) => (e) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: "" }));
  };

  async function submit(e) {
    e.preventDefault();
    if (sending) return;
    if (values.website) { setValues({ name: "", email: "", msg: "", website: "" }); setStatus({ key: "sent", kind: "ok" }); return; }
    const v = { name: values.name.trim(), email: values.email.trim(), msg: values.msg.trim() };
    const errs = { name: v.name.length < 2 ? "e_name" : "", email: EMAIL_RE.test(v.email) ? "" : "e_email", msg: v.msg.length < 10 ? "e_msg" : "" };
    setErrors(errs);
    const first = Object.keys(errs).find((k) => errs[k]);
    if (first) { refs[first].current.focus(); setStatus({ key: "", kind: "" }); return; }

    if (!emailJsReady()) {
      location.href = `mailto:${L.email}?subject=${encodeURIComponent(fill(t.subject, { name: v.name }))}&body=${encodeURIComponent(`${v.msg}\n\n${v.name} <${v.email}>`)}`;
      setStatus({ key: "mailto", kind: "ok" });
      return;
    }
    setSending(true);
    setStatus({ key: "sending", kind: "" });
    const params = { name: v.name, email: v.email, message: v.msg, time: new Date().toLocaleString(locale(lang)), title: `Nova mensagem do portfólio: ${v.name}` };
    try {
      await emailjsSend(EMAILJS_CONFIG.TEMPLATE_ID_FOR_ME, params);
      // confirmação para quem escreveu (opcional; se falhar, a mensagem principal já chegou)
      if (EMAILJS_CONFIG.TEMPLATE_ID_FOR_SENDER) await emailjsSend(EMAILJS_CONFIG.TEMPLATE_ID_FOR_SENDER, { ...params, title: t.reply }).catch(() => {});
      setValues({ name: "", email: "", msg: "", website: "" });
      setStatus({ key: "sent", kind: "ok" });
    } catch {
      setStatus({ key: "fail", kind: "bad" });
    } finally {
      setSending(false);
    }
  }

  const field = (k, props) => (
    <>
      <input id={`c-${k}`} ref={refs[k]} value={values[k]} onChange={change(k)} maxLength={LIMIT[k]}
        aria-invalid={!!errors[k]} aria-describedby={`err-${k}`} {...props} />
      <span className="err" id={`err-${k}`}>{errors[k] ? t[errors[k]] : ""}</span>
    </>
  );

  return (
    <div className="contact">
      <ul className="icons">
        {items.map(([k, href, label, value]) => (
          <li key={k}>
            <a href={href} {...(k !== "email" ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              <svg viewBox="0 0 24 24" aria-hidden="true">{ICONS[k]}</svg>
              <span><strong>{label}</strong><small>{value}</small></span>
            </a>
          </li>
        ))}
      </ul>
      <form noValidate onSubmit={submit}>
        <label htmlFor="c-name">{t.name}</label>
        {field("name", { autoComplete: "name" })}
        <label htmlFor="c-email">{t.email}</label>
        {field("email", { type: "email", autoComplete: "email" })}
        <label htmlFor="c-msg"><span>{t.msg}</span><span className="chars" aria-hidden="true">{values.msg.length}/{LIMIT.msg}</span></label>
        <textarea id="c-msg" ref={refs.msg} rows={6} value={values.msg} onChange={change("msg")} maxLength={LIMIT.msg}
          aria-invalid={!!errors.msg} aria-describedby="err-msg" />
        <span className="err" id="err-msg">{errors.msg ? t[errors.msg] : ""}</span>
        {/* Campo isca (honeypot): invisível para pessoas, robôs costumam preencher */}
        <div className="hp" aria-hidden="true">
          <label>Website <input name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={change("website")} /></label>
        </div>
        <button type="submit" disabled={sending} aria-busy={sending || undefined}>{sending ? t.sending_btn : t.send}</button>
        <p className={`status ${status.kind}`} role="status" aria-live="polite">{status.key ? fill(t[status.key], { email: L.email }) : ""}</p>
      </form>
    </div>
  );
}
