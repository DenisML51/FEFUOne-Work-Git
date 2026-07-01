import { useState, type KeyboardEvent } from "react";
import { Mic, Paperclip, SendHorizontal, Smile } from "lucide-react";
import { Button, IconButton } from "@/ui";

interface ChatComposerProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

export function ChatComposer({ onSend, disabled }: ChatComposerProps) {
  const [value, setValue] = useState("");

  const submit = () => {
    const text = value.trim();
    if (!text) return;
    onSend(text);
    setValue("");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className="rounded-2xl border border-line bg-surface p-2 transition-colors focus-within:border-faint">
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={onKeyDown}
        rows={1}
        placeholder="Опишите задачу…"
        className="max-h-28 w-full resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-faint"
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-0.5">
          <IconButton className="size-8" aria-label="voice">
            <Mic size={16} />
          </IconButton>
          <IconButton className="size-8" aria-label="attach">
            <Paperclip size={16} />
          </IconButton>
          <IconButton className="size-8" aria-label="emoji">
            <Smile size={16} />
          </IconButton>
        </div>
        <Button
          onClick={submit}
          disabled={disabled || value.trim().length === 0}
          className="h-8 px-4 text-xs"
        >
          Отправить
          <SendHorizontal size={14} />
        </Button>
      </div>
    </div>
  );
}
