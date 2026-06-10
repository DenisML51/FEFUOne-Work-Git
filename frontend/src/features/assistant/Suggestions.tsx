import { useTranslation } from "react-i18next";
import { assistantSuggestions } from "@/data/workspace";

export function Suggestions({ onSelect }: { onSelect: (text: string) => void }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-subtle">
      {assistantSuggestions.map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => onSelect(t(key))}
          className="underline-offset-2 hover:text-ink hover:underline"
        >
          {t(key)}
        </button>
      ))}
    </div>
  );
}
