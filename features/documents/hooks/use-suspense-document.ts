import {
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTRPC } from '@/trpc/client'
// import { useWorkflowsParams } from './use-workflows-params'

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
 *Hook to create 🏗️ a new workflow
 */
export function useCreateDocument() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(
    trpc.documents.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow ${data.name} created successfully`)
        queryClient.invalidateQueries(trpc.documents.getMany.queryOptions())
      },

      onError: (error) => {
        console.log(error, `createWorflow error. ${error}`)
        toast.error(`Error creating workflow ${error.message}`)
      }
    })
  )
}
/**
 *Hook to remove 🗑️ a workflow
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
 * Hook to update 📝 a workflow name
 */
// export function useUpdateWorkflowName() {
//   const trpc = useTRPC()
//   const queryClient = useQueryClient()

//   return useMutation(
//     trpc.workflows.updateName.mutationOptions({
//       onSuccess: (data) => {
//         toast.success(`Workflow ${data.name} updated successfully`)
//         queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}))
//         queryClient.invalidateQueries(
//           trpc.workflows.getOne.queryFilter({ id: data.id })
//         )
//       },
//       onError: (error) => {
//         console.log(error, `updateWorflowName error. ${error}`)
//         toast.error(`Error updating workflow name ${error.message}`)
//       }
//     })
//   )
// }
