"use client";

import { Button } from "@/components/ui/button";

import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { NewMeetingDialog } from "./new-meeting-dialog";

export const MeetingsListHeaders = () => {
 const [isDialogOpen,setIsDialogOpen]=useState(false);
  return (
    <>
    <NewMeetingDialog
    Open={isDialogOpen}
    onOpenChange={setIsDialogOpen}

    />
      <div className="flex flex-col px-4 py-4 md:px-8 gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-xl">My Meetings</h5>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusIcon />
            New Meeting
          </Button>
        </div>
        <div className="flex items-center gap-x-2 p-1">
        </div>
      </div>
    </>
  );
}