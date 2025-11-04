// import { workflowsRouter } from '@/features/workflows/server/routers'

import { createTRPCRouter } from '../init'
import { getDocumentRouter } from './getDocumentRouter'
import { getUserRouter } from './getUserRouter'

export const appRouter = createTRPCRouter({
  user: getUserRouter,
  documents: getDocumentRouter
})
// export type definition of API
export type AppRouter = typeof appRouter
