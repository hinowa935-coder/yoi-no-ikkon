"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { FAVORITES_KEY, migrateFavorites } from "../../data/favoriteReferences.js";
import { trackEvent } from "../../data/telemetry.js";

const Favorites = createContext(null);
export function OchokoIcon({ filled = false }) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16l-3 11H7L4 7Z" stroke="currentColor" strokeWidth="1.5" fill={filled ? "currentColor" : "none"} /><ellipse cx="12" cy="7" rx="8" ry="2.5" stroke="currentColor" strokeWidth="1.5" /><path d="M9 20h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
}
export function FavoritesProvider({ children }) {
  const [ids, setIds] = useState([]);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const read = () => {
      try {
        const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
        const next = migrateFavorites(saved);
        setIds(next);
        if (Array.isArray(saved) && JSON.stringify(next) !== JSON.stringify(saved)) localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      } catch { setMessage("おちょこの保存情報を読み込めませんでした。"); }
      setReady(true);
    };
    read();
    window.addEventListener("storage", read);
    return () => window.removeEventListener("storage", read);
  }, []);
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 4000);
    return () => clearTimeout(timer);
  }, [message]);
  const toggle = id => {
    if (!ready) return;
    const added = !ids.includes(id);
    const next = added ? [...ids, id] : ids.filter(value => value !== id);
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      setMessage(added ? "おちょこに入れました。" : "おちょこから外しました。");
    } catch { setMessage("この端末に保存できませんでした。この画面では見返せます。"); }
    setIds(next);
    trackEvent(added ? "ochoko_saved" : "ochoko_removed", { sake_id: id });
  };
  return <Favorites.Provider value={{ ids, ready, toggle }}>{children}<div role="status" aria-live="polite" className={message ? "ochoko-toast" : "sr-only"}>{message}</div></Favorites.Provider>;
}
export function useFavorites() { return useContext(Favorites); }
export function FavoriteButton({ id, compact = false }) {
  const { ids, ready, toggle } = useFavorites();
  const saved = ids.includes(id);
  const label = saved ? "おちょこから外す" : "おちょこに入れる";
  return <button type="button" className={`yoi-button ochoko-button ${saved ? "is-selected" : ""}`} disabled={!ready} aria-pressed={saved} aria-label={label} title={label} onClick={() => toggle(id)}><OchokoIcon filled={saved} />{!compact && <span>{saved ? "おちょこに入っています" : label}</span>}</button>;
}
