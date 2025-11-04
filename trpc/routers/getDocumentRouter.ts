import { generateSlug } from 'random-word-slugs'
import z from 'zod'
import prisma from '@/lib/db'

import { createTRPCRouter, protectedProcedure } from '@/trpc/init'

export const getDocumentRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const document = await prisma.document.findUniqueOrThrow({
        where: {
          id: input.id,
          userId: ctx.auth.user.id
        }
      })

      return document
    }),
  updateName: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      return prisma.document.update({
        where: {
          id: input.id,
          userId: ctx.auth.user.id
        },
        data: {
          name: input.name
        }
      })
    }),
  getMany: protectedProcedure.query(async ({ ctx }) => {
    return await prisma.document.findMany({
      where: {
        userId: ctx.auth.user.id
      }
    })
  }),
  create: protectedProcedure.mutation(({ ctx }) => {
    return prisma.document.create({
      data: {
        name: generateSlug(),
        userId: ctx.auth.user.id
      }
    })
  })
})
