'use client'

import { SingleImageDropzoneUsage } from '@/features/editor/components/dropzone'
import { useCoverImage } from '@/hooks/use-cover-image'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '../ui/dialog'

export default function CoverImageModal() {
  const coverImage = useCoverImage()

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cover image</DialogTitle>
          <SingleImageDropzoneUsage />
          <DialogDescription className='text-xs'>
            This image will be used as the cover image for your document.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
