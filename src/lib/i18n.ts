import { useEffect, useState } from "react";

export type Locale = "es" | "en";

const dict = {
  es: {
    nav: { experience: "Experiencia", packages: "Paquetes", gallery: "Galería", contact: "Contacto", quote: "Cotizar" },
  },
  en: {
    nav: { experience: "Experience", packages: "Packages", gallery: "Gallery", contact: "Contact", quote: "Get a quote" },
  },
} as const;

export function useLocale(): [Locale, (l: Locale) => void] {
  const [locale, setLocale] = useState<Locale>("es");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = (localStorage.getItem("taabal_locale") as Locale | null);
    if (saved === "en" || saved === "es") setLocale(saved);
    else if (window.location.pathname.startsWith("/en")) setLocale("en");
  }, []);
  const set = (l: Locale) => { setLocale(l); try { localStorage.setItem("taabal_locale", l); } catch {} };
  return [locale, set];
}

export function t(locale: Locale) {
  return dict[locale];
}