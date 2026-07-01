import { Bell, ChevronRight, Home, Search, Sparkles } from "lucide-react";
import { IconButton, Tooltip } from "@/ui";
import { useNav } from "@/features/navigation/NavContext";
import { UploadsMenu } from "@/features/uploads/UploadsMenu";
import { UserMenu } from "@/features/user/UserMenu";

const navLabels: Record<string, string> = {
  overview: "Обзор",
  stock: "Реестр ТМЦ",
  acts: "Акты",
  audits: "Инвентаризации",
  schedule: "График",
  reports: "Отчёты",
  preferences: "Настройки",
  team: "Команда",
  security: "Безопасность",
};

export function TopBar({ onOpenAssistant }: { onOpenAssistant: () => void }) {
  const { active, navigate } = useNav();

  return (
    <div className="flex h-14 items-center justify-between gap-2 rounded-2xl border border-line bg-surface px-3">
      <nav className="flex items-center gap-1.5 text-sm">
        <button
          type="button"
          onClick={() => navigate("overview")}
          className="flex items-center gap-1.5 text-subtle hover:text-ink"
        >
          <Home size={14} />
          Главная
        </button>
        <ChevronRight size={14} className="text-faint" />
        <span className="font-medium text-ink">{navLabels[active]}</span>
      </nav>

      <div className="flex items-center gap-0.5">
        <UploadsMenu />
        <Tooltip label="Уведомления" placement="bottom">
          <IconButton aria-label="Уведомления">
            <Bell size={16} />
          </IconButton>
        </Tooltip>
        <Tooltip label="Поиск по ТМЦ и актам" placement="bottom">
          <IconButton aria-label="Поиск по ТМЦ и актам">
            <Search size={16} />
          </IconButton>
        </Tooltip>
        <Tooltip label="Ассистент" placement="bottom">
          <IconButton
            aria-label="Ассистент"
            onClick={onOpenAssistant}
            className="xl:hidden"
          >
            <Sparkles size={16} />
          </IconButton>
        </Tooltip>
        <div className="mx-1 h-6 w-px bg-line" />
        <UserMenu />
      </div>
    </div>
  );
}
