// emailJsConfig.js: chaves do EmailJS (https://dashboard.emailjs.com/admin).
// Os valores vêm das variáveis de ambiente VITE_EMAILJS_* (.env.local no
// computador, Environment Variables na Vercel). Veja o .env.example.
const EMAILJS_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || "",
  TEMPLATE_ID_FOR_ME: import.meta.env.VITE_EMAILJS_TEMPLATE_ID_FOR_ME || "", // e-mail que chega para você
  TEMPLATE_ID_FOR_SENDER: import.meta.env.VITE_EMAILJS_TEMPLATE_ID_FOR_SENDER || "", // confirmação para quem escreveu
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "",
};

export const emailJsReady = () => Boolean(EMAILJS_CONFIG.SERVICE_ID && EMAILJS_CONFIG.TEMPLATE_ID_FOR_ME && EMAILJS_CONFIG.PUBLIC_KEY);

export default EMAILJS_CONFIG;
