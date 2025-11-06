import prisma from '@/lib/db'

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
