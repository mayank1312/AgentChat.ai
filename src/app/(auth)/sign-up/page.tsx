import { auth } from "@/lib/auth";
import { SignUpViews } from "@/modules/auth/ui/views/sign-up-views";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Page=async()=>{
    const session=await auth.api.getSession({
        headers:await headers()
  })
  
  if(!!session){
    redirect("/")
  }
    return (
        <SignUpViews/>
    )
}

export default Page;