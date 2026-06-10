import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { LogOut, Settings, User, type LucideIcon } from "lucide-react";
import { Avatar } from "@/ui";
import { userName } from "@/data/workspace";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const value =
    parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0].slice(0, 1);
  return value.toUpperCase();
}

const items: { id: string; labelKey: string; icon: LucideIcon }[] = [
  { id: "profile", labelKey: "user.profile", icon: User },
  { id: "settings", labelKey: "user.settings", icon: Settings },
  { id: "logout", labelKey: "user.logout", icon: LogOut },
];

export function UserMenu() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={t("user.menu")}
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-full"
      >
        <Avatar initials={initials(userName)} className="size-10 ring-2 ring-surface" />
      </button>

      {open && (
        <div className="animate-pop absolute bottom-0 left-full z-30 ml-2 w-52 origin-bottom-left rounded-2xl border border-line bg-surface p-2 shadow-float">
          <div className="flex items-center gap-2 px-2 py-1.5">
            <Avatar initials={initials(userName)} className="size-9" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{userName}</p>
              <p className="truncate text-xs text-subtle">{t("user.role")}</p>
            </div>
          </div>
          <div className="my-1 h-px bg-line" />
          {items.map(({ id, labelKey, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-ink hover:bg-muted"
            >
              <Icon size={16} className="text-subtle" />
              {t(labelKey)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
