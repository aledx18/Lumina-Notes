import prisma from '@/lib/db'
import { createTRPCRouter, protectedProcedure } from '@/trpc/init'

export const getUserRouter = createTRPCRouter({
  getOne: protectedProcedure.query(async ({ ctx }) => {
    return await prisma.user.findUniqueOrThrow({
      where: {
        id: ctx.auth.user.id
      }
    })
  })
})
