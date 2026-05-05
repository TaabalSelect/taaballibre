import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import {
  Trash2, LogOut, Upload, Plus, Save, LayoutDashboard, Inbox, Type, Package,
  Image as ImageIcon, Star, Shield, Settings as SettingsIcon, Search, Download,
  TrendingUp, Users, MapPin, Sparkles, Mail,
} from "lucide-react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const Route = createFileRoute("/admin-taabal")({
  head: () => ({ meta: [{ title: "Admin · TAABAL" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: Admin,
});

function Admin() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);
  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando…</div>;
  if (!session) return <Login />;
  return <Dashboard onLogout={() => supabase.auth.signOut()} />;
}

function Login() {
  const [email, setEmail] = useState("BARRASLIBRES@TAABALCANCUN.COM");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.toLowerCase().trim(), password });
    setBusy(false);
    if (error) toast.error(error.message);
  };
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-background via-card to-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.15),transparent_50%)]" />
      <Card className="w-full max-w-md p-10 relative backdrop-blur-xl bg-card/80 border-primary/20 shadow-[var(--shadow-glow)]">
        <Logo className="h-14 mx-auto mb-6" />
        <h1 className="font-display text-3xl text-center">Panel TAABAL</h1>
        <p className="text-center text-xs text-muted-foreground tracking-[0.3em] uppercase mt-2 mb-8">Backstage</p>
        <form onSubmit={submit} className="space-y-4">
          <div><Label>Email</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
          <div><Label>Contraseña</Label><Input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
          <Button type="submit" disabled={busy} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">{busy ? "..." : "Entrar"}</Button>
          <p className="text-xs text-muted-foreground text-center">Acceso solo para administradores autorizados.</p>
        </form>
      </Card>
    </div>
  );
}

type View = "dashboard" | "leads" | "texts" | "packages" | "gallery" | "social" | "contact" | "privacy" | "settings";

const NAV: { id: View; label: string; icon: any }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "leads", label: "Leads", icon: Inbox },
  { id: "texts", label: "Textos", icon: Type },
  { id: "packages", label: "Paquetes", icon: Package },
  { id: "gallery", label: "Galería", icon: ImageIcon },
  { id: "social", label: "Testimonios", icon: Star },
  { id: "contact", label: "Contacto", icon: Mail },
  { id: "privacy", label: "Privacidad", icon: Shield },
  { id: "settings", label: "Ajustes", icon: SettingsIcon },
];

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [view, setView] = useState<View>("dashboard");
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-card/40 backdrop-blur-xl sticky top-0 h-screen">
        <div className="p-6 border-b border-border">
          <Logo className="h-9" />
          <p className="mt-2 text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Backstage TAABAL</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(item => {
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all ${
                  active
                    ? "bg-primary/15 text-primary border-l-2 border-primary"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" /> Cerrar sesión
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-10 backdrop-blur-xl bg-background/80 border-b border-border">
          <div className="flex items-center justify-between px-6 md:px-10 py-4">
            <div>
              <h1 className="font-display text-2xl">{NAV.find(n => n.id === view)?.label}</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Gestión de contenido y operación</p>
            </div>
            <div className="md:hidden">
              <select value={view} onChange={e => setView(e.target.value as View)} className="bg-input rounded-md px-3 py-2 text-sm border border-border">
                {NAV.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
              </select>
            </div>
          </div>
        </header>
        <div className="p-6 md:p-10 max-w-6xl">
          {view === "dashboard" && <DashboardHome onNavigate={setView} />}
          {view === "leads" && <LeadsPanel />}
          {view === "texts" && <TextsPanel />}
          {view === "packages" && <PackagesPanel />}
          {view === "gallery" && <GalleryPanel />}
          {view === "social" && <SocialPanel />}
          {view === "contact" && <ContactPanel />}
          {view === "privacy" && <PrivacyPanel />}
          {view === "settings" && <SettingsPanel />}
        </div>
      </main>
    </div>
  );
}

/* ---------------- Dashboard Home ---------------- */
function DashboardHome({ onNavigate }: { onNavigate: (v: View) => void }) {
  const [leads, setLeads] = useState<any[]>([]);
  const [imgCount, setImgCount] = useState(0);
  useEffect(() => {
    supabase.from("leads").select("*").order("created_at", { ascending: false }).then(({ data }) => setLeads(data || []));
    supabase.from("gallery_images").select("id", { count: "exact", head: true }).then(({ count }) => setImgCount(count || 0));
  }, []);
  const last30 = useMemo(() => {
    const cutoff = Date.now() - 30 * 86400000;
    return leads.filter(l => new Date(l.created_at).getTime() > cutoff).length;
  }, [leads]);
  const topLocation = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach(l => { if (l.location) counts[l.location] = (counts[l.location] || 0) + 1; });
    const arr = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return arr ? arr[0] : "—";
  }, [leads]);

  const stats = [
    { label: "Leads totales", value: leads.length, icon: Inbox, color: "text-primary" },
    { label: "Últimos 30 días", value: last30, icon: TrendingUp, color: "text-accent" },
    { label: "Imágenes en galería", value: imgCount, icon: ImageIcon, color: "text-secondary" },
    { label: "Destino top", value: topLocation, icon: MapPin, color: "text-primary" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="p-5 bg-card/60 backdrop-blur border-border hover:border-primary/40 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</span>
                <Icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <p className="mt-3 font-display text-3xl">{s.value}</p>
            </Card>
          );
        })}
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Últimos leads</h2>
          <Button variant="outline" size="sm" onClick={() => onNavigate("leads")}>Ver todos</Button>
        </div>
        <div className="space-y-2">
          {leads.slice(0, 5).map(l => (
            <div key={l.id} className="flex items-center justify-between gap-4 py-2 border-b border-border last:border-0">
              <div>
                <p className="font-semibold text-sm">{l.name}</p>
                <p className="text-xs text-muted-foreground">{l.email} · {l.location || "Sin ubicación"}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{new Date(l.created_at).toLocaleDateString()}</span>
            </div>
          ))}
          {leads.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">Aún no hay leads. Comparte tu landing.</p>}
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <QuickAction icon={Type} label="Editar textos" onClick={() => onNavigate("texts")} />
        <QuickAction icon={Package} label="Editar paquetes" onClick={() => onNavigate("packages")} />
        <QuickAction icon={ImageIcon} label="Subir a galería" onClick={() => onNavigate("gallery")} />
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, onClick }: any) {
  return (
    <button onClick={onClick} className="group p-5 rounded-lg border border-border bg-card/60 hover:bg-card hover:border-primary/40 transition text-left">
      <Icon className="h-5 w-5 text-primary mb-3" />
      <p className="font-medium text-sm">{label}</p>
      <p className="text-xs text-muted-foreground mt-1">Ir al editor →</p>
    </button>
  );
}

/* ---------------- Leads Panel ---------------- */
function LeadsPanel() {
  const [leads, setLeads] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const load = async () => {
    const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    setLeads(data || []);
  };
  useEffect(() => { load(); }, []);
  const remove = async (id: string) => {
    if (!confirm("¿Eliminar lead?")) return;
    await supabase.from("leads").delete().eq("id", id);
    load();
  };
  const filtered = leads.filter(l =>
    !q || [l.name, l.email, l.location, l.message].some(v => v?.toLowerCase().includes(q.toLowerCase()))
  );
  const exportCsv = () => {
    const headers = ["Fecha", "Nombre", "Email", "Teléfono", "Boda", "Ubicación", "Invitados", "Mensaje"];
    const rows = filtered.map(l => [
      new Date(l.created_at).toLocaleString(),
      l.name, l.email, l.phone || "", l.wedding_date || "", l.location || "", l.guests || "", (l.message || "").replace(/\n/g, " "),
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `leads-taabal-${Date.now()}.csv`;
    a.click();
  };
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Buscar por nombre, email, ubicación…" value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <Badge variant="outline">{filtered.length} {filtered.length === 1 ? "lead" : "leads"}</Badge>
          <Button variant="outline" size="sm" onClick={exportCsv}><Download className="h-4 w-4 mr-2" />CSV</Button>
        </div>
      </div>
      <div className="space-y-3">
        {filtered.length === 0 && <p className="text-muted-foreground text-sm text-center py-12">Sin resultados.</p>}
        {filtered.map(l => (
          <Card key={l.id} className="p-5 hover:border-primary/40 transition">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 space-y-1.5 text-sm min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="font-semibold text-primary">{l.name}</p>
                  <a href={`mailto:${l.email}`} className="text-xs text-muted-foreground hover:text-foreground">{l.email}</a>
                  {l.phone && <a href={`https://wa.me/${l.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="text-xs text-green-500 hover:underline">📱 {l.phone}</a>}
                </div>
                {(l.wedding_date || l.location || l.guests) && (
                  <div className="flex flex-wrap gap-2">
                    {l.wedding_date && <Badge variant="secondary" className="text-xs">📅 {l.wedding_date}</Badge>}
                    {l.location && <Badge variant="secondary" className="text-xs">📍 {l.location}</Badge>}
                    {l.guests && <Badge variant="secondary" className="text-xs">👥 {l.guests}</Badge>}
                  </div>
                )}
                {l.message && <p className="text-muted-foreground italic mt-2">"{l.message}"</p>}
                <p className="text-xs text-muted-foreground/60 pt-1">{new Date(l.created_at).toLocaleString()}</p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => remove(l.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Packages Panel ---------------- */
type Pkg = { name: string; price: string; tagline: string; featured?: boolean; features: string[] };

function PackagesPanel() {
  const [pkgs, setPkgs] = useState<Pkg[]>([]);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    supabase.from("site_content").select("value").eq("key", "packages").maybeSingle().then(({ data }) => {
      if (Array.isArray(data?.value)) setPkgs(data!.value as Pkg[]);
    });
  }, []);
  const update = (i: number, patch: Partial<Pkg>) => setPkgs(arr => arr.map((p, idx) => idx === i ? { ...p, ...patch } : p));
  const updateFeature = (i: number, fi: number, v: string) =>
    setPkgs(arr => arr.map((p, idx) => idx === i ? { ...p, features: p.features.map((f, j) => j === fi ? v : f) } : p));
  const addFeature = (i: number) => update(i, { features: [...pkgs[i].features, "Nuevo elemento"] });
  const removeFeature = (i: number, fi: number) => update(i, { features: pkgs[i].features.filter((_, j) => j !== fi) });
  const addPkg = () => setPkgs([...pkgs, { name: "Nuevo paquete", price: "Cotización", tagline: "Descripción corta", features: ["Item 1"] }]);
  const removePkg = (i: number) => { if (confirm("¿Eliminar paquete?")) setPkgs(pkgs.filter((_, j) => j !== i)); };
  const save = async () => {
    setBusy(true);
    const { error } = await supabase.from("site_content").upsert({ key: "packages", value: pkgs as any });
    setBusy(false);
    if (error) toast.error(error.message); else toast.success("Paquetes actualizados");
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <Button variant="outline" onClick={addPkg}><Plus className="h-4 w-4 mr-2" /> Añadir paquete</Button>
        <Button onClick={save} disabled={busy}><Save className="h-4 w-4 mr-2" /> {busy ? "Guardando..." : "Guardar cambios"}</Button>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {pkgs.map((p, i) => (
          <Card key={i} className={`p-5 space-y-3 ${p.featured ? "border-primary/40" : ""}`}>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Paquete {i + 1}</span>
              <Button size="icon" variant="ghost" onClick={() => removePkg(i)}><Trash2 className="h-4 w-4" /></Button>
            </div>
            <div><Label>Nombre</Label><Input value={p.name} onChange={e => update(i, { name: e.target.value })} /></div>
            <div><Label>Precio</Label><Input value={p.price} onChange={e => update(i, { price: e.target.value })} /></div>
            <div><Label>Tagline</Label><Input value={p.tagline} onChange={e => update(i, { tagline: e.target.value })} /></div>
            <div className="flex items-center gap-2">
              <Switch checked={!!p.featured} onCheckedChange={v => update(i, { featured: v })} />
              <Label>Destacado</Label>
            </div>
            <div>
              <Label>Elementos</Label>
              <div className="space-y-2 mt-1">
                {p.features.map((f, fi) => (
                  <div key={fi} className="flex gap-2">
                    <Input value={f} onChange={e => updateFeature(i, fi, e.target.value)} />
                    <Button size="icon" variant="ghost" onClick={() => removeFeature(i, fi)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
                <Button size="sm" variant="outline" onClick={() => addFeature(i)}><Plus className="h-4 w-4 mr-1" /> Añadir</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Settings Panel ---------------- */
function SettingsPanel() {
  const [enabled, setEnabled] = useState(true);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    supabase.from("site_content").select("value").eq("key", "rabbits_enabled").maybeSingle().then(({ data }) => {
      setEnabled(data?.value === false ? false : true);
      setLoaded(true);
    });
  }, []);
  const toggle = async (v: boolean) => {
    setEnabled(v);
    const { error } = await supabase.from("site_content").upsert({ key: "rabbits_enabled", value: v as any });
    if (error) toast.error(error.message); else toast.success(v ? "Conejos visibles" : "Conejos ocultos");
  };
  if (!loaded) return null;
  return (
    <div className="space-y-4">
      <Card className="p-6 flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl">Mostrar conejos en la web</h3>
          <p className="text-sm text-muted-foreground mt-1">Activa o desactiva todas las apariciones de los conejos en la landing page.</p>
        </div>
        <Switch checked={enabled} onCheckedChange={toggle} />
      </Card>
      <Card className="p-6">
        <h3 className="font-display text-xl mb-2">Credenciales</h3>
        <p className="text-sm text-muted-foreground">Para cambiar tu contraseña, contacta al equipo técnico.</p>
      </Card>
    </div>
  );
}

/* ---------------- Gallery Panel ---------------- */
function GalleryPanel() {
  const [images, setImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const load = async () => {
    const { data } = await supabase.from("gallery_images").select("*").order("position");
    setImages(data || []);
  };
  useEffect(() => { load(); }, []);
  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    const path = `${Date.now()}-${file.name}`;
    const { error: upErr } = await supabase.storage.from("gallery").upload(path, file);
    if (upErr) { toast.error(upErr.message); setUploading(false); return; }
    const { data: pub } = supabase.storage.from("gallery").getPublicUrl(path);
    await supabase.from("gallery_images").insert({ url: pub.publicUrl, alt: file.name, position: images.length });
    setUploading(false);
    load();
  };
  const remove = async (img: any) => {
    if (!confirm("¿Eliminar imagen?")) return;
    await supabase.from("gallery_images").delete().eq("id", img.id);
    load();
  };
  const onDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = images.findIndex(i => i.id === active.id);
    const newIdx = images.findIndex(i => i.id === over.id);
    const reordered = arrayMove(images, oldIdx, newIdx).map((img, idx) => ({ ...img, position: idx }));
    setImages(reordered);
    setSavingOrder(true);
    await Promise.all(reordered.map(img =>
      supabase.from("gallery_images").update({ position: img.position }).eq("id", img.id)
    ));
    setSavingOrder(false);
    toast.success("Orden guardado");
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <Button asChild disabled={uploading}><span><Upload className="h-4 w-4 mr-2" /> {uploading ? "Subiendo..." : "Subir imagen"}</span></Button>
          <input type="file" accept="image/*" hidden onChange={upload} />
        </label>
        <p className="text-xs text-muted-foreground">{savingOrder ? "Guardando orden…" : "Arrastra para reordenar"}</p>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={images.map(i => i.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map(img => (
              <SortableImage key={img.id} img={img} onRemove={() => remove(img)} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      {images.length === 0 && <p className="text-sm text-muted-foreground text-center py-12">Aún no has subido imágenes.</p>}
    </div>
  );
}

function SortableImage({ img, onRemove }: { img: any; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: img.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  return (
    <div ref={setNodeRef} style={style} className="relative group rounded-lg overflow-hidden border border-border touch-none cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
      <img src={img.url} alt={img.alt} className="w-full aspect-square object-cover pointer-events-none" />
      <Button size="icon" variant="destructive" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100" onPointerDown={(e) => e.stopPropagation()} onClick={onRemove}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

/* ---------------- Texts Panel ---------------- */
function TextsPanel() {
  const [hero, setHero] = useState({ badge: "", title_1: "", title_2: "", title_3: "", subtitle: "" });
  const [pillars, setPillars] = useState<{ title: string; desc: string }[]>([
    { title: "", desc: "" }, { title: "", desc: "" }, { title: "", desc: "" }, { title: "", desc: "" },
  ]);
  const [contactText, setContactText] = useState({ eyebrow: "", title: "", subtitle: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_content").select("key,value").in("key", ["hero", "pillars", "contact_text"]);
      data?.forEach(row => {
        if (row.key === "hero" && row.value) setHero(v => ({ ...v, ...(row.value as any) }));
        if (row.key === "pillars" && Array.isArray(row.value)) setPillars(row.value as any);
        if (row.key === "contact_text" && row.value) setContactText(v => ({ ...v, ...(row.value as any) }));
      });
    })();
  }, []);

  const save = async () => {
    setBusy(true);
    const { error } = await supabase.from("site_content").upsert([
      { key: "hero", value: hero as any },
      { key: "pillars", value: pillars as any },
      { key: "contact_text", value: contactText as any },
    ]);
    setBusy(false);
    if (error) toast.error(error.message); else toast.success("Textos guardados");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end"><Button onClick={save} disabled={busy}><Save className="h-4 w-4 mr-2" />{busy ? "Guardando..." : "Guardar todo"}</Button></div>
      <Card className="p-5 space-y-3">
        <h3 className="font-display text-xl">Hero</h3>
        <div><Label>Badge</Label><Input value={hero.badge} onChange={e => setHero({ ...hero, badge: e.target.value })} /></div>
        <div className="grid grid-cols-3 gap-3">
          <div><Label>Título parte 1</Label><Input value={hero.title_1} onChange={e => setHero({ ...hero, title_1: e.target.value })} /></div>
          <div><Label>Título destacado</Label><Input value={hero.title_2} onChange={e => setHero({ ...hero, title_2: e.target.value })} /></div>
          <div><Label>Título parte 3</Label><Input value={hero.title_3} onChange={e => setHero({ ...hero, title_3: e.target.value })} /></div>
        </div>
        <div><Label>Subtítulo</Label><Textarea rows={3} value={hero.subtitle} onChange={e => setHero({ ...hero, subtitle: e.target.value })} /></div>
      </Card>
      <Card className="p-5 space-y-3">
        <h3 className="font-display text-xl">Pilares (Por qué TAABAL)</h3>
        {pillars.map((p, i) => (
          <div key={i} className="grid md:grid-cols-2 gap-3 border-t border-border pt-3 first:border-0 first:pt-0">
            <div><Label>Pilar {i + 1} · Título</Label><Input value={p.title} onChange={e => setPillars(arr => arr.map((x, j) => j === i ? { ...x, title: e.target.value } : x))} /></div>
            <div><Label>Descripción</Label><Textarea rows={2} value={p.desc} onChange={e => setPillars(arr => arr.map((x, j) => j === i ? { ...x, desc: e.target.value } : x))} /></div>
          </div>
        ))}
      </Card>
      <Card className="p-5 space-y-3">
        <h3 className="font-display text-xl">Sección Contacto</h3>
        <div><Label>Eyebrow</Label><Input value={contactText.eyebrow} onChange={e => setContactText({ ...contactText, eyebrow: e.target.value })} /></div>
        <div><Label>Título</Label><Input value={contactText.title} onChange={e => setContactText({ ...contactText, title: e.target.value })} /></div>
        <div><Label>Subtítulo</Label><Textarea rows={2} value={contactText.subtitle} onChange={e => setContactText({ ...contactText, subtitle: e.target.value })} /></div>
      </Card>
    </div>
  );
}

/* ---------------- Privacy Panel ---------------- */
function PrivacyPanel() {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    supabase.from("site_content").select("value").eq("key", "privacy").maybeSingle().then(({ data }) => {
      if (typeof data?.value === "string") setText(data.value);
      else if (data?.value && (data.value as any).text) setText((data.value as any).text);
    });
  }, []);
  const save = async () => {
    setBusy(true);
    const { error } = await supabase.from("site_content").upsert({ key: "privacy", value: text as any });
    setBusy(false);
    if (error) toast.error(error.message); else toast.success("Política actualizada");
  };
  return (
    <Card className="p-5 space-y-3">
      <h3 className="font-display text-xl">Política de Privacidad (LFPDPPP)</h3>
      <p className="text-xs text-muted-foreground">Texto público en /privacidad. Enlazado desde el checkbox del formulario.</p>
      <Textarea rows={14} value={text} onChange={e => setText(e.target.value)} />
      <div className="flex justify-end"><Button onClick={save} disabled={busy}><Save className="h-4 w-4 mr-2" />{busy ? "..." : "Guardar"}</Button></div>
    </Card>
  );
}

/* ---------------- Social Proof Panel ---------------- */
type Testimonial = { name: string; role?: string; quote: string };
type Planner = { name: string; logoUrl?: string };
function SocialPanel() {
  const [enabled, setEnabled] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [planners, setPlanners] = useState<Planner[]>([]);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    supabase.from("site_content").select("value").eq("key", "social_proof").maybeSingle().then(({ data }) => {
      const v = (data?.value as any) || {};
      setEnabled(!!v.enabled);
      setTestimonials(v.testimonials || []);
      setPlanners(v.planners || []);
    });
  }, []);
  const save = async () => {
    setBusy(true);
    const { error } = await supabase.from("site_content").upsert({ key: "social_proof", value: { enabled, testimonials, planners } as any });
    setBusy(false);
    if (error) toast.error(error.message); else toast.success("Guardado");
  };
  return (
    <div className="space-y-6">
      <Card className="p-5 flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl">Mostrar sección de Testimonios</h3>
          <p className="text-sm text-muted-foreground">Activa cuando tengas contenido recopilado.</p>
        </div>
        <Switch checked={enabled} onCheckedChange={setEnabled} />
      </Card>

      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl flex items-center gap-2"><Users className="h-4 w-4 text-primary" />Testimonios de novios</h3>
          <Button size="sm" variant="outline" onClick={() => setTestimonials([...testimonials, { name: "", role: "", quote: "" }])}><Plus className="h-4 w-4 mr-1" />Añadir</Button>
        </div>
        {testimonials.map((t, i) => (
          <div key={i} className="border-t border-border pt-3 space-y-2">
            <div className="grid md:grid-cols-2 gap-2">
              <Input placeholder="Nombre" value={t.name} onChange={e => setTestimonials(a => a.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
              <Input placeholder="Rol (Novia, Novio…)" value={t.role || ""} onChange={e => setTestimonials(a => a.map((x, j) => j === i ? { ...x, role: e.target.value } : x))} />
            </div>
            <Textarea rows={2} placeholder="Testimonio" value={t.quote} onChange={e => setTestimonials(a => a.map((x, j) => j === i ? { ...x, quote: e.target.value } : x))} />
            <Button size="sm" variant="ghost" onClick={() => setTestimonials(testimonials.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
      </Card>

      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl">Wedding Planners aliados</h3>
          <Button size="sm" variant="outline" onClick={() => setPlanners([...planners, { name: "", logoUrl: "" }])}><Plus className="h-4 w-4 mr-1" />Añadir</Button>
        </div>
        {planners.map((p, i) => (
          <div key={i} className="border-t border-border pt-3 grid md:grid-cols-3 gap-2 items-center">
            <Input placeholder="Nombre" value={p.name} onChange={e => setPlanners(a => a.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
            <Input placeholder="URL del logo (opcional)" value={p.logoUrl || ""} onChange={e => setPlanners(a => a.map((x, j) => j === i ? { ...x, logoUrl: e.target.value } : x))} />
            <Button size="sm" variant="ghost" onClick={() => setPlanners(planners.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
      </Card>

      <div className="flex justify-end"><Button onClick={save} disabled={busy}><Save className="h-4 w-4 mr-2" />{busy ? "..." : "Guardar"}</Button></div>
    </div>
  );
}
