import { inferInput } from '@trpc/tanstack-react-query'
import { prefetch, trpc } from '@/trpc/server'

type Input = inferInput<typeof trpc.user.getOne>

/**  
Prefetch single user
**/
export function prefetchUser() {
  return prefetch(trpc.user.getOne.queryOptions())
}
/**  
Prefetch all documents
**/
export function prefetchDocuments(params: Input) {
  return prefetch(trpc.documents.getMany.queryOptions(params))
}
/**
 * Prefetch single document
 */
export function prefetchDocument(id: string) {
  return prefetch(trpc.documents.getOne.queryOptions({ id }))
}
/**
 * Prefetch all archived documents
 */
export function prefetchArchivedDocuments(params: Input) {
  return prefetch(trpc.documents.getArchived.queryOptions(params))
}
