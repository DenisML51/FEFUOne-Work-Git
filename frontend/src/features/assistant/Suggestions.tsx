import { assistantSuggestions } from "@/data/workspace";

const suggestionLabels: Record<string, string> = {
  "assistant.suggestions.writeoff": "Сформировать акт списания",
  "assistant.suggestions.audit": "План инвентаризации",
  "assistant.suggestions.shortage": "Найти расхождения по остаткам",
};

export function Suggestions({ onSelect }: { onSelect: (text: string) => void }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-subtle">
      {assistantSuggestions.map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => onSelect(suggestionLabels[key])}
          className="underline-offset-2 hover:text-ink hover:underline"
        >
          {suggestionLabels[key]}
        </button>
      ))}
    </div>
  );
}
