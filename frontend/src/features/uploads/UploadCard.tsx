import { useTranslation } from "react-i18next";
import { CheckCircle2 } from "lucide-react";
import { Button, Card, ProgressBar } from "@/ui";
import type { UploadFile } from "@/types";

export function UploadCard({
  file,
  onRemove,
}: {
  file: UploadFile;
  onRemove: () => void;
}) {
  const { t } = useTranslation();
  const completed = file.status === "completed";
  const ext = file.name.split(".").pop()?.toUpperCase() ?? "FILE";
  const loaded = ((file.totalMb * file.progress) / 100).toFixed(1);

  return (
    <Card className="border border-line p-3 shadow-float">
      <div className="flex items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-orange text-[10px] font-bold text-white">
          {ext}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-medium">{file.name}</p>
            {completed ? (
              <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-success">
                <CheckCircle2 size={14} />
                {t("uploads.completed")}
              </span>
            ) : (
              <span className="shrink-0 text-xs font-medium text-subtle">
                {file.progress}%
              </span>
            )}
          </div>
          <ProgressBar
            value={file.progress}
            tone={completed ? "success" : "orange"}
            className="mt-2"
          />
          <p className="mt-1.5 text-xs text-subtle">
            {t("uploads.size", { loaded, total: file.totalMb })}
          </p>
        </div>
      </div>

      {completed && (
        <div className="mt-3 flex gap-2 pl-12">
          <Button variant="soft" className="h-7 px-3 text-xs">
            {t("uploads.change")}
          </Button>
          <button
            type="button"
            onClick={onRemove}
            className="rounded-full bg-tint-rose px-3 py-1.5 text-xs font-medium text-danger"
          >
            {t("uploads.remove")}
          </button>
        </div>
      )}
    </Card>
  );
}
