import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import sit from "@/assets/rabbit/rabbit-sit.png";
import stand from "@/assets/rabbit/rabbit-stand.png";
import howl from "@/assets/rabbit/rabbit-howl.png";
import leap from "@/assets/rabbit/rabbit-leap.png";
import watch from "@/assets/rabbit/rabbit-watch.png";
import resting from "@/assets/rabbit/rabbit-resting.png";
import tall from "@/assets/rabbit/rabbit-tall.png";
import elegant from "@/assets/rabbit/rabbit-elegant.png";

const variants = { sit, stand, howl, leap, watch, resting, tall, elegant };
export type RabbitVariant = keyof typeof variants;

export function useRabbitsEnabled() {
  const [enabled, setEnabled] = useState(true);
  useEffect(() => {
    let active = true;
    supabase.from("site_content").select("value").eq("key", "rabbits_enabled").maybeSingle().then(({ data }) => {
      if (active && data) setEnabled(data.value === false ? false : true);
    });
    const ch = supabase
      .channel("rabbits-toggle")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "site_content", filter: "key=eq.rabbits_enabled" },
        (payload: any) => setEnabled(payload.new.value === false ? false : true))
      .subscribe();
    return () => { active = false; supabase.removeChannel(ch); };
  }, []);
  return enabled;
}

export function RabbitPeek({
  variant, side = "left", className = "", size = 140, delay = 0, rotate = 0, enabled = true,
}: { variant: RabbitVariant; side?: "left" | "right"; className?: string; size?: number; delay?: number; rotate?: number; enabled?: boolean; }) {
  if (!enabled) return null;
  // Boost global rabbit size by ~35% for stronger visual presence
  const finalSize = Math.round(size * 1.35);
  const fromX = side === "left" ? -finalSize * 0.4 : finalSize * 0.4;
  return (
    <motion.img
      src={variants[variant]} alt=""
      style={{ width: finalSize, height: "auto", transform: `rotate(${rotate}deg)`, zIndex: 0 }}
      className={`pointer-events-none select-none drop-shadow-[0_8px_30px_rgba(0,0,0,0.6)] absolute ${className}`}
      initial={{ x: fromX, opacity: 0 }}
      whileInView={{ x: 0, opacity: 0.85 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ type: "spring", stiffness: 50, damping: 16, delay }}
    />
  );
}
