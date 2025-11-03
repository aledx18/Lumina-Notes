import { useSuspenseQuery } from '@tanstack/react-query'

import { useTRPC } from '@/trpc/client'

export function useSuspenseUser() {
  const trpc = useTRPC()

  return useSuspenseQuery(trpc.user.getOne.queryOptions())
}
