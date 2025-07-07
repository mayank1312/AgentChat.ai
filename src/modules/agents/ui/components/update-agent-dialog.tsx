import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AgentForm } from "./agent-form";
import { AgentGetOne } from "../../types";

interface UpdateAgentDialogProps {
  Open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues:AgentGetOne;
}
export const UpdategentDialog = ({ Open, onOpenChange,initialValues }: UpdateAgentDialogProps) => {
  return (
     <ResponsiveDialog
     title="Edit Agent"
     open={Open}
     onOpenChange={onOpenChange}
     description="Edit the Agent Details"
     >
      <AgentForm
      onSuccess={() => onOpenChange(false)}
      onCancel={() =>  onOpenChange(false)}
      initialValues={initialValues}
      />
     </ResponsiveDialog>

  )}