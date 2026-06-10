import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  BookOpen,
  Boxes,
  LayoutGrid,
  MessageSquare,
  MessagesSquare,
  PanelLeftClose,
  Plus,
  X,
  type LucideIcon,
} from "lucide-react";
import { Tooltip } from "@/ui";
import { cn } from "@/lib/cn";
import { useNav } from "@/features/navigation/NavContext";
import { useSessions } from "@/features/sessions/SessionsContext";
import { UserMenu } from "@/features/user/UserMenu";

const railButton = "inline-flex size-10 items-center justify-center rounded-xl";

function Label({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <span
      className={cn(
        "overflow-hidden text-sm whitespace-nowrap transition-[max-width,opacity] duration-200",
        show ? "max-w-[160px] opacity-100" : "max-w-0 opacity-0",
      )}
    >
      {children}
    </span>
  );
}

function SectionLabel({ expanded, children }: { expanded: boolean; children: string }) {
  return (
    <span
      className={cn(
        "text-[10px] font-medium tracking-wide text-faint uppercase",
        expanded ? "px-1" : "text-center",
      )}
    >
      {children}
    </span>
  );
}

function RailItem({
  icon: Icon,
  label,
  active,
  expanded,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  expanded: boolean;
  onClick: () => void;
}) {
  const button = (
    <button
      type="button"
      aria-label={label}
      aria-current={active}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-xl py-2",
        expanded ? "px-2.5" : "justify-center px-0",
        active ? "bg-ink text-white" : "text-subtle hover:bg-muted hover:text-ink",
      )}
    >
      <Icon size={18} strokeWidth={1.75} className="shrink-0" />
      <Label show={expanded}>{label}</Label>
    </button>
  );
  return expanded ? (
    button
  ) : (
    <Tooltip label={label} placement="right">
      {button}
    </Tooltip>
  );
}

export function LeftRail({ onOpenKnowledge }: { onOpenKnowledge: () => void }) {
  const { t } = useTranslation();
  const { active, navigate } = useNav();
  const { sessions, activeId, select, create, close } = useSessions();
  const [expanded, setExpanded] = useState(true);

  return (
    <aside
      className={cn(
        "flex shrink-0 flex-col gap-4 py-1 transition-[width] duration-200",
        expanded ? "w-60" : "w-16",
      )}
    >
      <span
        className={cn(
          "inline-flex size-10 shrink-0 items-center justify-center rounded-2xl bg-ink text-white",
          expanded ? "ml-1 self-start" : "self-center",
        )}
      >
        <Boxes size={20} strokeWidth={1.75} />
      </span>

      <div className="flex flex-col gap-1.5">
        <SectionLabel expanded={expanded}>{t("rail.menu")}</SectionLabel>
        <RailItem
          icon={LayoutGrid}
          label={t("nav.overview")}
          active={active === "overview"}
          expanded={expanded}
          onClick={() => navigate("overview")}
        />
        <RailItem
          icon={BookOpen}
          label={t("nav.knowledge")}
          expanded={expanded}
          onClick={onOpenKnowledge}
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-1.5">
        {expanded ? (
          <div className="flex items-center justify-between px-1">
            <SectionLabel expanded>{t("rail.sessions")}</SectionLabel>
            <button
              type="button"
              aria-label={t("rail.collapse")}
              onClick={() => setExpanded(false)}
              className="text-faint hover:text-ink"
            >
              <PanelLeftClose size={14} />
            </button>
          </div>
        ) : (
          <>
            <SectionLabel expanded={false}>{t("rail.sessions")}</SectionLabel>
            <Tooltip label={t("rail.sessions")} placement="right">
              <button
                type="button"
                aria-label={t("rail.sessions")}
                onClick={() => setExpanded(true)}
                className={cn(
                  railButton,
                  "self-center text-subtle hover:bg-muted hover:text-ink",
                )}
              >
                <MessagesSquare size={18} strokeWidth={1.75} />
              </button>
            </Tooltip>
          </>
        )}

        <div
          className={cn(
            "grid min-h-0 flex-1 transition-[grid-template-rows] duration-200",
            expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="min-h-0 overflow-y-auto">
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
                      className="flex min-w-0 flex-1 items-center gap-2.5"
                    >
                      <MessageSquare
                        size={16}
                        className={cn(
                          "shrink-0",
                          selected ? "text-ink" : "text-faint",
                        )}
                      />
                      <Label show={expanded}>
                        {t("sessions.item", { n: session.index })}
                      </Label>
                    </button>
                    {sessions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => close(session.id)}
                        aria-label={t("sessions.close")}
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
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-subtle hover:bg-muted hover:text-ink"
              >
                <Plus size={16} className="shrink-0" />
                <Label show={expanded}>{t("sessions.new")}</Label>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <SectionLabel expanded={expanded}>{t("rail.account")}</SectionLabel>
        <div className={cn("flex", expanded ? "px-1" : "justify-center")}>
          <UserMenu />
        </div>
      </div>
    </aside>
  );
}
