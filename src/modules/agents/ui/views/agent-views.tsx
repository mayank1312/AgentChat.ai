"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import {  useSuspenseQuery } from "@tanstack/react-query";

export const AgentsViewPage = () => {
  const trpc = useTRPC();
  const { data} = useSuspenseQuery(trpc.agents.getMany.queryOptions());
    
  return (
    <div className="flex flex-col p-4 gap-y-4">
     {JSON.stringify(data, null, 2)}
    </div>
  );
}

export const AgentsViewLoading = () => {
return (
  <LoadingState title="Loading Agents" description="this may take a few seconds"/>
)

};

export const AgentsViewError=()=>{
  return (
      <ErrorState title="Error loading Agents" description="Something went wrong "/>
  )
}