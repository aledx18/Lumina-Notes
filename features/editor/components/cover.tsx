import { ImageIcon, X } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useUpdateDocumentCoverImage } from '@/features/documents/hooks/use-suspense-document'
import { useCoverImage } from '@/hooks/use-cover-image'
import { useEdgeStore } from '@/lib/edgestore'
import { cn } from '@/lib/utils'

type CoverProps = {
  url: string | null
  id: string
}

export default function Cover({ url, id }: CoverProps) {
  const coverImage = useCoverImage()
  const { edgestore } = useEdgeStore()
  const removeImage = useUpdateDocumentCoverImage()

  const handleRemove = async () => {
    removeImage.mutateAsync({
      id,
      coverImage: undefined
    })
    if (url) {
      await edgestore.publicFiles.delete({
        url: url
      })
    }
  }

  return (
    <div
      className={cn(
        'relative w-full h-[35vh] group',
        !url && 'h-[12vh]',
        url && 'bg-muted'
      )}
    >
      {!!url && (
        <Image
          src={url}
          alt='cover'
          fill
          className='object-cover contain-content'
        />
      )}

      {url !== null && (
        <div className='opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2'>
          <Button
            onClick={() => coverImage.onReplace(url)}
            variant='ghost'
            className='text-xs'
            size='sm'
          >
            Change cover image
            <ImageIcon size={4} />
          </Button>
          <Button
            onClick={handleRemove}
            variant='ghost'
            className='text-xs'
            size='sm'
          >
            Remove
            <X size={4} />
          </Button>
        </div>
      )}
    </div>
  )
}

Cover.skeleton = function CoverSkeleton() {
  return <Skeleton className='w-full h-[12vh]' />
}
