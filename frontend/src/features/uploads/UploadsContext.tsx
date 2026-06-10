import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { UploadFile, UploadPreset } from "@/types";

const STEP = 14;
const TICK_MS = 320;
const SUCCESS_HOLD_MS = 2000;
const EXIT_MS = 240;

interface UploadsValue {
  uploads: UploadFile[];
  uploading: boolean;
  trigger: (preset: UploadPreset) => void;
  remove: (id: string) => void;
}

const UploadsContext = createContext<UploadsValue | null>(null);

export function UploadsProvider({ children }: { children: ReactNode }) {
  const [uploads, setUploads] = useState<UploadFile[]>([]);
  const scheduled = useRef<Set<string>>(new Set());

  const uploading = uploads.some((file) => file.status === "uploading");

  useEffect(() => {
    if (!uploading) return;
    const id = setInterval(() => {
      setUploads((prev) =>
        prev.map((file) => {
          if (file.status !== "uploading") return file;
          const next = file.progress + STEP;
          return next >= 100
            ? { ...file, progress: 100, status: "completed" }
            : { ...file, progress: next };
        }),
      );
    }, TICK_MS);
    return () => clearInterval(id);
  }, [uploading]);

  const remove = useCallback((id: string) => {
    scheduled.current.delete(id);
    setUploads((prev) =>
      prev.map((file) => (file.id === id ? { ...file, exiting: true } : file)),
    );
    setTimeout(
      () => setUploads((prev) => prev.filter((file) => file.id !== id)),
      EXIT_MS,
    );
  }, []);

  useEffect(() => {
    for (const file of uploads) {
      if (
        file.status === "completed" &&
        !file.exiting &&
        !scheduled.current.has(file.id)
      ) {
        scheduled.current.add(file.id);
        setTimeout(() => remove(file.id), SUCCESS_HOLD_MS);
      }
    }
  }, [uploads, remove]);

  const trigger = useCallback((preset: UploadPreset) => {
    setUploads((prev) => [
      {
        id: crypto.randomUUID(),
        name: preset.name,
        totalMb: preset.totalMb,
        progress: 0,
        status: "uploading",
      },
      ...prev,
    ]);
  }, []);

  const value = useMemo<UploadsValue>(
    () => ({ uploads, uploading, trigger, remove }),
    [uploads, uploading, trigger, remove],
  );

  return <UploadsContext value={value}>{children}</UploadsContext>;
}

export function useUploads(): UploadsValue {
  const value = useContext(UploadsContext);
  if (!value) throw new Error("useUploads must be used within UploadsProvider");
  return value;
}
