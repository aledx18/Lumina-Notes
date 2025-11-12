'use client'

import { useEffect, useState } from 'react'
import CoverImageModal from './cover-image-modal'

export function ModalProviders() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return <CoverImageModal />
}
