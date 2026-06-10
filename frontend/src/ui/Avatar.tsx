import { cn } from "@/lib/cn";

interface AvatarProps {
  initials: string;
  className?: string;
}

export function Avatar({ initials, className }: AvatarProps) {
  return (
    <span
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white",
        className,
      )}
    >
      {initials}
    </span>
  );
}
