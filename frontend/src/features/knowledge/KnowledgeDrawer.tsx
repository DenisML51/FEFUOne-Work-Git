import { Card } from "@/ui";
import { cn } from "@/lib/cn";
import { KnowledgeList } from "./KnowledgeList";

export function KnowledgeDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={cn("fixed inset-0 z-40", !open && "pointer-events-none")}
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
          "absolute inset-y-0 left-0 flex p-3 transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Card className="flex h-full w-[380px] max-w-[88vw] flex-col p-4">
          <KnowledgeList onClose={onClose} />
        </Card>
      </div>
    </div>
  );
}
