import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export function Lightbox({
  images, index, onClose, onPrev, onNext,
}: { images: { url: string; alt?: string }[]; index: number; onClose: () => void; onPrev: () => void; onNext: () => void; }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose, onPrev, onNext]);
  const img = images[index];
  if (!img) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={onClose}>
      <button aria-label="Cerrar" onClick={onClose} className="absolute top-5 right-5 text-white/80 hover:text-white p-2">
        <X className="h-7 w-7" />
      </button>
      <button aria-label="Anterior" onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-3 md:left-6 text-white/80 hover:text-white p-3">
        <ChevronLeft className="h-10 w-10" />
      </button>
      <img src={img.url} alt={img.alt || ""} className="max-h-[90vh] max-w-[92vw] object-contain" onClick={(e) => e.stopPropagation()} />
      <button aria-label="Siguiente" onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-3 md:right-6 text-white/80 hover:text-white p-3">
        <ChevronRight className="h-10 w-10" />
      </button>
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/60 text-xs tracking-widest">
        {index + 1} / {images.length}
      </div>
    </div>
  );
}