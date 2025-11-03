import prisma from '@/lib/db'
import { createTRPCRouter, protectedProcedure } from '@/trpc/init'

export const postsRouter = createTRPCRouter({
  getMany: protectedProcedure.query(async () => {
    return await prisma.user.findMany()
  })
})
