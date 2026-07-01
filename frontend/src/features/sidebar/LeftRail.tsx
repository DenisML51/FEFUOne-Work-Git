import {
  BookOpen,
  LayoutGrid,
  MessageSquare,
  Plus,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useNav } from "@/features/navigation/NavContext";
import { useSessions } from "@/features/sessions/SessionsContext";
import { FefuOneLogo } from "@/features/auth/FefuOneLogo";

function SectionLabel({ children }: { children: string }) {
  return (
    <span className="px-1 text-[10px] font-medium tracking-wide text-faint uppercase">
      {children}
    </span>
  );
}

function RailItem({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={active}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm",
        active ? "bg-ink text-white" : "text-subtle hover:bg-muted hover:text-ink",
      )}
    >
      <Icon size={18} strokeWidth={1.75} className="shrink-0" />
      {label}
    </button>
  );
}

export function LeftRail({ onOpenKnowledge }: { onOpenKnowledge: () => void }) {
  const { active, navigate } = useNav();
  const { sessions, activeId, select, create, close } = useSessions();

  return (
    <aside className="flex w-60 shrink-0 flex-col gap-4 py-1">
      <div className="ml-1 flex items-center gap-2.5">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-2xl bg-ink text-white">
          <FefuOneLogo className="size-5" />
        </span>
        <span className="text-[15px] font-semibold tracking-tight">
          FEFU<span className="text-brand">.One</span>
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <SectionLabel>Меню</SectionLabel>
        <RailItem
          icon={LayoutGrid}
          label="Обзор"
          active={active === "overview"}
          onClick={() => navigate("overview")}
        />
        <RailItem
          icon={BookOpen}
          label="База знаний"
          onClick={onOpenKnowledge}
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-1.5">
        <SectionLabel>Сессии</SectionLabel>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-1">
            {sessions.map((session) => {
              const selected = session.id === activeId;
              return (
                <div
                  key={session.id}
                  className={cn(
                    "group flex items-center gap-2.5 rounded-lg px-2.5 py-2",
                    selected
                      ? "bg-muted text-ink"
                      : "text-subtle hover:bg-muted/60 hover:text-ink",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => select(session.id)}
                    className="flex min-w-0 flex-1 items-center gap-2.5 text-sm"
                  >
                    <MessageSquare
                      size={16}
                      className={cn("shrink-0", selected ? "text-ink" : "text-faint")}
                    />
                    {`Сессия ${session.index}`}
                  </button>
                  {sessions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => close(session.id)}
                      aria-label="Закрыть сессию"
                      className="shrink-0 rounded p-0.5 text-faint opacity-0 group-hover:opacity-100 hover:text-ink"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              );
            })}
            <button
              type="button"
              onClick={create}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-subtle hover:bg-muted hover:text-ink"
            >
              <Plus size={16} className="shrink-0" />
              Новая сессия
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
