import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import EditorHeader from '@/features/documents/components/editor-header'
import { requireAuth } from '@/lib/auth-utils'
import { HydrateClient } from '@/trpc/server'

interface Props {
  params: Promise<{ docId: string }>
}

export default async function Page({ params }: Props) {
  await requireAuth()
  const { docId } = await params
  return (
    <HydrateClient>
      <ErrorBoundary fallback={<p>Error</p>}>
        <Suspense fallback={<p>Loading...</p>}>
          <EditorHeader documentId={docId} />
          <main className='flex-1'>
            <div>hola {docId}</div>
          </main>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  )
}
