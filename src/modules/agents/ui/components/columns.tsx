"use client"

import { ColumnDef } from "@tanstack/react-table"
import { AgentGetMany } from "../../types"
import { GeneratedAvatar } from "@/components/generated-avatar";
import { CornerDownRightIcon, VideoIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";



export const columns: ColumnDef<AgentGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Agent Name",
    cell: ({ row }) => {
      const agent = row.original;
      return (
        <div className="flex flex-col gap-y-1">
            <div className="flex items-center gap-x-2">
            <GeneratedAvatar
            variant="botttsNeutral"
            seed={agent.name || "New Agent"}
            className="w-8 h-8 border"
            />
            <span className="font-semibold capitalize">{agent.name}</span>
          </div>
         
            <div className="flex items-center gap-x-2">
                <CornerDownRightIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground truncate max-w-[200px] capitalize">
                    {agent.instructions || "No instructions provided"}
                </span>
            </div>
          
        </div>
      );
    },
  },
  {
    accessorKey:"meetingCount",
    header: "Meetings",
    cell: ({ row }) => {
      const agent = row.original;
      return (
      <Badge
      variant="outline"
      className="flex items-center gap-x-2 [&>svg]:size-4"
      >
        <VideoIcon className="text-blue-700"/>
     {agent.meetingCount || 0} {agent.meetingCount === 1 ? "Meeting" : "Meetings"}
      </Badge>
      );
    },
  }

]