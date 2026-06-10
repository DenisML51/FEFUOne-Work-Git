import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Placement = "top" | "bottom" | "left" | "right";

const placements: Record<Placement, string> = {
  top: "bottom-full left-1/2 mb-1.5 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-1.5 -translate-x-1/2",
  left: "right-full top-1/2 mr-1.5 -translate-y-1/2",
  right: "left-full top-1/2 ml-1.5 -translate-y-1/2",
};

interface TooltipProps {
  label: string;
  placement?: Placement;
  children: ReactNode;
}

export function Tooltip({ label, placement = "top", children }: TooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={() => setOpen(false)}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          className={cn(
            "pointer-events-none absolute z-50 whitespace-nowrap rounded-lg bg-ink px-2 py-1 text-xs font-medium text-white shadow-float",
            placements[placement],
          )}
        >
          {label}
        </span>
      )}
    </span>
  );
}
