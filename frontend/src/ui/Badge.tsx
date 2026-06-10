import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BadgeTone = "sky" | "amber" | "mint" | "rose" | "neutral";

const tones: Record<BadgeTone, string> = {
  sky: "bg-tint-sky text-[#2563eb]",
  amber: "bg-tint-amber text-[#b7791f]",
  mint: "bg-tint-mint text-[#15803d]",
  rose: "bg-tint-rose text-[#dc2626]",
  neutral: "bg-muted text-subtle",
};

interface BadgeProps {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}

export function Badge({ tone = "neutral", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
