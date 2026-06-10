import { useTranslation } from "react-i18next";
import { Tag } from "@/ui";
import { assistantTopics } from "@/data/workspace";

const dotColors = [
  "bg-brand",
  "bg-violet",
  "bg-success",
  "bg-info",
  "bg-orange",
];

export function TopicTags({ onSelect }: { onSelect: (text: string) => void }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {assistantTopics.map((topic, index) => {
        const label = t(topic.labelKey);
        return (
          <Tag
            key={topic.id}
            onClick={() => onSelect(label)}
            icon={
              <span
                className={`size-1.5 rounded-full ${dotColors[index % dotColors.length]}`}
              />
            }
          >
            {label}
          </Tag>
        );
      })}
    </div>
  );
}
