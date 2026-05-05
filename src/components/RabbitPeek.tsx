import { motion } from "framer-motion";
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

export function RabbitPeek({
  variant, side = "left", className = "", size = 140, delay = 0, rotate = 0,
}: { variant: RabbitVariant; side?: "left" | "right"; className?: string; size?: number; delay?: number; rotate?: number; }) {
  const fromX = side === "left" ? -size : size;
  return (
    <motion.img
      src={variants[variant]} alt=""
      style={{ width: size, height: "auto", transform: `rotate(${rotate}deg)` }}
      className={`pointer-events-none select-none drop-shadow-[0_8px_30px_rgba(0,0,0,0.6)] ${className}`}
      initial={{ x: fromX, opacity: 0 }}
      whileInView={{ x: 0, opacity: 0.95 }}
      viewport={{ once: false, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 60, damping: 14, delay }}
    />
  );
}
