import { cn } from "@/lib/cn";
import { useUploads } from "./UploadsContext";
import { UploadCard } from "./UploadCard";

export function UploadToasts() {
  const { uploads, remove } = useUploads();
  if (uploads.length === 0) return null;

  return (
    <div className="pointer-events-none fixed top-4 right-4 z-50 flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2">
      {uploads.map((file) => (
        <div
          key={file.id}
          className={cn(
            "pointer-events-auto",
            file.exiting ? "animate-slide-out" : "animate-slide-in",
          )}
        >
          <UploadCard file={file} onRemove={() => remove(file.id)} />
        </div>
      ))}
    </div>
  );
}
