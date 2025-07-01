import { z } from 'zod';
import { agentsRouter } from '@/modules/agents/server/procdeure';
import { baseProcedure, createTRPCRouter } from '../init';
export const appRouter = createTRPCRouter({
  agents: agentsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;