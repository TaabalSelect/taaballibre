import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Quote } from "lucide-react";

type Testimonial = { name: string; role?: string; quote: string };
type Planner = { name: string; logoUrl?: string };
type SocialContent = { enabled?: boolean; testimonials?: Testimonial[]; planners?: Planner[] };

export function SocialProof() {
  const [data, setData] = useState<SocialContent | null>(null);
  useEffect(() => {
    supabase.from("site_content").select("value").eq("key", "social_proof").maybeSingle().then(({ data }) => {
      setData((data?.value as SocialContent) || { enabled: false });
    });
  }, []);
  if (!data || data.enabled !== true) return null;
  const testimonials = data.testimonials || [];
  const planners = data.planners || [];
  return (
    <section className="relative py-32 px-6 bg-card/30">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.4em] text-primary">Confianza</span>
          <h2 className="mt-4 font-display text-4xl md:text-6xl">Brindan con nosotros.</h2>
        </div>
        {testimonials.length > 0 && (
          <div className="grid gap-6 md:grid-cols-3 mb-16">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card className="p-7 h-full bg-card/60 border-border">
                  <Quote className="h-6 w-6 text-primary mb-4" />
                  <p className="text-sm leading-relaxed italic">"{t.quote}"</p>
                  <p className="mt-4 text-sm font-semibold text-primary">{t.name}</p>
                  {t.role && <p className="text-xs text-muted-foreground">{t.role}</p>}
                </Card>
              </motion.div>
            ))}
          </div>
        )}
        {planners.length > 0 && (
          <>
            <p className="text-center text-xs uppercase tracking-[0.4em] text-muted-foreground mb-8">Wedding Planners aliados</p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
              {planners.map((p, i) => (
                <div key={i} className="flex items-center justify-center grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition">
                  {p.logoUrl ? <img src={p.logoUrl} alt={p.name} className="max-h-12 object-contain" /> : <span className="text-sm font-display">{p.name}</span>}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}