import { ResponsiveDialog } from "@/components/responsive-dialog";

import { MeetingForm } from "./meeting-form";
import { MeetingGetOne } from "../../types";


interface UpdateMeetingDialogProps {
  Open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues:MeetingGetOne;
}
export const UpdateMeetingDialog = ({ Open, onOpenChange,initialValues }: UpdateMeetingDialogProps) => {
  
  return (
     <ResponsiveDialog
     title="Edit Meeting"
     open={Open}
     onOpenChange={onOpenChange}
     description="Edit The Meeting Details"
     >
      <MeetingForm
        onSuccess={()=>onOpenChange(false)}
        onCancel={()=>onOpenChange(false)}
        initialValues={initialValues}
      />
     </ResponsiveDialog>

  )}