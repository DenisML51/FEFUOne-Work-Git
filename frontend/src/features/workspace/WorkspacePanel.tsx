import { Card } from "@/ui";
import { TopBar } from "./TopBar";
import { Greeting } from "./Greeting";

export function WorkspacePanel({
  onOpenAssistant,
}: {
  onOpenAssistant: () => void;
}) {
  return (
    <Card className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto p-4">
      <div className="space-y-4">
        <TopBar onOpenAssistant={onOpenAssistant} />
        <Greeting />
      </div>
    </Card>
  );
}
