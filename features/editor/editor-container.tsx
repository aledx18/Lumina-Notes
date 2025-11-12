'use client'

import { useCallback, useRef, useState } from 'react'
import { useDebouncedCallback } from '@/hooks/use-debounce'
import EditorHeader from '../documents/components/editor-header'
import {
  useSuspenseDocument,
  useUpdateDocumentContent
} from '../documents/hooks/use-suspense-document'
import EditorDocument from './editorDocument'

const SAVE_DELAY_MS = 7000
const MAX_WAIT_MS = 20000

export default function EditorContainer({
  documentId
}: {
  documentId: string
}) {
  const { data: document, isFetching } = useSuspenseDocument(documentId)
  const updateContent = useUpdateDocumentContent()

  // Refs para trackear estados sin re-renders innecesarios

  const lastSavedRef = useRef<string | undefined>(undefined)
  const [isEditing, setIsEditing] = useState(false)

  // 1. Definimos la función de guardado real.
  // Es importante usar useCallback aquí para que sea estable.
  const saveDocument = useCallback(
    (value: string) => {
      if (!value || value === lastSavedRef.current) return

      setIsEditing(false)
      updateContent.mutate({
        id: documentId,
        content: value
      })
    },
    [documentId, updateContent]
  )

  // 2. ¡El Hook!
  // Creamos la *función* debounced que llamará a 'saveDocument'.
  const debouncedSave = useDebouncedCallback(
    saveDocument, // La función que queremos "debouncear"
    SAVE_DELAY_MS,
    { maxWait: MAX_WAIT_MS }
  )

  // 3. Manejador del 'onChange'
  const handleChange = (value: string) => {
    setIsEditing(true)
    debouncedSave(value)
  }

  const getSaveStatus = useCallback(() => {
    if (updateContent.isError) {
      return {
        label: 'Error saving',
        type: 'error' as const
      }
    }

    if (updateContent.isPending) {
      return {
        label: 'Saving...',
        type: 'saving' as const
      }
    }

    if (updateContent.isSuccess && isEditing === false) {
      return {
        label: 'Saved',
        type: 'success' as const
      }
    }

    if (isEditing) {
      return {
        label: 'Type something...',
        type: 'editing' as const
      }
    }

    return {
      label: 'Inactive',
      type: 'idle' as const
    }
  }, [
    updateContent.isError,
    updateContent.isPending,
    updateContent.isSuccess,
    isEditing
  ])

  const status = getSaveStatus()

  return (
    <>
      <EditorHeader
        document={document}
        isFetching={isFetching}
        onSave={debouncedSave.flush}
        status={status}
        hasError={updateContent.isError}
        errorMessage={updateContent.error?.message}
      />
      <EditorDocument
        document={document}
        onChange={handleChange} // 🔹 esta actualiza editorValue
      />
    </>
  )
}
