import { LogOut, Settings, User, type LucideIcon } from "lucide-react";
import { Avatar, Dropdown, Select } from "@/ui";
import { useAuth } from "@/features/auth/AuthContext";
import { initialsOf } from "@/features/auth/name";

const items: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "profile", label: "Профиль", icon: User },
  { id: "settings", label: "Настройки", icon: Settings },
];

export function UserMenu() {
  const { user, logout, setRole } = useAuth();

  const fullName = user?.full_name ?? "";
  const roleTitle = user?.current_role?.role.title ?? null;
  const initials = initialsOf(fullName);
  const photo = user?.photo_link ?? undefined;
  const isYandex = Boolean(user?.yandex_id);
  const roles = user?.roles ?? [];
  const roleOptions = roles.map((config) => ({
    value: config.config_id,
    label: config.role.title,
    description: config.subdivision?.title,
  }));

  return (
    <Dropdown
      ariaLabel="Меню пользователя"
      placement="bottom-end"
      triggerClassName="rounded-full"
      panelClassName="w-64"
      trigger={
        <Avatar
          initials={initials}
          src={photo}
          alt={fullName}
          className="size-9 ring-2 ring-surface"
        />
      }
    >
      {(close) => (
        <>
          <div className="flex items-center gap-2 px-2 py-1.5">
            <Avatar initials={initials} src={photo} alt={fullName} className="size-9" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{fullName}</p>
              {roleTitle && (
                <p className="truncate text-xs text-subtle">{roleTitle}</p>
              )}
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
              Вход через Яндекс
            </span>
          )}
          {roles.length > 1 && (
            <div className="px-2 pt-2">
              <label className="text-xs text-subtle">Активная роль</label>
              <Select
                className="mt-1"
                ariaLabel="Активная роль"
                value={user?.current_role?.config_id}
                options={roleOptions}
                onChange={(value) => void setRole(value)}
              />
            </div>
          )}
          <div className="my-1 h-px bg-line" />
          {items.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={close}
              className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-ink hover:bg-muted"
            >
              <Icon size={16} className="text-subtle" />
              {label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              close();
              void logout();
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-ink hover:bg-muted"
          >
            <LogOut size={16} className="text-subtle" />
            Выйти
          </button>
        </>
      )}
    </Dropdown>
  );
}
