"use client"

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation";


export const HomeViewPage=()=>{
     const {data:session}=authClient.useSession();
     const router=useRouter();
     if(!session){
      return(
        <p>loading...</p>
      )
     }
     return(
      <div className="flex flex-col p-4 gap-y-4">
        <p>Logged in as {session.user.name}</p>
        <Button onClick={()=>authClient.signOut({
        fetchOptions:{onSuccess:()=>
          router.push("/sign-in")
        
        }})}>
            Sign Out</Button>
      </div>
     )
}

