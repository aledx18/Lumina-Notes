'use client'

import { PackageOpenIcon } from 'lucide-react'

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@/components/ui/empty'
import {
  useCreateDocument,
  useSuspenseDocuments
} from '@/features/documents/hooks/use-suspense-document'

export default function HomePage() {
  const createDocument = useCreateDocument()
  const { data: documents } = useSuspenseDocuments()

  const handleCreate = () => {
    createDocument.mutate(undefined, {
      onError: (error) => {
        console.log(error)
      },
      onSuccess: (data) => {
        console.log(data)
      }
    })
  }

  return (
    <div className='flex justify-center items-center'>
      <Empty className='border bg-muted'>
        <EmptyHeader>
          <EmptyMedia className='bg-background' variant='icon'>
            <PackageOpenIcon className='size-4' />
          </EmptyMedia>
        </EmptyHeader>
        <EmptyTitle>Welcome to Lumina-Notes</EmptyTitle>
        <EmptyDescription>'No data found'</EmptyDescription>
      </Empty>
    </div>
  )
}
