import { createTRPCRouter } from '../init'
import { documentRouter } from './documentRouter'
import { getUserRouter } from './getUserRouter'

export const appRouter = createTRPCRouter({
  user: getUserRouter,
  documents: documentRouter
})
// export type definition of API
export type AppRouter = typeof appRouter
