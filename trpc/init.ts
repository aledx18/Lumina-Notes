import { initTRPC, TRPCError } from '@trpc/server'
import { headers } from 'next/headers'
import { cache } from 'react'
import superjson from 'superjson'
import { auth } from '@/lib/auth'
// import { polarClient } from '@/lib/polar'

export type TRPCContext = {
  session: Awaited<ReturnType<typeof auth.api.getSession>> | null
  userId: string | null
}

export const createTRPCContext = cache(async (): Promise<TRPCContext> => {
  /**
   * @see: https://trpc.io/docs/server/context
   *
   */

  const session = await auth.api.getSession({
    headers: await headers()
  })
  return {
    session,
    userId: session?.user?.id || null
  }
})
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<TRPCContext>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson
})
// Base router and procedure helpers
export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory
export const baseProcedure = t.procedure
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const session =
    ctx.session ||
    (await auth.api.getSession({
      headers: await headers()
    }))

  if (!session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Unauthorized'
    })
  }

  return next({
    ctx: {
      ...ctx,
      auth: session
    }
  })
})

// export const premiumProcedure = protectedProcedure.use(
//   async ({ ctx, next }) => {
//     const customer = await polarClient.customers.getStateExternal({
//       externalId: ctx.auth.user.id
//     })
//     if (
//       !customer.activeSubscriptions ||
//       customer.activeSubscriptions.length === 0
//     ) {
//       throw new TRPCError({
//         code: 'FORBIDDEN',
//         message: 'Active subscription required'
//       })
//     }
//     return next({ ctx: { ...ctx, customer } })
//   }
// )
