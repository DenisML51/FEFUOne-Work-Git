import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";

const languages = ["ru", "en"] as const;

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language.startsWith("en") ? "en" : "ru";

  return (
    <div className="inline-flex items-center">
      {languages.map((language) => (
        <button
          key={language}
          type="button"
          onClick={() => void i18n.changeLanguage(language)}
          className={cn(
            "rounded-full px-2 py-1 text-[11px] font-semibold uppercase",
            current === language ? "bg-ink text-white" : "text-subtle hover:text-ink",
          )}
        >
          {language}
        </button>
      ))}
    </div>
  );
}
