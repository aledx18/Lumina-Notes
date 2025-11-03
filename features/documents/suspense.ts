import { useSuspenseQuery } from '@tanstack/react-query'

import { useTRPC } from '@/trpc/client'

export function useSuspensePosts() {
  const trpc = useTRPC()

  return useSuspenseQuery(trpc.posts.getMany.queryOptions())
}
