import { ResponsiveDialog } from "@/components/responsive-dialog";
import { useRouter } from "next/navigation";
import { MeetingForm } from "./meeting-form";


interface NewMeetingDialogProps {
  Open: boolean;
  onOpenChange: (open: boolean) => void;
}
export const NewMeetingDialog = ({ Open, onOpenChange }: NewMeetingDialogProps) => {
  const router=useRouter();
  return (
     <ResponsiveDialog
     title="New Meeting"
     open={Open}
     onOpenChange={onOpenChange}
     description="Create a new Meeting."
     >
      <MeetingForm
        onSuccess={(id)=>{
          onOpenChange(false);
          router.push(`/meetings/${id}`);
        }}
        onCancel={()=>onOpenChange(false)}
      />
     </ResponsiveDialog>

  )}