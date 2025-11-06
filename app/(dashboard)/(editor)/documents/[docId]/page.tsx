import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import EditorHeader from '@/features/documents/components/editor-header'
import EditorDocument from '@/features/editor/editorDocument'
import { requireAuth } from '@/lib/auth-utils'
import { caller, HydrateClient } from '@/trpc/server'

interface Props {
  params: Promise<{ docId: string }>
}

export default async function Page({ params }: Props) {
  await requireAuth()
  const { docId } = await params

  try {
    await caller.documents.getOne({ id: docId })
  } catch (e) {
    notFound()
    console.error(e)
  }

  // error.code='P2025'

  return (
    <HydrateClient>
      {/* <ErrorBoundary FallbackComponent={DocumentErrorBoundary}> */}
      <Suspense fallback={<p>Loading...</p>}>
        <EditorHeader documentId={docId} />
        <EditorDocument documentId={docId} />
      </Suspense>
      {/* </ErrorBoundary> */}
    </HydrateClient>
  )
}
