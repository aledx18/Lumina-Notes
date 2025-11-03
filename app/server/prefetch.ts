import { inferInput } from '@trpc/tanstack-react-query'
import { prefetch, trpc } from '@/trpc/server'

type Input = inferInput<typeof trpc.user.getOne>

/**  
Prefetch all Posts
**/
export function prefetchUser(params: Input) {
  return prefetch(trpc.user.getOne.queryOptions(params))
}
