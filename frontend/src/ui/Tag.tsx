import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface TagProps extends ComponentPropsWithoutRef<"button"> {
  icon?: ReactNode;
}

export function Tag({ icon, className, children, ...props }: TagProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-subtle hover:border-faint hover:text-ink",
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
