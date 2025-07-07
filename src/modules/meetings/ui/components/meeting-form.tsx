import { useTRPC } from "@/trpc/client";
import { MeetingGetOne } from "../../types";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { meetingsInsertSchema } from "../../schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";

interface MeetingFormProps {
    onSuccess?: (id?:string) => void;
    onCancel?: () => void;
    initialValues?: MeetingGetOne; // Define a more specific type if possible

}
 export const MeetingForm = ({
    onSuccess,
    onCancel,
    initialValues,
}: MeetingFormProps) => {
    const trpc =useTRPC();
 
    const queryClient=useQueryClient();  
    const[openNewAgentDialog,setOpenNewAgentDialog]=useState(false) 
    const [agentSearch,setAgentSearch]=useState("")
    const agents=useQuery(
    trpc.agents.getMany.queryOptions({
        pageSize:100,
        search:agentSearch,
    }),
);

    const createMeeting=useMutation(
        trpc.meetings.create.mutationOptions({
            onSuccess: async(data)=>{
                await queryClient.invalidateQueries(
                    trpc.meetings.getMany.queryOptions({})
                );

                if(initialValues?.id) {
                   await queryClient.invalidateQueries(
                        trpc.meetings.getOne.queryOptions({ id: initialValues.id })
                    );
                }
                onSuccess?.(data.id);
            },
            onError:(error)=>{
                toast.error(`Failed to create Meeting: ${error.message}`);
            }
        })
    );
     const updateMeeting=useMutation(
        trpc.meetings.update.mutationOptions({
            onSuccess: async()=>{
                await queryClient.invalidateQueries(
                    trpc.meetings.getMany.queryOptions({})
                );

               
                onSuccess?.();
            },
            onError:(error)=>{
                toast.error(error.message);
            }
        })
    );
    const form=useForm<z.infer<typeof meetingsInsertSchema>>({
        resolver:zodResolver(meetingsInsertSchema),
        defaultValues:  {
            name: initialValues?.name || "",

           agentId: initialValues?.agentId || "", 
        },
    });

    const isEdit=!!initialValues?.id;
    const isPending=createMeeting.isPending || updateMeeting.isPending

    const onSubmit= (data: z.infer<typeof meetingsInsertSchema>) => {
        if (isEdit && initialValues?.id) {
            // Handle edit logic here
            // For example, you might want to call an update mutation
           updateMeeting.mutate({...data,id:initialValues.id})
        } else {
            createMeeting.mutateAsync(data);
            
        }
    }

    return (
        <>
        <NewAgentDialog
        Open={openNewAgentDialog}
        onOpenChange={setOpenNewAgentDialog}
        />
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
              name="name"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="e.g. Physics Consultations"/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
              />
               <FormField
              name="agentId"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Agent</FormLabel>
                        <FormControl>
                           <CommandSelect
                           options={(agents.data?.items??[]).map((agent)=>({
                            id:agent.id,
                            value:agent.id,
                            children:(
                                <div className="flex items-center gap-x-2">
                                    <GeneratedAvatar
                                    seed={agent.name}
                                    variant="botttsNeutral"
                                    className="border size-6"
                                    />
                                    <span>{agent.name}</span>
                                </div>
                            )
                           }))}
                           onSelect={field.onChange}
                           onSearch={setAgentSearch}
                           value={field.value}
                           placeholder="Select an Agent"
                           />
                        </FormControl>
                        <FormDescription>
                            Not Found  what you&apos;re looking for?{" "}
                            <button
                            type="button"
                            className=" text-primary hover:underline"
                            onClick={()=>setOpenNewAgentDialog(true)}
                            >
                                Create New Agent
                            </button>
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>
                )}
              />
                <div className="flex items-center justify-between ">
                    {onCancel && (
                        <Button
                        variant="ghost"
                        disabled={isPending}
                        type="button"
                        onClick={() => onCancel()}
                        >
                            Cancel
                        </Button>
                    )}
                    <Button disabled={isPending} type="submit" className="ml-2">
                      {isEdit?" Update Agent": "Create Agent"}
                    </Button>
                </div>
            </form>
        </Form>
        </>
    )
}
