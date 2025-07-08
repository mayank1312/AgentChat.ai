"use client";

import { Button } from "@/components/ui/button";

import { PlusIcon, XCircleIcon } from "lucide-react";
import { useState } from "react";
import { NewMeetingDialog } from "./new-meeting-dialog";
import { MeetingsSearchFilters } from "./meetings-search-filters";
import { StatusFilter } from "./status-filter";
import { AgentIdFilter } from "./agent-id-filter";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DEFAULT_PAGE } from "@/constants";

export const MeetingsListHeaders = () => {
  const[filters,setFilters]=useMeetingsFilters();
 const [isDialogOpen,setIsDialogOpen]=useState(false);
 const isAnyFilterModified=!!filters.status || !!filters.search || !!filters.agentId;

 const onClaerFilters=()=>{
  setFilters({
    status:null,
    agentId:"",
    search:"",
    page:DEFAULT_PAGE,
  })
 }
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
        <ScrollArea>
        <div className="flex items-center gap-x-2 p-1">
          <MeetingsSearchFilters/>
          <StatusFilter/>
          <AgentIdFilter/>
          {isAnyFilterModified && (
            <Button variant="outline" onClick={onClaerFilters} >
              <XCircleIcon className="size-4"/>
              Clear
            </Button>
          )}
        </div>
        <ScrollBar orientation="horizontal"/>
        </ScrollArea>
      </div>
    </>
  );
}