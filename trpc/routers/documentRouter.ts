import { generateSlug } from 'random-word-slugs'
import z from 'zod'
import prisma from '@/lib/db'
import { createTRPCRouter, protectedProcedure } from '@/trpc/init'
import { getDocumentsFlat, setArchivedStateRecursively } from './childFunction'

export const documentRouter = createTRPCRouter({
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
  getMany: protectedProcedure
    .input(z.object({ parentDocumentId: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const userId = ctx.auth.user.id
      const parentId = input?.parentDocumentId ?? null

      return await getDocumentsFlat(userId, parentId)
    }),
  getArchived: protectedProcedure
    .input(z.object({ parentDocumentId: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      return await prisma.document.findMany({
        where: {
          userId: ctx.auth.user.id,
          isArchived: true,
          parentDocumentId: input?.parentDocumentId ?? null
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
          name: generateSlug(1),
          userId: ctx.auth.user.id,
          parentDocumentId: input?.parentDocumentId
        }
      })
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
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return prisma.document.delete({
        where: {
          id: input.id,
          userId: ctx.auth.user.id
        }
      })
    }),
  archive: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await setArchivedStateRecursively(input.id, ctx.auth.user.id, true)
      return { success: true }
    }),
  unarchive: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await setArchivedStateRecursively(input.id, ctx.auth.user.id, false)
      return { success: true }
    })
})
