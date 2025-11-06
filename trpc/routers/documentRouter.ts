import { generateSlug } from 'random-word-slugs'
import z from 'zod'
import prisma from '@/lib/db'
import { Document } from '@/lib/generated/prisma'
import { createTRPCRouter, protectedProcedure } from '@/trpc/init'
import { setArchivedStateRecursively } from './childFunction'

type DocumentWithChildren = Document & {
  childDocuments: DocumentWithChildren[]
}

async function getDocumentsFlat(
  userId: string,
  parentId: string | null = null
): Promise<DocumentWithChildren[]> {
  // Obtener todos los documentos del usuario
  const allDocs = await prisma.document.findMany({
    where: {
      userId,
      isArchived: false
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Construir estructura recursiva en memoria (O(n)
  const docMap = new Map<string, DocumentWithChildren>()

  // Inicializar todos los documentos
  for (const doc of allDocs) {
    docMap.set(doc.id, {
      ...doc,
      childDocuments: []
    })
  }

  // Construir relaciones padre-hijo
  const rootDocs: DocumentWithChildren[] = []
  for (const doc of allDocs) {
    const docWithChildren = docMap.get(doc.id)!
    if (doc.parentDocumentId === parentId) {
      rootDocs.push(docWithChildren)
    } else if (doc.parentDocumentId) {
      const parent = docMap.get(doc.parentDocumentId)
      if (parent) {
        parent.childDocuments.push(docWithChildren)
      }
    }
  }

  return rootDocs
}

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
      const userId = ctx.auth.user.id
      const parentId = input?.parentDocumentId ?? null

      return await getDocumentsFlat(userId, parentId)
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
    })
})
