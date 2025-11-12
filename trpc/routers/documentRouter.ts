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
    .input(
      z
        .object({
          parentDocumentId: z.string().optional(),
          withChildren: z.boolean().optional()
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.auth.user.id
      const parentId = input?.parentDocumentId ?? null
      const withChildren = input?.withChildren ?? false

      // Si se piden los documentos con hijos → usar la función recursiva
      if (withChildren) {
        return await getDocumentsFlat(userId, parentId)
      }

      const docs = await prisma.document.findMany({
        where: {
          userId,
          isArchived: false,
          parentDocumentId: parentId
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return docs.map((doc) => ({
        ...doc,
        childDocuments: []
      }))
    }),
  getArchived: protectedProcedure
    .input(z.object({ parentDocumentId: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      return await prisma.document.findMany({
        where: {
          userId: ctx.auth.user.id,
          isArchived: true,
          parentDocumentId: input?.parentDocumentId ?? null
        },
        include: {
          childDocuments: true
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
  //todo : only 1 update for all properties
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
  updateContent: protectedProcedure
    .input(z.object({ id: z.string(), content: z.string().optional() }))
    .mutation(({ ctx, input }) => {
      return prisma.document.update({
        where: {
          id: input.id,
          userId: ctx.auth.user.id
        },
        data: {
          content: input.content ?? null
        }
      })
    }),
  updateIcon: protectedProcedure
    .input(z.object({ id: z.string(), icon: z.string().optional() }))
    .mutation(({ ctx, input }) => {
      return prisma.document.update({
        where: {
          id: input.id,
          userId: ctx.auth.user.id
        },
        data: {
          icon: input.icon ?? null
        }
      })
    }),
  updateCoverImage: protectedProcedure
    .input(z.object({ id: z.string(), coverImage: z.string().optional() }))
    .mutation(({ ctx, input }) => {
      return prisma.document.update({
        where: {
          id: input.id,
          userId: ctx.auth.user.id
        },
        data: {
          coverImage: input.coverImage ?? null
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
  archive: protectedProcedure // todo: archiva solo documentos padres
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await setArchivedStateRecursively(input.id, ctx.auth.user.id, true)
      return { id: input.id }
    }),
  unarchive: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await setArchivedStateRecursively(input.id, ctx.auth.user.id, false)
      return { id: input.id }
    })
})
