import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* Replaces react-markdown's default <pre>. Adds a copy button that reads the
   rendered text straight off the DOM node, with a springy "Copied!" confirm. */
export default function CodeBlock({ children }: { children?: ReactNode }) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const text = ref.current?.innerText ?? "";
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* clipboard blocked — swallow */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="code-wrap">
      <button
        className={"copy-btn" + (copied ? " is-copied" : "")}
        onClick={copy}
        aria-label="Copy code"
        type="button"
      >
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="ok"
              initial={{ opacity: 0, y: 6, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ type: "spring", stiffness: 500, damping: 24 }}
            >
              Copied!
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              Copy
            </motion.span>
          )}
        </AnimatePresence>
      </button>
      <pre ref={ref}>{children}</pre>
    </div>
  );
}
