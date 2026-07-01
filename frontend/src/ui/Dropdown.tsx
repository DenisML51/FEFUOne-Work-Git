import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type DropdownPlacement =
  | "bottom-start"
  | "bottom-end"
  | "top-start"
  | "top-end"
  | "right-start";

const placementClasses: Record<DropdownPlacement, string> = {
  "bottom-start": "top-full left-0 mt-2 origin-top-left",
  "bottom-end": "top-full right-0 mt-2 origin-top-right",
  "top-start": "bottom-full left-0 mb-2 origin-bottom-left",
  "top-end": "bottom-full right-0 mb-2 origin-bottom-right",
  "right-start": "bottom-0 left-full ml-2 origin-bottom-left",
};

interface DropdownProps {
  /** Content rendered inside the trigger button. */
  trigger: ReactNode;
  /** Panel content. When a function, receives `close` to dismiss the menu. */
  children: ReactNode | ((close: () => void) => ReactNode);
  placement?: DropdownPlacement;
  panelClassName?: string;
  triggerClassName?: string;
  ariaLabel?: string;
}

/**
 * Generic popover primitive: manages open state, outside-click and Escape
 * dismissal, and the shared `.animate-pop` panel styling. Both UserMenu and
 * UploadsMenu build on top of this.
 */
export function Dropdown({
  trigger,
  children,
  placement = "bottom-start",
  panelClassName,
  triggerClassName,
  ariaLabel,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((prev) => !prev)}
        className={triggerClassName}
      >
        {trigger}
      </button>
      {open && (
        <div
          role="menu"
          className={cn(
            "animate-pop absolute z-30 rounded-2xl border border-line bg-surface p-2 shadow-float",
            placementClasses[placement],
            panelClassName,
          )}
        >
          {typeof children === "function" ? children(close) : children}
        </div>
      )}
    </div>
  );
}
