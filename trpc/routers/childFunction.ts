/** biome-ignore-all lint/style/noNonNullAssertion: <todo: check if this is needed> */
import prisma from '@/lib/db'
import { Document } from '@/lib/generated/prisma'

type DocumentWithChildren = Document & {
  childDocuments: DocumentWithChildren[]
}

export async function getDocumentsFlat(
  userId: string,
  parentId: string | null = null
): Promise<DocumentWithChildren[]> {
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
  for (const docx of allDocs) {
    docMap.set(docx.id, {
      ...docx,
      childDocuments: []
    })
  }

  const rootDocs: DocumentWithChildren[] = []

  // Obtener los childs
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

async function getAllChildIds(
  documentId: string,
  userId: string
): Promise<string[]> {
  const children = await prisma.document.findMany({
    where: { parentDocumentId: documentId, userId },
    select: { id: true }
  })

  let allIds: string[] = []
  for (const child of children) {
    allIds.push(child.id)
    const subChildren = await getAllChildIds(child.id, userId)
    allIds = allIds.concat(subChildren)
  }

  return allIds
}

export async function setArchivedStateRecursively(
  documentId: string,
  userId: string,
  isArchived: boolean
) {
  const allIds = await getAllChildIds(documentId, userId)
  allIds.push(documentId)

  await prisma.document.updateMany({
    where: { id: { in: allIds }, userId },
    data: { isArchived }
  })
}
