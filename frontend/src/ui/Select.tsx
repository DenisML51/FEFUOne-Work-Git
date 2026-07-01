import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface SelectOption<T extends string | number = string> {
  value: T;
  label: string;
  description?: string | undefined;
  icon?: ReactNode | undefined;
  disabled?: boolean | undefined;
}

interface SelectProps<T extends string | number> {
  value: T | undefined;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  /** Which way the options panel opens. Defaults to `bottom`. */
  placement?: "bottom" | "top";
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

/**
 * Custom select / picker built to match the app's popover language
 * (`.animate-pop`, theme tokens). Keyboard-dismissable, closes on outside
 * click, and highlights the active option with a check mark.
 */
export function Select<T extends string | number>({
  value,
  options,
  onChange,
  placeholder = "Выберите…",
  placement = "bottom",
  className,
  disabled,
  ariaLabel,
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

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
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex w-full items-center gap-2 rounded-lg border border-line bg-muted px-2.5 py-1.5 text-left text-sm outline-none transition-colors",
          "hover:bg-surface focus-visible:border-ink/30 focus-visible:bg-surface",
          open && "border-ink/30 bg-surface",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        {selected?.icon && <span className="shrink-0 text-subtle">{selected.icon}</span>}
        <span className={cn("min-w-0 flex-1 truncate", !selected && "text-subtle")}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={cn(
            "shrink-0 text-subtle transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className={cn(
            "animate-pop absolute z-40 max-h-60 w-full overflow-y-auto rounded-xl border border-line bg-surface p-1 shadow-float",
            placement === "top"
              ? "bottom-full mb-1.5 origin-bottom"
              : "top-full mt-1.5 origin-top",
          )}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={String(option.value)}
                type="button"
                role="option"
                aria-selected={isSelected}
                disabled={option.disabled}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left text-sm",
                  option.disabled
                    ? "cursor-not-allowed text-faint"
                    : "text-ink hover:bg-muted",
                  isSelected && "bg-muted",
                )}
              >
                {option.icon && (
                  <span className="mt-0.5 shrink-0 text-subtle">{option.icon}</span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{option.label}</span>
                  {option.description && (
                    <span className="block truncate text-xs text-subtle">
                      {option.description}
                    </span>
                  )}
                </span>
                {isSelected && (
                  <Check size={15} className="mt-0.5 shrink-0 text-brand" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
