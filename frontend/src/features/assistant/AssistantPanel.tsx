import { SlidersHorizontal, Trash2, X } from "lucide-react";
import { Card, IconButton, Tooltip } from "@/ui";
import { cn } from "@/lib/cn";
import { AssistantHero } from "./AssistantHero";
import { ChatThread } from "./ChatThread";
import { ChatComposer } from "./ChatComposer";
import { useChat } from "./useChat";

export function AssistantPanel({
  className,
  onClose,
}: {
  className?: string;
  onClose?: (() => void) | undefined;
}) {
  const { messages, send, isPending, reset } = useChat();

  return (
    <aside className={cn("flex min-h-0 flex-col", className)}>
      <Card className="flex min-h-0 flex-1 flex-col gap-4 p-4">
        <div className="flex h-14 items-center justify-between gap-2 rounded-2xl border border-line bg-surface px-3">
          <span className="text-sm font-medium text-subtle">
            ИИ-ассистент МОЛ
          </span>
          <div className="flex items-center gap-0.5">
            <Tooltip label="Очистить чат" placement="bottom">
              <IconButton
                aria-label="Очистить чат"
                onClick={reset}
                disabled={messages.length === 0}
                className="disabled:pointer-events-none disabled:opacity-40"
              >
                <Trash2 size={16} />
              </IconButton>
            </Tooltip>
            <Tooltip label="Фильтры" placement="bottom">
              <IconButton aria-label="Фильтры">
                <SlidersHorizontal size={16} />
              </IconButton>
            </Tooltip>
            {onClose && (
              <Tooltip label="Закрыть" placement="bottom">
                <IconButton
                  aria-label="Закрыть"
                  onClick={onClose}
                  className="xl:hidden"
                >
                  <X size={16} />
                </IconButton>
              </Tooltip>
            )}
          </div>
        </div>

        {messages.length === 0 ? (
          <AssistantHero onSelect={send} />
        ) : (
          <ChatThread messages={messages} pending={isPending} />
        )}
        <ChatComposer onSend={send} disabled={isPending} />
      </Card>
    </aside>
  );
}
