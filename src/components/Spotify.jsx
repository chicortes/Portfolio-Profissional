// Spotify: player incorporado (playlist, álbum ou música do siteConfig.js).
import SITE_CONFIG from "../config/siteConfig.js";
import { useLang } from "../context/LanguageContext.jsx";
import "./Spotify.css";

const T = { pt: { open: "Abrir no Spotify" }, en: { open: "Open in Spotify" } };

export default function Spotify() {
  const t = T[useLang().lang];
  const embed = SITE_CONFIG.spotifyEmbed;
  const open = embed.replace("/embed/", "/").split("?")[0];
  return (
    <>
      <iframe className="spotify" title="Spotify" src={embed} loading="lazy"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" />
      <p className="links"><a href={open} target="_blank" rel="noopener noreferrer">{t.open} ▸</a></p>
    </>
  );
}
