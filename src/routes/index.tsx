import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Logo } from "@/components/Logo";
import { RabbitPeek, useRabbitsEnabled } from "@/components/RabbitPeek";
import { Lightbox } from "@/components/Lightbox";
import { SocialProof } from "@/components/SocialProof";
import { useLocale, t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Sparkles, Wine, Users, MessageCircle, Mail, Phone, Instagram, Facebook, Check, Award, Clock, Heart, ShieldCheck, Star, Quote } from "lucide-react";
import hero from "@/assets/hero-bar.jpg";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TAABAL Barras Libres — Mixología de Lujo · Bodas Riviera Maya" },
      { name: "description", content: "Barra libre de mixología premium para bodas en Cancún, Tulum, Playa del Carmen, Puerto Morelos e Isla Mujeres. Cócteles de autor, servicio impecable." },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "LocalBusiness",
              "@id": "https://taaballibre.lovable.app/#business",
              name: "TAABAL Barras Libres",
              description: "Barra libre de mixología premium para bodas en la Riviera Maya.",
              image: "https://taaballibre.lovable.app/og.jpg",
              telephone: "+52 998 123 4567",
              email: "hola@taabal.mx",
              priceRange: "$$$",
              areaServed: ["Cancún", "Tulum", "Playa del Carmen", "Puerto Morelos", "Isla Mujeres"],
              address: { "@type": "PostalAddress", addressRegion: "Quintana Roo", addressCountry: "MX" },
            },
            {
              "@type": "Service",
              serviceType: "Barra libre boda Tulum",
              name: "Mixología de lujo para bodas",
              provider: { "@id": "https://taaballibre.lovable.app/#business" },
              areaServed: [
                { "@type": "City", name: "Tulum" },
                { "@type": "City", name: "Cancún" },
                { "@type": "City", name: "Playa del Carmen" },
              ],
              audience: { "@type": "Audience", audienceType: "Bodas destination" },
            },
          ],
        }),
      },
    ],
  }),
  component: Landing,
});

const DEFAULT_PILLARS = [
  { icon: Wine, title: "Mixología de Autor", desc: "Cada cóctel es una pieza única, creada por mixólogos certificados que elevan los sabores de la Riviera." },
  { icon: Sparkles, title: "Servicio Excepcional", desc: "Equipo entrenado para anticiparse: tu único trabajo es disfrutar y celebrar." },
  { icon: Users, title: "Presentación Impecable", desc: "Barras de diseño, cristalería de lujo, hielo cristal y garnish que se ve tan bien como sabe." },
  { icon: MapPin, title: "Riviera Maya", desc: "Cancún, Tulum, Playa del Carmen, Puerto Morelos e Isla Mujeres. Locales, cero improvisaciones." },
];
const PILLAR_ICONS = [Wine, Sparkles, Users, MapPin];

const DEFAULT_HERO = {
  badge: "Riviera Maya · Bodas exclusivas",
  title_1: "La barra libre que",
  title_2: "tu boda",
  title_3: "merece.",
  subtitle: "Mixología de autor, servicio impecable y cero filas. Diseñamos la experiencia de bar para bodas inolvidables en la Riviera Maya.",
};

const DEFAULT_CONTACT_TEXT = {
  eyebrow: "Cotiza tu boda",
  title: "Brindemos juntos.",
  subtitle: "Cuéntanos los detalles. Te respondemos en menos de 24 horas.",
};

const DEFAULT_PACKAGES = [
  { name: "Signature", price: "Desde $35,000 MXN", tagline: "La esencia TAABAL", features: ["Mixología clásica de autor", "Bartender certificado", "Cristalería premium", "Hasta 80 invitados", "4 horas de servicio"] },
  { name: "Mixología Premium", price: "Desde $65,000 MXN", tagline: "La experiencia completa", featured: true, features: ["Carta personalizada", "2 mixólogos", "Hielo cristal y garnish exótico", "Hasta 150 invitados", "6 horas de servicio", "Estación de mezcal"] },
  { name: "Personalizado", price: "Cotización a medida", tagline: "Tu boda, tus reglas", features: ["Diseño 100% a medida", "Equipo dedicado", "Cócteles con tu nombre", "Sin límite de invitados", "Servicio fluido", "Decoración temática"] },
];

const FALLBACK_GALLERY = [g1, g2, g3, g4, g5, g6].map((url, i) => ({ url, alt: `Boda Riviera Maya ${i + 1}` }));

const leadSchema = z.object({
  name: z.string().trim().min(2, "Tu nombre").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  wedding_date: z.string().optional().or(z.literal("")),
  location: z.string().trim().max(100).optional().or(z.literal("")),
  guests: z.coerce.number().int().min(1).max(2000).optional().or(z.literal("" as any)),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

const DEFAULT_CONTACT_INFO = {
  email: "barrascancun@taabalcancun.com",
  whatsapp: "529981234567",
  phone: "+52 998 123 4567",
};

function useContactInfo() {
  const [info, setInfo] = useState(DEFAULT_CONTACT_INFO);
  useEffect(() => {
    supabase.from("site_content").select("value").eq("key", "contact_info").maybeSingle().then(({ data }) => {
      if (data?.value && typeof data.value === "object") setInfo({ ...DEFAULT_CONTACT_INFO, ...(data.value as any) });
    });
  }, []);
  return info;
}

function Landing() {
  const rabbitsOn = useRabbitsEnabled();
  const contactInfo = useContactInfo();
  return (
    <main className="relative overflow-x-clip bg-background text-foreground">
      <Nav contact={contactInfo} />
      <Hero rabbitsOn={rabbitsOn} />
      <Pillars rabbitsOn={rabbitsOn} />
      <ChampagneFeature />
      <WhyUs />
      <ProcessSteps />
      <Packages rabbitsOn={rabbitsOn} />
      <Gallery />
      <Stats />
      <SocialProof />
      <FAQ />
      <Contact rabbitsOn={rabbitsOn} contact={contactInfo} />
      <Footer />
      <FloatingWhatsApp whatsapp={contactInfo.whatsapp} />
    </main>
  );
}

function Nav({ contact }: { contact: typeof DEFAULT_CONTACT_INFO }) {
  const [scrolled, setScrolled] = useState(false);
  const [locale, setLocale] = useLocale();
  const tr = t(locale).nav;
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all ${scrolled ? "backdrop-blur-xl bg-background/70 border-b border-border" : "bg-transparent"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Logo className="h-10 w-auto" />
        <nav className="hidden md:flex items-center gap-8 text-sm tracking-wide">
          <a href="#experiencia" className="hover:text-primary transition">{tr.experience}</a>
          <a href="#paquetes" className="hover:text-primary transition">{tr.packages}</a>
          <a href="#galeria" className="hover:text-primary transition">{tr.gallery}</a>
          <a href="#contacto" className="hover:text-primary transition">{tr.contact}</a>
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center text-xs tracking-widest text-muted-foreground">
            <button onClick={() => setLocale("es")} className={locale === "es" ? "text-primary" : "hover:text-foreground"}>ES</button>
            <span className="mx-1.5 opacity-40">/</span>
            <button onClick={() => setLocale("en")} className={locale === "en" ? "text-primary" : "hover:text-foreground"}>EN</button>
          </div>
          <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <a href="#contacto">{tr.quote}</a>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Hero({ rabbitsOn }: { rabbitsOn: boolean }) {
  const contact = useContactInfo();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const [content, setContent] = useState(DEFAULT_HERO);
  useEffect(() => {
    supabase.from("site_content").select("value").eq("key", "hero").maybeSingle().then(({ data }) => {
      if (data?.value && typeof data.value === "object") setContent({ ...DEFAULT_HERO, ...(data.value as any) });
    });
  }, []);
  return (
    <section ref={ref} className="relative h-[100svh] w-full overflow-hidden">
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <img src={hero} alt="Barra libre de mixología en boda Riviera Maya" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background" />
      </motion.div>
      <RabbitPeek variant="elegant" side="right" size={220} enabled={rabbitsOn} className="right-[-30px] bottom-[8%]" />
      <RabbitPeek variant="watch" side="left" size={130} enabled={rabbitsOn} className="left-2 bottom-[5%]" delay={0.4} />
      <div className="relative z-20 flex h-full flex-col items-center justify-center text-center px-6 pointer-events-none">
        <div className="pointer-events-auto flex flex-col items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <Badge variant="outline" className="mb-6 border-primary/40 text-primary backdrop-blur-sm">
            {content.badge}
          </Badge>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.2 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] max-w-5xl"
        >
          {content.title_1} <span className="text-gradient-brand">{content.title_2}</span> {content.title_3}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }}
          className="mt-6 max-w-xl text-lg text-muted-foreground"
        >
          {content.subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.9 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[var(--shadow-glow)]">
            <a href="#contacto">Cotiza tu boda</a>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-primary/40 hover:bg-primary/10">
            <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer">
              <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp directo
            </a>
          </Button>
        </motion.div>
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
        Desliza
      </div>
    </section>
  );
}

function Pillars({ rabbitsOn }: { rabbitsOn: boolean }) {
  const [pillars, setPillars] = useState(DEFAULT_PILLARS);
  useEffect(() => {
    supabase.from("site_content").select("value").eq("key", "pillars").maybeSingle().then(({ data }) => {
      if (Array.isArray(data?.value)) {
        const arr = (data!.value as any[]).map((p, i) => ({ icon: PILLAR_ICONS[i % PILLAR_ICONS.length], title: p.title || "", desc: p.desc || "" }));
        if (arr.length) setPillars(arr);
      }
    });
  }, []);
  return (
    <section id="experiencia" className="relative py-32 px-6">
      <RabbitPeek variant="howl" side="left" size={150} enabled={rabbitsOn} className="left-[-20px] top-4 opacity-60" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="text-center mb-20">
          <span className="text-xs uppercase tracking-[0.4em] text-primary">Nuestra firma</span>
          <h2 className="mt-4 font-display text-4xl md:text-6xl">Cuatro pilares, una experiencia.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Card className="h-full p-8 bg-card/60 border-border backdrop-blur hover:border-primary/40 transition-all hover:translate-y-[-4px]">
                <p.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-display text-2xl mb-3">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Packages({ rabbitsOn }: { rabbitsOn: boolean }) {
  const [pkgs, setPkgs] = useState<typeof DEFAULT_PACKAGES>(DEFAULT_PACKAGES);
  useEffect(() => {
    supabase.from("site_content").select("value").eq("key", "packages").maybeSingle().then(({ data }) => {
      if (data?.value && Array.isArray(data.value)) setPkgs(data.value as any);
    });
  }, []);
  return (
    <section id="paquetes" className="relative py-32 px-6">
      <RabbitPeek variant="stand" side="right" size={140} enabled={rabbitsOn} className="right-[-10px] top-12 opacity-70" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.4em] text-primary">Paquetes</span>
          <h2 className="mt-4 font-display text-4xl md:text-6xl">Elige tu experiencia.</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {pkgs.map((p: any, i: number) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <Card className={`relative h-full p-8 flex flex-col ${p.featured ? "border-primary bg-gradient-to-b from-primary/10 to-card shadow-[var(--shadow-glow)]" : "bg-card/60 border-border"}`}>
                {p.featured && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">Más elegido</Badge>
                )}
                <h3 className="font-display text-3xl">{p.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{p.tagline}</p>
                <p className="mt-6 text-2xl font-semibold text-primary">{p.price}</p>
                <ul className="mt-8 space-y-3 flex-1">
                  {p.features.map((f: string) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" /> <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-8" variant={p.featured ? "default" : "outline"}>
                  <a href="#contacto">Solicitar cotización</a>
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const [imgs, setImgs] = useState<{ url: string; alt?: string }[]>(FALLBACK_GALLERY);
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => {
    supabase.from("gallery_images").select("url,alt").order("position").then(({ data }) => {
      if (data && data.length) setImgs(data.map((d: any) => ({ url: d.url, alt: d.alt || "Boda Riviera Maya" })));
    });
  }, []);
  return (
    <section id="galeria" className="relative py-32 px-6 bg-card/30">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.4em] text-primary">Galería</span>
          <h2 className="mt-4 font-display text-4xl md:text-6xl">Bodas que ya brindaron con nosotros.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3 grid-cols-2">
          {imgs.map((img, i) => (
            <motion.button
              type="button"
              key={i}
              onClick={() => setOpen(i)}
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
              className={`group overflow-hidden rounded-2xl border border-border cursor-zoom-in ${i === 0 ? "md:col-span-2 md:row-span-2 aspect-square md:aspect-auto" : "aspect-square"}`}
            >
              <img src={img.url} alt={img.alt || `Boda Riviera Maya ${i + 1}`} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
            </motion.button>
          ))}
        </div>
      </div>
      {open !== null && (
        <Lightbox
          images={imgs}
          index={open}
          onClose={() => setOpen(null)}
          onPrev={() => setOpen(i => (i === null ? 0 : (i - 1 + imgs.length) % imgs.length))}
          onNext={() => setOpen(i => (i === null ? 0 : (i + 1) % imgs.length))}
        />
      )}
    </section>
  );
}

function Contact({ rabbitsOn, contact }: { rabbitsOn: boolean; contact: typeof DEFAULT_CONTACT_INFO }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", wedding_date: "", location: "", guests: "", message: "" });
  const [consent, setConsent] = useState(false);
  const [text, setText] = useState(DEFAULT_CONTACT_TEXT);
  useEffect(() => {
    supabase.from("site_content").select("value").eq("key", "contact_text").maybeSingle().then(({ data }) => {
      if (data?.value && typeof data.value === "object") setText({ ...DEFAULT_CONTACT_TEXT, ...(data.value as any) });
    });
  }, []);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      toast.error("Debes aceptar el aviso de privacidad para continuar.");
      return;
    }
    const parsed = leadSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      wedding_date: form.wedding_date || null,
      location: form.location || null,
      guests: form.guests ? Number(form.guests) : null,
      message: form.message || null,
    };
    const { error } = await supabase.from("leads").insert(payload);
    setLoading(false);
    if (error) {
      toast.error("No pudimos enviar. Inténtalo por WhatsApp.");
      return;
    }
    toast.success("¡Recibido! Te contactaremos en menos de 24h.");
    setForm({ name: "", email: "", phone: "", wedding_date: "", location: "", guests: "", message: "" });
  };

  const waText = encodeURIComponent(
    `Hola TAABAL, soy ${form.name || "[nombre]"}. Me interesa cotizar mi boda${form.wedding_date ? ` (${form.wedding_date})` : ""}${form.location ? ` en ${form.location}` : ""}${form.guests ? `, ~${form.guests} invitados` : ""}.`
  );

  return (
    <section id="contacto" className="relative py-32 px-6">
      <RabbitPeek variant="tall" side="left" size={150} enabled={rabbitsOn} className="left-[-20px] bottom-8 opacity-60" />
      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.4em] text-primary">{text.eyebrow}</span>
          <h2 className="mt-4 font-display text-4xl md:text-6xl">{text.title}</h2>
          <p className="mt-4 text-muted-foreground">{text.subtitle}</p>
        </div>
        <Card className="p-8 bg-card/80 backdrop-blur border-border">
          <form onSubmit={submit} className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label htmlFor="name">Nombre completo *</Label>
              <Input id="name" value={form.name} onChange={set("name")} required maxLength={100} />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={form.email} onChange={set("email")} required maxLength={255} />
            </div>
            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" value={form.phone} onChange={set("phone")} maxLength={30} />
            </div>
            <div>
              <Label htmlFor="wedding_date">Fecha de boda</Label>
              <Input id="wedding_date" type="date" value={form.wedding_date} onChange={set("wedding_date")} />
            </div>
            <div>
              <Label htmlFor="location">Ubicación</Label>
              <Input id="location" placeholder="Tulum, Cancún…" value={form.location} onChange={set("location")} maxLength={100} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="guests">Invitados aprox.</Label>
              <Input id="guests" type="number" min={1} max={2000} value={form.guests} onChange={set("guests")} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="message">Cuéntanos tu visión</Label>
              <Textarea id="message" rows={4} value={form.message} onChange={set("message")} maxLength={1000} />
            </div>
            <div className="md:col-span-2 flex items-start gap-3 rounded-md border border-border/60 bg-background/40 p-3">
              <Checkbox id="consent" checked={consent} onCheckedChange={(v) => setConsent(v === true)} className="mt-1" />
              <Label htmlFor="consent" className="text-xs text-muted-foreground leading-relaxed font-normal cursor-pointer">
                Acepto el tratamiento de mis datos personales conforme a la <a href="/privacidad" target="_blank" className="text-primary underline">Política de Privacidad</a> de TAABAL Barras Libres y la LFPDPPP de México. *
              </Label>
            </div>
            <div className="md:col-span-2 flex flex-col sm:flex-row gap-3">
              <Button type="submit" size="lg" disabled={loading} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                {loading ? "Enviando..." : "Enviar cotización"}
              </Button>
              <Button asChild type="button" size="lg" variant="outline" className="flex-1 border-primary/40">
                <a href={`https://wa.me/${contact.whatsapp}?text=${waText}`} target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
                </a>
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </section>
  );
}

function Footer() {
  const contact = useContactInfo();
  return (
    <footer className="border-t border-border py-12 px-6 bg-card/30">
      <div className="mx-auto max-w-6xl grid md:grid-cols-3 gap-8 items-start">
        <div>
          <Logo className="h-12 w-auto" />
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">Mixología de lujo para bodas en la Riviera Maya.</p>
        </div>
        <div className="text-sm space-y-2">
          <p className="font-semibold text-primary">Contacto</p>
          <p className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" /><a href={`mailto:${contact.email}`} className="hover:text-primary">{contact.email}</a></p>
          <p className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" /><a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-primary">{contact.phone}</a></p>
        </div>
        <div className="text-sm space-y-2">
          <p className="font-semibold text-primary">Síguenos</p>
          <div className="flex gap-3">
            <a href="https://instagram.com/taabal" target="_blank" rel="noreferrer" className="hover:text-primary"><Instagram className="h-5 w-5" /></a>
            <a href="https://facebook.com/taabal" target="_blank" rel="noreferrer" className="hover:text-primary"><Facebook className="h-5 w-5" /></a>
          </div>
        </div>
      </div>
      <p className="mt-10 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} TAABAL Barras Libres. Todos los derechos reservados.</p>
    </footer>
  );
}

function FloatingWhatsApp({ whatsapp }: { whatsapp: string }) {
  return (
    <a
      href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-2xl hover:scale-110 transition-transform"
      aria-label="WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}

/* ---------- Nuevas secciones ---------- */

function ChampagneFeature() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32 px-6 bg-gradient-to-b from-background via-card/40 to-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(168,85,247,0.18),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,180,80,0.12),transparent_50%)]" />
      <div className="relative z-10 mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs uppercase tracking-[0.4em] text-accent">El brindis</span>
          <h2 className="mt-4 font-display text-4xl md:text-6xl leading-tight">
            El momento que <span className="text-gradient-brand">enmarca</span> tu boda.
          </h2>
          <p className="mt-6 text-muted-foreground text-lg max-w-lg">
            Desde el descorche hasta la última copa, cuidamos cada instante para que tu celebración sea irrepetible. Sin prisa, sin filas, sin compromisos.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 max-w-md">
            <div className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /><span className="text-sm">Servicio cronometrado</span></div>
            <div className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /><span className="text-sm">Cristalería premium</span></div>
            <div className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /><span className="text-sm">Hielo cristal</span></div>
            <div className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /><span className="text-sm">Mixólogos certificados</span></div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative"
        >
          {/* Glow ambiental detrás para fundir con el fondo */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 blur-3xl opacity-70 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.35),rgba(255,180,80,0.18)_40%,transparent_70%)]" />
          <motion.img
            src={champagnePop}
            alt="Botella de champagne descorchándose con explosión de espuma"
            className="w-full h-auto select-none [filter:drop-shadow(0_30px_40px_rgba(0,0,0,0.55))_drop-shadow(0_0_80px_rgba(168,85,247,0.35))]"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            loading="lazy"
            draggable={false}
          />
        </motion.div>
      </div>
    </section>
  );
}

function WhyUs() {
  const reasons = [
    { icon: Award, title: "Más de 200 bodas servidas", desc: "Experiencia comprobada en los venues más exclusivos de la Riviera Maya." },
    { icon: Clock, title: "Servicio sin filas", desc: "Calculamos staff y barras según invitados. Nadie espera más de 90 segundos." },
    { icon: Heart, title: "Insumos top shelf", desc: "Trabajamos solo con destilados premium y frutas frescas locales." },
    { icon: ShieldCheck, title: "Seguro de evento", desc: "Equipo asegurado y permisos vigentes. Tranquilidad total para ti y tu wedding planner." },
    { icon: Users, title: "Equipo bilingüe", desc: "Atendemos a tus invitados internacionales con la misma calidez en español e inglés." },
    { icon: Sparkles, title: "Coctelería de autor", desc: "Diseñamos cócteles con tu nombre, inspirados en tu historia y tu paleta de boda." },
  ];
  return (
    <section className="relative py-32 px-6 bg-card/20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.4em] text-primary">Por qué nosotros</span>
          <h2 className="mt-4 font-display text-4xl md:text-6xl">La diferencia <span className="text-gradient-brand">TAABAL</span>.</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">No solo servimos bebidas. Diseñamos la experiencia que tus invitados recordarán para siempre.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Card className="h-full p-6 bg-card/60 border-border hover:border-primary/40 transition-all hover:translate-y-[-4px] backdrop-blur">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <r.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display text-xl mb-2">{r.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessSteps() {
  const steps = [
    { n: "01", title: "Cotización", desc: "Cuéntanos los detalles. Te respondemos en menos de 24h con propuesta personalizada." },
    { n: "02", title: "Diseño", desc: "Curamos tu carta, paletas y staff. Probamos cócteles juntos antes del gran día." },
    { n: "03", title: "Montaje", desc: "Llegamos 3h antes. Barras impecables, staff uniformado, todo listo para tu llegada." },
    { n: "04", title: "Brindis", desc: "Servicio fluido y memorable. Tu única tarea: celebrar." },
  ];
  return (
    <section className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.4em] text-primary">Cómo trabajamos</span>
          <h2 className="mt-4 font-display text-4xl md:text-6xl">De la idea al <span className="text-gradient-brand">brindis</span>.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 relative">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative"
            >
              <Card className="h-full p-6 bg-card/40 border-border hover:border-primary/40 transition">
                <p className="font-display text-5xl text-primary/30 mb-3">{s.n}</p>
                <h3 className="font-display text-2xl mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { n: "200+", l: "Bodas celebradas" },
    { n: "98%", l: "Clientes que recomiendan" },
    { n: "5★", l: "Promedio de reseñas" },
    { n: "5", l: "Destinos en Riviera Maya" },
  ];
  return (
    <section className="relative py-24 px-6 bg-gradient-to-r from-card via-background to-card border-y border-border">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.08),transparent_60%)]" />
      <div className="relative z-10 mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((s, i) => (
          <motion.div
            key={s.l}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <p className="font-display text-5xl md:text-6xl text-gradient-brand">{s.n}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">{s.l}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    { q: "¿Con cuánto tiempo de anticipación debo reservar?", a: "Recomendamos reservar al menos 4-6 meses antes de tu boda, sobre todo en temporada alta (noviembre a abril). Para fechas muy específicas, hasta 12 meses." },
    { q: "¿Trabajan en cualquier venue de la Riviera Maya?", a: "Sí. Operamos en Cancún, Tulum, Playa del Carmen, Puerto Morelos e Isla Mujeres, en venues privados, hoteles, beach clubs y haciendas. Nos coordinamos directo con tu wedding planner." },
    { q: "¿Qué incluye el servicio de barra libre?", a: "Bartenders certificados, mobiliario de barra, cristalería premium, hielo cristal, mixers, frutas frescas, garnish, y la carta de cócteles diseñada contigo. Las botellas pueden incluirse o ser provistas por ti." },
    { q: "¿Pueden crear cócteles personalizados con nuestros nombres?", a: "Por supuesto. Es uno de nuestros sellos: dos cócteles signature inspirados en la pareja, su historia y la paleta visual de la boda." },
    { q: "¿Qué pasa si llueve o hay clima adverso?", a: "Tenemos planes de contingencia. Coordinamos con tu wedding planner para mover la barra a zona cubierta sin interrumpir el servicio." },
    { q: "¿Aceptan eventos pequeños o íntimos?", a: "Sí. Atendemos bodas desde 30 invitados hasta más de 500. La calidad y atención son las mismas." },
  ];
  return (
    <section className="relative py-32 px-6 bg-card/20">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.4em] text-primary">Preguntas frecuentes</span>
          <h2 className="mt-4 font-display text-4xl md:text-6xl">Antes de <span className="text-gradient-brand">brindar</span>.</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <motion.details
              key={f.q}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group rounded-lg border border-border bg-card/60 p-5 hover:border-primary/40 transition"
            >
              <summary className="cursor-pointer flex items-center justify-between gap-4 font-medium list-none">
                <span>{f.q}</span>
                <span className="text-primary text-2xl transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
}
