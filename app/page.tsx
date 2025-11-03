import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { requireAuth } from '@/lib/auth-utils'
import { HydrateClient } from '@/trpc/server'
import List from './list'
import { prefetchPosts } from './server/prefetch'

export default async function Home() {
  await requireAuth()
  prefetchPosts()

  return (
    <div className='flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
      <HydrateClient>
        <ErrorBoundary fallback={<div>Error!</div>}>
          <Suspense fallback={<div>Loading...</div>}>
            <List />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </div>
  )
}
