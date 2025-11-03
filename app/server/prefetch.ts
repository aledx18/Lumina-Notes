import { inferInput } from '@trpc/tanstack-react-query'
import { prefetch, trpc } from '@/trpc/server'

type Input = inferInput<typeof trpc.posts.getMany>

/**  
Prefetch all Posts
**/
export function prefetchPosts(params: Input) {
  return prefetch(trpc.posts.getMany.queryOptions(params))
}
