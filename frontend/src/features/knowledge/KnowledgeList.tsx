import { useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Circle,
  FileText,
  PlayCircle,
  Video,
} from "lucide-react";
import { Badge, CircularProgress, IconButton } from "@/ui";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { knowledgeModules } from "@/data/assistant";
import type { KnowledgeItem, KnowledgeModule } from "@/types";

const statusIcon = {
  done: { Icon: CheckCircle2, className: "text-success" },
  active: { Icon: PlayCircle, className: "text-ink" },
  todo: { Icon: Circle, className: "text-faint" },
};

const knowledgeLabels: Record<string, string> = {
  "knowledge.m1.title": "Учёт и хранение ТМЦ",
  "knowledge.m1.i1": "Приёмка и оприходование",
  "knowledge.m1.i2": "Карточки складского учёта",
  "knowledge.m1.i3": "Маркировка и места хранения",
  "knowledge.m1.i4": "Пересортица: как избежать",
  "knowledge.m2.title": "Инвентаризация и списание",
  "knowledge.m2.i1": "План инвентаризации",
  "knowledge.m2.i2": "Сверка остатков",
  "knowledge.m2.i3": "Оформление акта списания",
};

function Item({ item }: { item: KnowledgeItem }) {
  const { Icon, className } = statusIcon[item.status];
  const KindIcon = item.kind === "video" ? Video : FileText;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl px-2 py-2",
        item.status === "active" && "bg-muted",
      )}
    >
      <Icon size={18} className={className} />
      <div className="min-w-0">
        <p
          className={cn(
            "truncate text-sm",
            item.status === "todo" ? "text-subtle" : "text-ink",
          )}
        >
          {knowledgeLabels[item.titleKey]}
        </p>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-subtle">
          <KindIcon size={12} />
          {item.duration}
        </p>
      </div>
    </div>
  );
}

function Module({ module }: { module: KnowledgeModule }) {
  const [open, setOpen] = useState(module.index === 1);
  const done = module.items.filter((item) => item.status === "done").length;

  return (
    <div className="rounded-2xl border border-line">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left"
      >
        <span className="truncate text-sm font-medium">{knowledgeLabels[module.titleKey]}</span>
        <Badge>{`Раздел ${module.index}`}</Badge>
        <span className="ml-auto text-xs text-subtle">
          {done} / {module.items.length}
        </span>
        <ChevronDown
          size={16}
          className={cn("text-faint transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <div className="space-y-0.5 px-2 pb-2">
          {module.items.map((item) => (
            <Item key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export function KnowledgeList({ onClose }: { onClose?: (() => void) | undefined }) {
  const all = knowledgeModules.flatMap((module) => module.items);
  const done = all.filter((item) => item.status === "done").length;
  const percent = Math.round((done / all.length) * 100);

  return (
    <section className="flex min-h-0 flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">База знаний</h2>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-medium text-subtle">
            {percent}%
            <CircularProgress value={percent} />
          </span>
          {onClose && (
            <IconButton
              variant="outline"
              className="size-8"
              aria-label="Закрыть"
              onClick={onClose}
            >
              <X size={16} />
            </IconButton>
          )}
        </div>
      </div>
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
        {knowledgeModules.map((module) => (
          <Module key={module.id} module={module} />
        ))}
      </div>
    </section>
  );
}
