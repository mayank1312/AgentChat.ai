"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { NewAgentDialog } from "./new-agent-dialog";
import { useState } from "react";
import { useAgentsFilters } from "../../hooks/use-agents-filters";
import { SearchFilters } from "./agents-search-filters";
import { DEFAULT_PAGE } from "@/constants";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export const AgentsListHeaders = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const[filters, setFilters] = useAgentsFilters();
  const isAnyFilterModifies = !!filters.search;
  const onclearFilters = () => {
    setFilters({
      search: "",
      page: DEFAULT_PAGE,
    });
  };

  return (
    <>
      <NewAgentDialog Open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <div className="flex flex-col px-4 py-4 md:px-8 gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-xl">My Agents</h5>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusIcon />
            New Agent
          </Button>
        </div>
        <ScrollArea>
        <div className="flex items-center gap-x-2 p-1">
          <SearchFilters />
          {isAnyFilterModifies && (
            <Button variant="outline" onClick={onclearFilters} className="flex items-center gap-x-2">
              <XCircleIcon/>
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