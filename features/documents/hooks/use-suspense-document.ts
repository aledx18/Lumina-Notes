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
  return useSuspenseQuery(trpc.documents.getMany.queryOptions())
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
// export function useRemoveWorkflow() {
//   const trpc = useTRPC()
//   const queryClient = useQueryClient()

//   return useMutation(
//     trpc.workflows.remove.mutationOptions({
//       onSuccess: (data) => {
//         toast.success(`Workflow ${data.name} removed successfully`)
//         queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}))
//         queryClient.invalidateQueries(
//           trpc.workflows.getOne.queryFilter({ id: data.id })
//         )
//       },
//       onError: (error) => {
//         console.log(error, `removeWorflow error. ${error}`)
//         toast.error(`Error removing workflow ${error.message}`)
//       }
//     })
//   )
// }
/**
 * Hook to update 📝 a document name
 */
export function useUpdateDocumentName() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  //check toast execution twice
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
 * Hook to archive 🔒 a document
 */
export function useArchiveDocument() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(
    trpc.documents.archive.mutationOptions({
      onSuccess: () => {
        toast.success(`Document archived successfully`)
        queryClient.invalidateQueries(trpc.documents.getMany.queryOptions())
        queryClient.invalidateQueries(trpc.documents.getArchived.queryOptions())
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
      onSuccess: () => {
        toast.success(`Document unarchived successfully`)
        queryClient.invalidateQueries(trpc.documents.getMany.queryOptions())
        queryClient.invalidateQueries(trpc.documents.getArchived.queryOptions())
      },
      onError: (error) => {
        console.log(error, `unarchive document error. ${error}`)
        toast.error(`Error unarchiving document ${error.message}`)
      }
    })
  )
}
