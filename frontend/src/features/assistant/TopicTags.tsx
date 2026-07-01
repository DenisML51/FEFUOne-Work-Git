import { Tag } from "@/ui";
import { assistantTopics } from "@/data/workspace";

const dotColors = [
  "bg-brand",
  "bg-violet",
  "bg-success",
  "bg-info",
  "bg-orange",
];

const topicLabels: Record<string, string> = {
  "assistant.topics.stock": "Остатки",
  "assistant.topics.acts": "Акты",
  "assistant.topics.audits": "Инвентаризации",
  "assistant.topics.schedule": "График",
  "assistant.topics.reports": "Отчёты",
};

export function TopicTags({ onSelect }: { onSelect: (text: string) => void }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {assistantTopics.map((topic, index) => {
        const label = topicLabels[topic.labelKey];
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
