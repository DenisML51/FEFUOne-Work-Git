import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { LogOut, Settings, User, type LucideIcon } from "lucide-react";
import { Avatar } from "@/ui";
import { useAuth } from "@/features/auth/AuthContext";
import { initialsOf } from "@/features/auth/name";

const items: { id: string; labelKey: string; icon: LucideIcon }[] = [
  { id: "profile", labelKey: "user.profile", icon: User },
  { id: "settings", labelKey: "user.settings", icon: Settings },
];

export function UserMenu() {
  const { t } = useTranslation();
  const { user, logout, setRole } = useAuth();
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

  const fullName = user?.full_name ?? "";
  const roleTitle = user?.current_role?.role.title ?? t("user.role");
  const initials = initialsOf(fullName);
  const photo = user?.photo_link ?? undefined;
  const isYandex = Boolean(user?.yandex_id);
  const roles = user?.roles ?? [];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={t("user.menu")}
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-full"
      >
        <Avatar
          initials={initials}
          src={photo}
          alt={fullName}
          className="size-10 ring-2 ring-surface"
        />
      </button>

      {open && (
        <div className="animate-pop absolute bottom-0 left-full z-30 ml-2 w-60 origin-bottom-left rounded-2xl border border-line bg-surface p-2 shadow-float">
          <div className="flex items-center gap-2 px-2 py-1.5">
            <Avatar initials={initials} src={photo} alt={fullName} className="size-9" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{fullName}</p>
              <p className="truncate text-xs text-subtle">{roleTitle}</p>
            </div>
          </div>
          {user?.email && (
            <p className="truncate px-2 text-xs text-subtle">{user.email}</p>
          )}
          {isYandex && (
            <span className="mx-2 mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-tint-amber px-2 py-0.5 text-xs font-medium text-ink">
              <span className="flex size-3.5 items-center justify-center rounded-full bg-[#fc3f1d] text-[9px] font-bold text-white">
                Я
              </span>
              {t("user.viaYandex")}
            </span>
          )}
          {roles.length > 1 && (
            <div className="px-2 pt-2">
              <label className="text-xs text-subtle">{t("user.activeRole")}</label>
              <select
                value={user?.current_role?.config_id}
                onChange={(event) => void setRole(Number(event.target.value))}
                className="mt-1 w-full rounded-lg border border-line bg-muted px-2 py-1.5 text-sm outline-none focus:border-ink/30 focus:bg-surface"
              >
                {roles.map((config) => (
                  <option key={config.config_id} value={config.config_id}>
                    {config.role.title}
                    {config.subdivision ? ` — ${config.subdivision.title}` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}
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
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              void logout();
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-ink hover:bg-muted"
          >
            <LogOut size={16} className="text-subtle" />
            {t("user.logout")}
          </button>
        </div>
      )}
    </div>
  );
}
