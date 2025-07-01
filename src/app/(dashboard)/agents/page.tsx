import { LoadingState } from '@/components/loading-state';
import { AgentsViewError, AgentsViewLoading, AgentsViewPage } from '@/modules/agents/ui/views/agent-views'
import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import React, { Suspense } from 'react'
import {ErrorBoundary} from "react-error-boundary";

const Page = async() => {
  const queryClient=getQueryClient();
  void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<AgentsViewLoading/>}>
      <ErrorBoundary fallback={<AgentsViewError/>}>
         <AgentsViewPage />
      </ErrorBoundary>
      
  </Suspense>
  </HydrationBoundary>
  )
}

export default Page
