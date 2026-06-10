import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type Variant = "plain" | "outline";

const variants: Record<Variant, string> = {
  plain: "hover:bg-muted",
  outline: "border border-line bg-surface hover:border-faint",
};

interface IconButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: Variant;
}

export function IconButton({
  variant = "plain",
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full text-subtle hover:text-ink",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
