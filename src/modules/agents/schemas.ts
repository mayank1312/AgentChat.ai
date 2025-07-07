import { z } from "zod";

export const agentsInsertSchema=z.object({
    name:z.string().min(1,{message:"name is required"}).max(100),
    instructions:z.string().min(1,{message:"instructions is required"}).max(500),
});

export const agentsUpdateSchema=agentsInsertSchema.extend({
    id:z.string().min(1,{message:"Id Is Required"}),
})
