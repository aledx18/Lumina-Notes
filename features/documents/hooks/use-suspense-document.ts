import {
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTRPC } from '@/trpc/client'

/**
 *Hook to fetch all documents 🚙 use suspense
 */
export function useSuspenseDocuments() {
  const trpc = useTRPC()
  //   const [params] = useWorkflowsParams()
  return useSuspenseQuery(
    trpc.documents.getMany.queryOptions({ withChildren: true })
  )
}
/**
 * Hook to fetch a single document 🚙 use suspense
 */
export function useSuspenseDocument(id: string) {
  const trpc = useTRPC()
  return useSuspenseQuery(trpc.documents.getOne.queryOptions({ id }))
}
/**
 * Hook to fetch all archived documents 🚙 use suspense
 */
export function useSuspenseArchivedDocuments() {
  const trpc = useTRPC()
  return useSuspenseQuery(trpc.documents.getArchived.queryOptions())
}
/**
 *Hook to create 🏗️ a new document
 */
export function useCreateDocument() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(
    trpc.documents.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Document ${data.name} created successfully`)
        queryClient.invalidateQueries(trpc.documents.getMany.queryOptions())
      },

      onError: (error) => {
        console.log(error, `createDocument error. ${error}`)
        toast.error(`Error creating Document ${error.message}`)
      }
    })
  )
}
/**
 *Hook to remove 🗑️ a document
 */
export function useRemoveDocument() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(
    trpc.documents.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Document ${data.name} removed successfully`)
        queryClient.invalidateQueries(trpc.documents.getArchived.queryOptions())
      },
      onError: (error) => {
        console.log(error, `remove document error. ${error}`)
        toast.error(`Error removing Document ${error.message}`)
      }
    })
  )
}
/**
 * Hook to update 📝 a document name
 */
export function useUpdateDocumentName() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  //check toast execution twice in production
  return useMutation(
    trpc.documents.updateName.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Document ${data.name} updated successfully`)
        queryClient.invalidateQueries(trpc.documents.getMany.queryOptions())
        queryClient.invalidateQueries(
          trpc.documents.getOne.queryFilter({ id: data.id })
        )
      },
      onError: (error) => {
        console.log(error, `update document name error. ${error}`)
        toast.error(`Error updating document name ${error.message}`)
      }
    })
  )
}
/**
 * Hook to update 📝 a Icon
 */
export function useUpdateDocumentIcon() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  //check toast execution twice in production
  return useMutation(
    trpc.documents.updateIcon.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Document ${data.name} updated successfully`)
        queryClient.invalidateQueries(trpc.documents.getMany.queryOptions())
        queryClient.invalidateQueries(
          trpc.documents.getOne.queryOptions({ id: data.id })
        )
      },
      onError: (error) => {
        console.log(error, `update document icon error. ${error}`)
        toast.error(`Error updating document icon ${error.message}`)
      }
    })
  )
}
/**
 * Hook to update 📝 a CoverImage
 */
export function useUpdateDocumentCoverImage() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  //check toast execution twice in production
  return useMutation(
    trpc.documents.updateCoverImage.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Document ${data.name} updated successfully`)
        queryClient.invalidateQueries(trpc.documents.getMany.queryOptions())
        queryClient.invalidateQueries(
          trpc.documents.getOne.queryOptions({ id: data.id })
        )
      },
      onError: (error) => {
        console.log(error, `update document coverImage error. ${error}`)
        toast.error(`Error updating document coverImage ${error.message}`)
      }
    })
  )
}
/**
 * Hook to archive 🔒 a document
 */
export function useArchiveDocument() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  return useMutation(
    trpc.documents.archive.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Document archived successfully`)
        queryClient.invalidateQueries(trpc.documents.getMany.queryOptions())
        queryClient.invalidateQueries(trpc.documents.getArchived.queryOptions())
        queryClient.invalidateQueries(
          trpc.documents.getOne.queryOptions({
            id: data.id
          })
        )
      },
      onError: (error) => {
        console.log(error, `archive document error. ${error}`)
        toast.error(`Error archiving document ${error.message}`)
      }
    })
  )
}
/**
 * Hook to unarchive 📤 a document
 */
export function useUnarchiveDocument() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(
    trpc.documents.unarchive.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Document unarchived successfully`)
        queryClient.invalidateQueries(trpc.documents.getMany.queryOptions())
        queryClient.invalidateQueries(trpc.documents.getArchived.queryOptions())
        queryClient.invalidateQueries(
          trpc.documents.getOne.queryOptions({ id: data.id })
        )
      },
      onError: (error) => {
        console.log(error, `unarchive document error. ${error}`)
        toast.error(`Error unarchiving document ${error.message}`)
      }
    })
  )
}
/**
 * Hook to update 📝 a document content
 */
export function useUpdateDocumentContent() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  //check toast execution twice in production
  return useMutation(
    trpc.documents.updateContent.mutationOptions({
      onSuccess: (data) => {
        // toast.success(`Document content updated successfully`)
        // queryClient.invalidateQueries(trpc.documents.getMany.queryOptions())
        queryClient.invalidateQueries(
          trpc.documents.getOne.queryOptions({ id: data.id })
        )
      },
      onError: (error) => {
        console.log(error, `update document content error. ${error}`)
        toast.error(`Error updating document content ${error.message}`)
      }
    })
  )
}
