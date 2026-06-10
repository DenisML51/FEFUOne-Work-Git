import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("rounded-3xl bg-surface shadow-card", className)} {...props} />
  );
}
