import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "soft";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-white hover:bg-ink/90",
  ghost: "text-subtle hover:bg-muted hover:text-ink",
  soft: "bg-muted text-ink hover:bg-line",
};

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: Variant;
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
