import { useTRPC } from "@/trpc/client";
import { AgentGetOne } from "../../types";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { agentsInsertSchema } from "../../schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AgentFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    initialValues?: AgentGetOne; // Define a more specific type if possible

}
 export const AgentForm = ({
    onSuccess,
    onCancel,
    initialValues,
}: AgentFormProps) => {
    const trpc =useTRPC();
 
    const queryClient=useQueryClient();
    const createAgent=useMutation(
        trpc.agents.create.mutationOptions({
            onSuccess: async()=>{
                await queryClient.invalidateQueries(
                    trpc.agents.getMany.queryOptions()
                );

                if(initialValues?.id) {
                   await queryClient.invalidateQueries(
                        trpc.agents.getOne.queryOptions({ id: initialValues.id })
                    );
                }
                onSuccess?.();
            },
            onError:(error)=>{
                toast.error(`Failed to create agent: ${error.message}`);
            }
        })
    );
    const form=useForm<z.infer<typeof agentsInsertSchema>>({
        resolver:zodResolver(agentsInsertSchema),
        defaultValues:  {
            name: initialValues?.name || "",
            instructions: initialValues?.instructions || "", 
        },
    });

    const isEdit=!!initialValues?.id;
    const isPending=createAgent.isPending;

    const onSubmit= (data: z.infer<typeof agentsInsertSchema>) => {
        if (isEdit && initialValues?.id) {
            // Handle edit logic here
            // For example, you might want to call an update mutation
            console.log("Editing agent with data:", data);
        } else {
            createAgent.mutateAsync(data);
            
        }
    }

    return (
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <GeneratedAvatar
              seed={form.watch("name") || "New Agent"}
              variant="botttsNeutral"
              className="w-16 h-16 border"
              />
              <FormField
              name="name"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="e.g. Physics Tutor"/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
              />
              <FormField
              name="instructions"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Instructions</FormLabel>
                        <FormControl>
                            <Textarea {...field} placeholder="You are a helpful physics assistant that can answer questions and help with tasks"/>
                        </FormControl>
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
    )
}
