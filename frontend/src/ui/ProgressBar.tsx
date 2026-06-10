import { cn } from "@/lib/cn";

export type ProgressTone = "brand" | "violet" | "success" | "orange";

const fills: Record<ProgressTone, string> = {
  brand: "bg-brand",
  violet: "bg-violet",
  success: "bg-success",
  orange: "bg-orange",
};

interface ProgressBarProps {
  value: number;
  tone?: ProgressTone;
  className?: string;
}

export function ProgressBar({
  value,
  tone = "brand",
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-line", className)}>
      <div
        className={cn("h-full rounded-full transition-[width] duration-500", fills[tone])}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
