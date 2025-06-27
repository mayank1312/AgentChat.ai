"use client"

import { Card,CardContent } from "@/components/ui/card"
import {z} from "zod";
import { authClient } from "@/lib/auth-client";
import {zodResolver} from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage,FormDescription} from "@/components/ui/form";
import {Alert,AlertDescription,AlertTitle} from "@/components/ui/alert";
import { OctagonAlertIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formSchema=z.object({
    email:z.string().email(),
    password:z.string().min(1,{message:"Password is required"}),
})
export const SignInViews=()=>{
const router=useRouter();
const [error,setError]=useState<string | null>(null);
const [pending,setPending]=useState(false);

    const form=useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            email:"",
            password:"",
        }
    });

    const onSubmit=(data:z.infer<typeof formSchema>)=>{
       setError(null);
       setPending(true);
        authClient.signIn.email(
        {
            email:data.email,
            password:data.password
        },{
            onSuccess:()=>{
                setPending(false);
                router.push("/")
            },
            onError:({error})=>{
                setError(error.message)
            }

        }
       )
       
    }
    return (
       <div className="flex flex-col gap-6">
        <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
             <Form {...form}>
                 <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
                   <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center text-center">
                       <h1 className="text-2xl font-bold">Welcome Back</h1>
                       <p className="text-muted-foreground text-balance">
                        Login to your account 
                       </p>
                    </div>
                    <div  className="grid gap-3">
                          <FormField
                             control={form.control}
                             name="email"
                             render={({field})=>(
                              <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                         <Input placeholder="me@example.com" type="email" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                              </FormItem>
                             )}
                          />
                    </div>
                     <div  className="grid gap-3">
                          <FormField
                             control={form.control}
                             name="password"
                             render={({field})=>(
                              <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                         <Input placeholder="*******" type="password" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                              </FormItem>
                             )}
                          />
                    </div>
                    {!!error && (
                    <Alert className="bg-destructive/10 border-none">
                        <OctagonAlertIcon className="h-4 w-4 !text-destructive" />
                        <AlertTitle>{error}</AlertTitle>
                    </Alert>
                    )}      
                    <Button className="w-full" type="submit"  disabled={pending}>
                        Sign In 
                        </Button>
                    <div className=" after:border-border after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t relative text-center text-sm">
                    <span className="bg-card text-muted-foreground relative z-10 px-2 ">Or continue with</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <Button variant="outline" className="w-full" type="button" disabled={pending}>
                        <img src="/google.svg" alt="Google" className="h-4 w-4 mr-2" />
                        Google  
                        </Button>
                        <Button variant="outline" className="w-full" type="button" disabled={pending}>
                        <img src="/github.svg" alt="Github" className="h-4 w-4 mr-2" />
                        Github  
                        </Button>

                    </div>
                    <div className="text-center text-small">
                        Don&apos;t have an account?{" "}
                         <Link href="/sign-up" className="underline">
                        Sign Up
                        </Link>
                    </div>
                   </div>
                 </form>
             </Form>
              <div className="bg-radial from-green-700 to-green-900 relative hidden md:flex flex-col items-center justify-center">
                  <img src="/logo.png" alt="Logo" className="h-[150px] w-[150px]" />
                <p className="text-2xl font-semibold text-white mb-3">AgentChat.AI</p>
              </div>
            </CardContent>
            
        </Card>
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline ">
            By Clicking continue, you agree to our <a href="#">Terms Of Service</a> and <a  href="#">Privacy Policy</a>
        </div>
        </div>
    )
}