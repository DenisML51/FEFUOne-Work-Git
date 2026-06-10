import { useTranslation } from "react-i18next";
import { TopicTags } from "./TopicTags";
import { Suggestions } from "./Suggestions";
import { userName } from "@/data/workspace";

export function AssistantHero({ onSelect }: { onSelect: (text: string) => void }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 px-2 text-center">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          {t("assistant.hero", { name: userName })}
        </h2>
        <p className="mx-auto max-w-[260px] text-sm text-subtle">
          {t("assistant.subtitle")}
        </p>
      </div>
      <TopicTags onSelect={onSelect} />
      <Suggestions onSelect={onSelect} />
    </div>
  );
}
