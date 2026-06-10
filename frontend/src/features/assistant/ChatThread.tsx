import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import type { ChatMessage } from "@/types";

interface ChatThreadProps {
  messages: ChatMessage[];
  pending: boolean;
}

export function ChatThread({ messages, pending }: ChatThreadProps) {
  const { t } = useTranslation();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pending]);

  return (
    <div className="flex-1 space-y-3 overflow-y-auto pr-1">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex",
            message.role === "user" ? "justify-end" : "justify-start",
          )}
        >
          <div
            className={cn(
              "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-wrap",
              message.role === "user"
                ? "bg-ink text-white"
                : "bg-muted text-ink",
            )}
          >
            {message.content}
          </div>
        </div>
      ))}
      {pending && (
        <div className="flex justify-start">
          <div className="rounded-2xl bg-muted px-3.5 py-2.5 text-sm text-subtle">
            {t("assistant.thinking")}
          </div>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}
