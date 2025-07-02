import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AgentForm } from "./agent-form";

interface NewAgentDialogProps {
  Open: boolean;
  onOpenChange: (open: boolean) => void;
}
export const NewAgentDialog = ({ Open, onOpenChange }: NewAgentDialogProps) => {
  return (
     <ResponsiveDialog
     title="New Agent"
     open={Open}
     onOpenChange={onOpenChange}
     description="Create a new agent to automate tasks and workflows."
     >
      <AgentForm
      onSuccess={() => onOpenChange(false)}
      onCancel={() =>  onOpenChange(false)}
      />
     </ResponsiveDialog>

  )}