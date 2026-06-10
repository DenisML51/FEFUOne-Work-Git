import { useState } from "react";
import { LeftRail } from "@/features/sidebar/LeftRail";
import { WorkspacePanel } from "@/features/workspace/WorkspacePanel";
import { AssistantPanel } from "@/features/assistant/AssistantPanel";
import { AssistantDrawer } from "./AssistantDrawer";
import { KnowledgeDrawer } from "@/features/knowledge/KnowledgeDrawer";
import { UploadToasts } from "@/features/uploads/UploadToasts";

export function AppShell() {
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [knowledgeOpen, setKnowledgeOpen] = useState(false);

  return (
    <div className="flex h-screen w-full gap-3 p-3 sm:p-4">
      <LeftRail onOpenKnowledge={() => setKnowledgeOpen(true)} />
      <WorkspacePanel onOpenAssistant={() => setAssistantOpen(true)} />
      <AssistantPanel className="hidden w-[680px] shrink-0 xl:flex" />

      <AssistantDrawer
        open={assistantOpen}
        onClose={() => setAssistantOpen(false)}
      />
      <KnowledgeDrawer
        open={knowledgeOpen}
        onClose={() => setKnowledgeOpen(false)}
      />
      <UploadToasts />
    </div>
  );
}
