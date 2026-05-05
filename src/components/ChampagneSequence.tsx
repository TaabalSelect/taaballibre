import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 10;
const frameUrl = (i: number) => `/frames/champagne_${String(i).padStart(2, "0")}.webp`;

const STAGES = [
  { at: 0.0, title: "El descorche", text: "Cada brindis empieza con un instante. La promesa de la celebración." },
  { at: 0.35, title: "La explosión", text: "Espuma, luz y sonido. El momento que todos recordarán." },
  { at: 0.7, title: "El brindis", text: "Copa de cristal, burbujas finas, servicio impecable." },
];

export function ChampagneSequence() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const currentRef = useRef(0);
  const [loaded, setLoaded] = useState(0);
  const [stageIdx, setStageIdx] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const imgs: HTMLImageElement[] = [];
    let count = 0;
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = frameUrl(i);
      img.onload = img.onerror = () => {
        if (cancelled) return;
        count++;
        setLoaded(count);
        if (count === FRAME_COUNT) draw(0);
      };
      imgs.push(img);
    }
    framesRef.current = imgs;
    return () => { cancelled = true; };
  }, []);

  const draw = (idx: number) => {
    const canvas = canvasRef.current;
    const img = framesRef.current[idx];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth * dpr;
    const h = canvas.clientHeight * dpr;
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    const ratio = Math.min(w / img.naturalWidth, h / img.naturalHeight);
    const dw = img.naturalWidth * ratio;
    const dh = img.naturalHeight * ratio;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  };

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = sectionRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const total = el.offsetHeight - window.innerHeight;
        const progress = Math.min(1, Math.max(0, -rect.top / total));
        const idx = Math.min(FRAME_COUNT - 1, Math.floor(progress * FRAME_COUNT));
        if (idx !== currentRef.current) {
          currentRef.current = idx;
          draw(idx);
        }
        let s = 0;
        for (let i = 0; i < STAGES.length; i++) if (progress >= STAGES[i].at) s = i;
        setStageIdx(s);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const onResize = () => draw(currentRef.current);
    window.addEventListener("resize", onResize);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const stage = STAGES[stageIdx];

  return (
    <section ref={sectionRef} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-card to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(255,180,80,0.12),transparent_55%)]" />
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl px-6 w-full relative z-10">
          <div>
            <span className="text-xs uppercase tracking-[0.4em] text-accent">El ritual del descorche</span>
            <h2 className="mt-4 font-display text-4xl md:text-6xl leading-tight">
              <span className="text-gradient-brand">Champagne</span>, el inicio del brindis.
            </h2>
            <div key={stageIdx} className="mt-8 animate-fade-in">
              <h3 className="font-display text-2xl text-primary">{stage.title}</h3>
              <p className="mt-3 text-muted-foreground max-w-md">{stage.text}</p>
            </div>
            <div className="mt-8 flex gap-1.5">
              {STAGES.map((_, i) => (
                <span key={i} className={`h-0.5 w-10 transition-all ${i <= stageIdx ? "bg-primary" : "bg-border"}`} />
              ))}
            </div>
            {loaded < FRAME_COUNT && (
              <p className="mt-6 text-xs text-muted-foreground/60">Cargando secuencia… {loaded}/{FRAME_COUNT}</p>
            )}
          </div>
          <div className="relative h-[560px] w-full">
            <canvas ref={canvasRef} className="h-full w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
