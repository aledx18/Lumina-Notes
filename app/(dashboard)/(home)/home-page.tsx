'use client'

import { Button } from '@/components/ui/button'
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
    <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
      <Button className='flex max-w-3xl' onClick={handleCreate}>
        Create
      </Button>
      <div className='grid auto-rows-min gap-4 md:grid-cols-3'>
        {JSON.stringify(documents)}
      </div>
      <div className='bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min' />
    </div>
  )
}
