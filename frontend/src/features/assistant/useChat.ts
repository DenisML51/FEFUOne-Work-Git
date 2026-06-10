import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { apiFetch } from "@/lib/api";
import { useSessions } from "@/features/sessions/SessionsContext";
import type { ChatRequest, ChatResponse } from "@/types";

interface SendVariables {
  request: ChatRequest;
  sessionId: string;
}

export function useChat() {
  const { t } = useTranslation();
  const { active, activeId, append, clear } = useSessions();

  const mutation = useMutation({
    mutationFn: ({ request }: SendVariables) =>
      apiFetch<ChatResponse>("/agent/chat", {
        method: "POST",
        body: JSON.stringify(request),
      }),
    onSuccess: (response, { sessionId }) =>
      append(sessionId, {
        id: response.id,
        role: "assistant",
        content: response.reply,
      }),
    onError: (_error, { sessionId }) =>
      append(sessionId, {
        id: crypto.randomUUID(),
        role: "assistant",
        content: t("assistant.error"),
      }),
  });

  const send = useCallback(
    (text: string) => {
      const content = text.trim();
      if (!content || mutation.isPending) return;
      const sessionId = activeId;
      const history = active.messages.map((message) => ({
        role: message.role,
        content: message.content,
      }));
      append(sessionId, { id: crypto.randomUUID(), role: "user", content });
      mutation.mutate({ request: { message: content, history }, sessionId });
    },
    [active.messages, activeId, append, mutation],
  );

  const isPending =
    mutation.isPending && mutation.variables?.sessionId === activeId;

  const reset = useCallback(() => clear(activeId), [clear, activeId]);

  return { messages: active.messages, send, isPending, reset };
}
