
import { auth } from '@/lib/auth';
import { loadSearchParams } from '@/modules/agents/param';
import { AgentsListHeaders } from '@/modules/agents/ui/components/agents-list-headers';
import { AgentsViewError, AgentsViewLoading, AgentsViewPage } from '@/modules/agents/ui/views/agent-views'
import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { SearchParams } from 'nuqs';
import React, { Suspense } from 'react'
import {ErrorBoundary} from "react-error-boundary";

interface Props {
  searchParams:Promise<SearchParams>
}
const Page = async({searchParams}:Props) => {
  const filters=await loadSearchParams(searchParams);
  const session=await auth.api.getSession({
        headers:await headers()
  })
  
  if(!session){
    redirect("/sign-in")
  }
  
  const queryClient=getQueryClient();
  void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions({
    ...filters,
  }));
  return (
  <>
  <AgentsListHeaders/>
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<AgentsViewLoading/>}>
      <ErrorBoundary fallback={<AgentsViewError/>}>
         <AgentsViewPage />
      </ErrorBoundary>
      
  </Suspense>
  </HydrationBoundary>
  </>
  )
}

export default Page
