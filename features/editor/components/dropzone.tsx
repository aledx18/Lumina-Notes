/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <zod:hook> */
'use client'

import { useParams } from 'next/navigation'
import { useCallback } from 'react'
import { SingleImageDropzone } from '@/components/upload/single-image'
import {
  UploaderProvider,
  type UploadFn
} from '@/components/upload/uploader-provider'
import { useUpdateDocumentCoverImage } from '@/features/documents/hooks/use-suspense-document'
import { useCoverImage } from '@/hooks/use-cover-image'
import { useEdgeStore } from '@/lib/edgestore'

export function SingleImageDropzoneUsage() {
  const { onClose, url } = useCoverImage()
  const { edgestore } = useEdgeStore()
  const { docId } = useParams<{ docId: string }>()
  const updateCoverImage = useUpdateDocumentCoverImage()

  const uploadFn: UploadFn = useCallback(
    async ({ file, onProgressChange, signal }) => {
      const res = await edgestore.publicFiles.upload({
        file,
        signal,
        onProgressChange,
        options: {
          replaceTargetUrl: url
        }
      })

      updateCoverImage.mutateAsync({
        id: docId,
        coverImage: res.url
      })

      onClose()
      return res
    },
    [edgestore]
  )

  return (
    <UploaderProvider uploadFn={uploadFn} autoUpload>
      <SingleImageDropzone
        height={100}
        width={100}
        dropzoneOptions={{
          maxSize: 1024 * 1024 * 1
        }}
      />
    </UploaderProvider>
  )
}
