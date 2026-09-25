import { motion } from "framer-motion";
import { SlideLink } from "../lib/navigation";
import { useMagnetic } from "../lib/interactions";

/* A SlideLink styled as a .btn that leans toward the cursor while hovered.
   The inner label drifts a touch further than the button for a parallax feel. */
export default function MagneticButton({
  to,
  className = "",
  direction = "forward",
  children,
}: {
  to: string;
  className?: string;
  direction?: "forward" | "back";
  children: React.ReactNode;
}) {
  const { x, y, onMouseMove, onMouseLeave } = useMagnetic(0.4);

  return (
    <motion.span
      style={{ x, y, display: "inline-flex" }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <SlideLink to={to} className={`btn ${className}`} direction={direction}>
        <motion.span style={{ x, y, display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
          {children}
        </motion.span>
      </SlideLink>
    </motion.span>
  );
}
