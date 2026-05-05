import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { Trash2, LogOut, Upload } from "lucide-react";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) toast.error(error.message);
  };
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <Card className="w-full max-w-md p-8">
        <Logo className="h-12 mx-auto mb-6" />
        <h1 className="font-display text-3xl text-center mb-6">Panel TAABAL</h1>
        <form onSubmit={submit} className="space-y-4">
          <div><Label>Email</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
          <div><Label>Contraseña</Label><Input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
          <Button type="submit" disabled={busy} className="w-full">{busy ? "..." : "Entrar"}</Button>
          <p className="text-xs text-muted-foreground text-center">Acceso solo para administradores autorizados.</p>
        </form>
      </Card>
    </div>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="min-h-screen p-6">
      <header className="mx-auto max-w-6xl flex items-center justify-between mb-8">
        <Logo className="h-10" />
        <Button variant="outline" size="sm" onClick={onLogout}><LogOut className="h-4 w-4 mr-2" /> Salir</Button>
      </header>
      <div className="mx-auto max-w-6xl">
        <Tabs defaultValue="leads">
          <TabsList>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="gallery">Galería</TabsTrigger>
          </TabsList>
          <TabsContent value="leads"><LeadsPanel /></TabsContent>
          <TabsContent value="gallery"><GalleryPanel /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function LeadsPanel() {
  const [leads, setLeads] = useState<any[]>([]);
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
  return (
    <div className="mt-6 space-y-3">
      {leads.length === 0 && <p className="text-muted-foreground text-sm">Sin leads aún.</p>}
      {leads.map(l => (
        <Card key={l.id} className="p-5">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 space-y-1 text-sm">
              <p className="font-semibold text-primary">{l.name} · {l.email}</p>
              {l.phone && <p>📱 {l.phone}</p>}
              {(l.wedding_date || l.location || l.guests) && <p>{[l.wedding_date, l.location, l.guests && `${l.guests} invitados`].filter(Boolean).join(" · ")}</p>}
              {l.message && <p className="text-muted-foreground italic">"{l.message}"</p>}
              <p className="text-xs text-muted-foreground">{new Date(l.created_at).toLocaleString()}</p>
            </div>
            <Button size="icon" variant="ghost" onClick={() => remove(l.id)}><Trash2 className="h-4 w-4" /></Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

function GalleryPanel() {
  const [images, setImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
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
  return (
    <div className="mt-6">
      <label className="inline-flex items-center gap-2 cursor-pointer mb-6">
        <Button asChild disabled={uploading}><span><Upload className="h-4 w-4 mr-2" /> {uploading ? "Subiendo..." : "Subir imagen"}</span></Button>
        <input type="file" accept="image/*" hidden onChange={upload} />
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map(img => (
          <div key={img.id} className="relative group rounded-lg overflow-hidden border border-border">
            <img src={img.url} alt={img.alt} className="w-full aspect-square object-cover" />
            <Button size="icon" variant="destructive" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100" onClick={() => remove(img)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
