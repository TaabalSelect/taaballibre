import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 30;
const frameUrl = (i: number) => `/frames/frame_${String(i).padStart(2, "0")}.webp`;

/**
 * Apple-style scroll-bound image sequence.
 * Uses a sticky canvas inside a tall section. Frames are preloaded on mount.
 * Drop your real frames in /public/frames/frame_01.webp ... frame_30.webp
 */
export function MargaritaSequence() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const currentRef = useRef(0);
  const [loaded, setLoaded] = useState(0);

  // Preload all frames
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
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w; canvas.height = h;
    }
    // contain
    const ratio = Math.min(w / img.naturalWidth, h / img.naturalHeight);
    const dw = img.naturalWidth * ratio;
    const dh = img.naturalHeight * ratio;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  };

  // Scroll handler with rAF throttling
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
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => draw(currentRef.current));
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[400vh]">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-card to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.15),transparent_60%)]" />
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl px-6 w-full relative z-10">
          <div>
            <span className="text-xs uppercase tracking-[0.4em] text-accent">Nuestro ritual</span>
            <h2 className="mt-4 font-display text-4xl md:text-6xl leading-tight">
              La <span className="text-gradient-brand">margarita perfecta</span>, pieza por pieza.
            </h2>
            <p className="mt-6 text-muted-foreground max-w-md">
              Cada elemento importa: el corte del lime, la sal artesanal, el hielo cristal, la dosificación exacta. Desliza y observa cómo nace una de nuestras firmas.
            </p>
            {loaded < FRAME_COUNT && (
              <p className="mt-4 text-xs text-muted-foreground/60">Cargando secuencia… {loaded}/{FRAME_COUNT}</p>
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