import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Logo } from "@/components/Logo";
import { RabbitPeek } from "@/components/RabbitPeek";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Sparkles, Wine, Users, MessageCircle, Mail, Phone, Instagram, Facebook, Check } from "lucide-react";
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
  }),
  component: Landing,
});

const PILLARS = [
  { icon: Wine, title: "Mixología de Autor", desc: "Cada cóctel es una pieza única, creada por mixólogos certificados que elevan los sabores de la Riviera." },
  { icon: Sparkles, title: "Servicio Excepcional", desc: "Equipo entrenado para anticiparse: tu único trabajo es disfrutar y celebrar." },
  { icon: Users, title: "Presentación Impecable", desc: "Barras de diseño, cristalería de lujo, hielo cristal y garnish que se ve tan bien como sabe." },
  { icon: MapPin, title: "Riviera Maya", desc: "Cancún, Tulum, Playa del Carmen, Puerto Morelos e Isla Mujeres. Locales, cero improvisaciones." },
];

const PACKAGES = [
  { name: "Signature", price: "Desde $35,000 MXN", tagline: "La esencia TAABAL", features: ["Mixología clásica de autor", "Bartender certificado", "Cristalería premium", "Hasta 80 invitados", "4 horas de servicio"] },
  { name: "Mixología Premium", price: "Desde $65,000 MXN", tagline: "La experiencia completa", featured: true, features: ["Carta personalizada", "2 mixólogos", "Hielo cristal y garnish exótico", "Hasta 150 invitados", "6 horas de servicio", "Estación de mezcal"] },
  { name: "Personalizado", price: "Cotización a medida", tagline: "Tu boda, tus reglas", features: ["Diseño 100% a medida", "Equipo dedicado", "Cócteles con tu nombre", "Sin límite de invitados", "Servicio fluido", "Decoración temática"] },
];

const GALLERY = [g1, g2, g3, g4, g5, g6];

const leadSchema = z.object({
  name: z.string().trim().min(2, "Tu nombre").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  wedding_date: z.string().optional().or(z.literal("")),
  location: z.string().trim().max(100).optional().or(z.literal("")),
  guests: z.coerce.number().int().min(1).max(2000).optional().or(z.literal("" as any)),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

const WHATSAPP = "529981234567";

function Landing() {
  return (
    <main className="relative overflow-x-clip bg-background text-foreground">
      <Nav />
      <Hero />
      <Pillars />
      <MargaritaScroll />
      <Packages />
      <Gallery />
      <Contact />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
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
          <a href="#experiencia" className="hover:text-primary transition">Experiencia</a>
          <a href="#paquetes" className="hover:text-primary transition">Paquetes</a>
          <a href="#galeria" className="hover:text-primary transition">Galería</a>
          <a href="#contacto" className="hover:text-primary transition">Contacto</a>
        </nav>
        <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
          <a href="#contacto">Cotizar</a>
        </Button>
      </div>
    </header>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  return (
    <section ref={ref} className="relative h-[100svh] w-full overflow-hidden">
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <img src={hero} alt="Barra libre de mixología en boda Riviera Maya" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background" />
      </motion.div>
      <RabbitPeek variant="elegant" side="right" size={220} className="absolute right-[-20px] bottom-[18%] z-10" />
      <RabbitPeek variant="watch" side="left" size={120} className="absolute left-6 top-[28%] z-10" delay={0.4} />
      <div className="relative z-20 flex h-full flex-col items-center justify-center text-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <Badge variant="outline" className="mb-6 border-primary/40 text-primary backdrop-blur-sm">
            Riviera Maya · Bodas exclusivas
          </Badge>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.2 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] max-w-5xl"
        >
          La barra libre que <span className="text-gradient-brand">tu boda</span> merece.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }}
          className="mt-6 max-w-xl text-lg text-muted-foreground"
        >
          Mixología de autor, servicio impecable y cero filas. Diseñamos la experiencia de bar para bodas inolvidables en la Riviera Maya.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.9 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[var(--shadow-glow)]">
            <a href="#contacto">Cotiza tu boda</a>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-primary/40 hover:bg-primary/10">
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">
              <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp directo
            </a>
          </Button>
        </motion.div>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
        Desliza
      </div>
    </section>
  );
}

function Pillars() {
  return (
    <section id="experiencia" className="relative py-32 px-6">
      <RabbitPeek variant="howl" side="left" size={150} className="absolute left-0 top-10 opacity-60" />
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-20">
          <span className="text-xs uppercase tracking-[0.4em] text-primary">Nuestra firma</span>
          <h2 className="mt-4 font-display text-4xl md:text-6xl">Cuatro pilares, una experiencia.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
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

function MargaritaScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 1.1, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const lime = useTransform(scrollYProgress, [0, 0.3, 1], [200, 40, 0]);
  const salt = useTransform(scrollYProgress, [0.3, 0.6, 1], [-200, 0, 0]);
  const opacityIce = useTransform(scrollYProgress, [0.4, 0.7], [0, 1]);
  const liquid = useTransform(scrollYProgress, [0.5, 0.9], ["0%", "85%"]);
  return (
    <section ref={ref} className="relative h-[400vh]">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-card to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.15),transparent_60%)]" />
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl px-6 w-full relative">
          <div>
            <span className="text-xs uppercase tracking-[0.4em] text-accent">Nuestro ritual</span>
            <h2 className="mt-4 font-display text-4xl md:text-6xl leading-tight">
              La <span className="text-gradient-brand">margarita perfecta</span>, pieza por pieza.
            </h2>
            <p className="mt-6 text-muted-foreground max-w-md">
              Cada elemento importa: el corte del lime, la sal artesanal, el hielo cristal, la dosificación exacta. Desliza y observa cómo nace una de nuestras firmas.
            </p>
          </div>
          <div className="relative h-[500px] flex items-center justify-center">
            <motion.div style={{ scale, rotate }} className="relative w-[280px] h-[440px]">
              {/* Glass */}
              <div className="absolute inset-x-0 top-10 mx-auto w-[240px] h-[300px] rounded-b-[140px] rounded-t-[8px] border-2 border-primary/40 bg-gradient-to-b from-primary/5 to-primary/10 backdrop-blur-sm overflow-hidden">
                <motion.div
                  style={{ height: liquid }}
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-accent via-primary to-primary/60"
                />
                <motion.div style={{ opacity: opacityIce }} className="absolute inset-2 flex items-end justify-center gap-1 pb-4">
                  <div className="h-10 w-10 rounded bg-white/30 backdrop-blur-md rotate-12" />
                  <div className="h-12 w-10 rounded bg-white/30 backdrop-blur-md -rotate-6" />
                </motion.div>
              </div>
              {/* Stem */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-1 h-20 bg-primary/40" />
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-32 h-2 rounded-full bg-primary/40" />
              {/* Salt rim */}
              <motion.div style={{ x: salt }} className="absolute top-10 left-1/2 -translate-x-1/2 w-[244px] h-3 rounded-full bg-white/80 shadow-lg" />
              {/* Lime */}
              <motion.div style={{ x: lime }} className="absolute top-6 right-2 w-12 h-12 rounded-full bg-gradient-to-br from-lime-400 to-green-600 shadow-lg" />
            </motion.div>
            <RabbitPeek variant="leap" side="right" size={100} className="absolute -right-4 bottom-0" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Packages() {
  return (
    <section id="paquetes" className="relative py-32 px-6">
      <RabbitPeek variant="stand" side="right" size={130} className="absolute right-0 top-20 opacity-70" />
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.4em] text-primary">Paquetes</span>
          <h2 className="mt-4 font-display text-4xl md:text-6xl">Elige tu experiencia.</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {PACKAGES.map((p, i) => (
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
                  {p.features.map(f => (
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
  return (
    <section id="galeria" className="relative py-32 px-6 bg-card/30">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.4em] text-primary">Galería</span>
          <h2 className="mt-4 font-display text-4xl md:text-6xl">Bodas que ya brindaron con nosotros.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3 grid-cols-2">
          {GALLERY.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
              className={`overflow-hidden rounded-2xl border border-border ${i === 0 ? "md:col-span-2 md:row-span-2 aspect-square md:aspect-auto" : "aspect-square"}`}
            >
              <img src={src} alt={`Boda Riviera Maya ${i + 1}`} className="h-full w-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", wedding_date: "", location: "", guests: "", message: "" });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      <RabbitPeek variant="tall" side="left" size={140} className="absolute left-0 bottom-10 opacity-60" />
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.4em] text-primary">Cotiza tu boda</span>
          <h2 className="mt-4 font-display text-4xl md:text-6xl">Brindemos juntos.</h2>
          <p className="mt-4 text-muted-foreground">Cuéntanos los detalles. Te respondemos en menos de 24 horas.</p>
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
            <div className="md:col-span-2 flex flex-col sm:flex-row gap-3">
              <Button type="submit" size="lg" disabled={loading} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                {loading ? "Enviando..." : "Enviar cotización"}
              </Button>
              <Button asChild type="button" size="lg" variant="outline" className="flex-1 border-primary/40">
                <a href={`https://wa.me/${WHATSAPP}?text=${waText}`} target="_blank" rel="noreferrer">
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
  return (
    <footer className="border-t border-border py-12 px-6 bg-card/30">
      <div className="mx-auto max-w-6xl grid md:grid-cols-3 gap-8 items-start">
        <div>
          <Logo className="h-12 w-auto" />
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">Mixología de lujo para bodas en la Riviera Maya.</p>
        </div>
        <div className="text-sm space-y-2">
          <p className="font-semibold text-primary">Contacto</p>
          <p className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" /> hola@taabal.mx</p>
          <p className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" /> +52 998 123 4567</p>
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

function FloatingWhatsApp() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-2xl hover:scale-110 transition-transform"
      aria-label="WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
