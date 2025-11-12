import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import Cover from '@/features/editor/components/cover'
import EditorContainer from '@/features/editor/editor-container'
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
      <Suspense
        fallback={
          <>
            <Skeleton className='h-4 w-[60%]' />
            <Cover.skeleton />
            <div className='md:max-w-3xl lg:max-w-4xl mx-auto mt-10'>
              <div className='space-y-4 pl-8 pt-4'>
                <Skeleton className='h-14 w-[50%]' />
                <Skeleton className='h-4 w-[80%]' />
                <Skeleton className='h-4 w-[40%]' />
                <Skeleton className='h-4 w-[60%]' />
              </div>
            </div>
          </>
        }
      >
        <EditorContainer documentId={docId} />
      </Suspense>
    </HydrateClient>
  )
}
