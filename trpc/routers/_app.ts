// import { workflowsRouter } from '@/features/workflows/server/routers'
import { postsRouter } from '@/lib/postsRouter'
import { createTRPCRouter } from '../init'

export const appRouter = createTRPCRouter({
  posts: postsRouter
})
// export type definition of API
export type AppRouter = typeof appRouter
