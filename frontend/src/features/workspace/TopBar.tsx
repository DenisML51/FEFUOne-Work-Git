import { useTranslation } from "react-i18next";
import { Bell, ChevronRight, Home, Search, Sparkles } from "lucide-react";
import { IconButton, Tooltip } from "@/ui";
import { useNav } from "@/features/navigation/NavContext";
import { LanguageSwitcher } from "@/features/layout/LanguageSwitcher";
import { UploadsMenu } from "@/features/uploads/UploadsMenu";

export function TopBar({ onOpenAssistant }: { onOpenAssistant: () => void }) {
  const { t } = useTranslation();
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
          {t("topbar.home")}
        </button>
        <ChevronRight size={14} className="text-faint" />
        <span className="font-medium text-ink">{t(`nav.${active}`)}</span>
      </nav>

      <div className="flex items-center gap-0.5">
        <LanguageSwitcher />
        <UploadsMenu />
        <Tooltip label={t("nav.notifications")} placement="bottom">
          <IconButton aria-label={t("nav.notifications")}>
            <Bell size={16} />
          </IconButton>
        </Tooltip>
        <Tooltip label={t("topbar.search")} placement="bottom">
          <IconButton aria-label={t("topbar.search")}>
            <Search size={16} />
          </IconButton>
        </Tooltip>
        <Tooltip label={t("topbar.assistant")} placement="bottom">
          <IconButton
            aria-label={t("topbar.assistant")}
            onClick={onOpenAssistant}
            className="xl:hidden"
          >
            <Sparkles size={16} />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
}
