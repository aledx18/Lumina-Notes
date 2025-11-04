import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { prefetchDocuments } from '@/features/documents/server/prefetch'
import { requireAuth } from '@/lib/auth-utils'
import { HydrateClient } from '@/trpc/server'
import HomePage from './home-page'

export default async function Home() {
  await requireAuth()
  prefetchDocuments()
  return (
    <div className='flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
      <HydrateClient>
        <ErrorBoundary fallback={<div>Error!</div>}>
          <Suspense fallback={<div>Loading...</div>}>
            <HomePage />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </div>
  )
}
