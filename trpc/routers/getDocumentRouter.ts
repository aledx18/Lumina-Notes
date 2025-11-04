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
  getMany: protectedProcedure
    .input(
      z
        .object({
          parentDocumentId: z.string().optional()
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      return await prisma.document.findMany({
        where: {
          userId: ctx.auth.user.id,
          parentDocumentId: input?.parentDocumentId ?? null
        },
        include: {
          childDocuments: {
            where: {
              isArchived: false
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    }),
  create: protectedProcedure
    .input(
      z
        .object({
          parentDocumentId: z.string().optional()
        })
        .optional()
    )
    .mutation(({ ctx, input }) => {
      return prisma.document.create({
        data: {
          name: generateSlug(),
          userId: ctx.auth.user.id,
          parentDocumentId: input?.parentDocumentId
        }
      })
    })
})
