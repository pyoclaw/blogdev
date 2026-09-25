import { createContext, useContext, useRef, useCallback, useEffect, type ReactNode } from "react";
import { useNavigate, useLocation, Link as RouterLink, type LinkProps } from "react-router-dom";

/* -------------------------------------------------------------------------
   navigation.tsx — a shared sense of "which way are we going?"

   Horizontal page transitions only feel right when the slide direction
   matches intent: going deeper (clicking a post) should slide the incoming
   page in from the RIGHT; going back should slide it in from the LEFT.

   React Router doesn't tell us direction, so we keep a tiny ref that a
   <SlideLink> sets just before navigating, and the browser Back button
   resets to "backward" via popstate. The <Stage> reads it during the
   AnimatePresence swap.
   ------------------------------------------------------------------------- */

type Direction = 1 | -1;

interface NavCtx {
  getDirection: () => Direction;
  setDirection: (d: Direction) => void;
}

const Ctx = createContext<NavCtx | null>(null);

export function NavProvider({ children }: { children: ReactNode }) {
  const dir = useRef<Direction>(1);

  const value: NavCtx = {
    getDirection: () => dir.current,
    setDirection: (d) => {
      dir.current = d;
    },
  };

  // Browser back/forward: treat as "backward" so the page slides in from left.
  useEffect(() => {
    const handlePopState = () => {
      dir.current = -1;
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useNavDirection() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useNavDirection must be used within NavProvider");
  return ctx;
}

/**
 * A drop-in replacement for react-router's <Link> that records the slide
 * direction before it hands off to the router. `direction="back"` makes it
 * slide in from the left (used by "← back" affordances).
 */
export function SlideLink({
  direction = "forward",
  ...props
}: LinkProps & { direction?: "forward" | "back" }) {
  const { setDirection } = useNavDirection();
  return (
    <RouterLink
      {...props}
      onClick={(e) => {
        setDirection(direction === "back" ? -1 : 1);
        props.onClick?.(e);
      }}
    />
  );
}

/** Programmatic navigation that also sets a direction. */
export function useSlideNavigate() {
  const navigate = useNavigate();
  const { setDirection } = useNavDirection();
  const location = useLocation();
  return useCallback(
    (to: string, direction: "forward" | "back" = "forward") => {
      setDirection(direction === "back" ? -1 : 1);
      if (to === location.pathname) return;
      navigate(to);
    },
    [navigate, setDirection, location.pathname],
  );
}
