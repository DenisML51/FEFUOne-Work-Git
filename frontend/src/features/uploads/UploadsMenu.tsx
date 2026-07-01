import { useEffect, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { IconButton, Tooltip } from "@/ui";
import { useUploads } from "./UploadsContext";
import { uploadPresets } from "@/data/assistant";

const presetLabels: Record<string, string> = {
  "uploads.presets.stock": "Остатки",
  "uploads.presets.receipts": "Поступления",
  "uploads.presets.act": "Акт",
};

export function UploadsMenu() {
  const { trigger, uploading } = useUploads();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <Tooltip label="Загрузки" placement="bottom">
        <IconButton
          aria-label="Загрузки"
          className="relative"
          onClick={() => setOpen((prev) => !prev)}
        >
          <UploadCloud size={16} />
          {uploading && (
            <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-orange" />
          )}
        </IconButton>
      </Tooltip>

      {open && (
        <div className="animate-pop absolute right-0 z-30 mt-2 w-56 origin-top-right rounded-2xl border border-line bg-surface p-3 shadow-float">
          <h3 className="text-sm font-semibold">Загрузка данных</h3>
          <p className="mt-1 text-xs text-subtle">Выберите источник — загрузка пройдёт автоматически.</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {uploadPresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  trigger(preset);
                  setOpen(false);
                }}
                className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-ink hover:bg-line"
              >
                {presetLabels[preset.labelKey]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
