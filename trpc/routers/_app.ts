// import { workflowsRouter } from '@/features/workflows/server/routers'

import { getUserRouter } from '@/lib/router/getUserRouter'
import { createTRPCRouter } from '../init'

export const appRouter = createTRPCRouter({
  user: getUserRouter
})
// export type definition of API
export type AppRouter = typeof appRouter
