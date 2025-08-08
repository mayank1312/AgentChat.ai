import { auth } from "@/lib/auth";
import { MeetingsListHeaders } from "@/modules/meetings/ui/components/meetings-list-headers";
import { MeetingsView, MeetingsViewError, MeetingsViewLoading } from "@/modules/meetings/ui/views/meetings-view"
import { getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { loadSearchParams } from "@/modules/meetings/param";

interface Props{
  searchParam:SearchParams
}
const Page = async({searchParam}:Props) => {
  const filters=await loadSearchParams(searchParam)
   const session=await auth.api.getSession({
          headers:await headers()
    })
    
    if(!session){
      redirect("/sign-in")
    }
  const queryClient=getQueryClient();
  void queryClient.prefetchQuery(trpc.meetings.getMany.queryOptions({
    ...filters
  }));
  return (
<>
<MeetingsListHeaders/>
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<MeetingsViewLoading/>}>
        <ErrorBoundary fallback={<MeetingsViewError/>}>
     <MeetingsView/>
     </ErrorBoundary>
     </Suspense>
    </HydrationBoundary>
    </>
  )
}

export default Page
