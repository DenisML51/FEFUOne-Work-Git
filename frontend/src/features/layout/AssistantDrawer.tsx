import { cn } from "@/lib/cn";
import { AssistantPanel } from "@/features/assistant/AssistantPanel";

export function AssistantDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-40 xl:hidden",
        !open && "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <div
        className={cn(
          "absolute inset-0 bg-ink/30 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          "absolute inset-y-0 right-0 flex w-[680px] max-w-[92vw] p-3 transition-transform duration-300 sm:p-4",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <AssistantPanel onClose={onClose} className="h-full w-full" />
      </div>
    </div>
  );
}
