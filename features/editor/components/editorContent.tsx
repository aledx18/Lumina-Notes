import { PartialBlock } from '@blocknote/core'
import '@blocknote/core/fonts/inter.css'
import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/shadcn'
import '@blocknote/shadcn/style.css'

import { useTheme } from 'next-themes'

type EditorContentProps = {
  onChange: (value: string) => void
  initialContent?: string | null
  editable?: boolean
}

export default function EditorContent({
  onChange,
  initialContent,
  editable
}: EditorContentProps) {
  const { resolvedTheme } = useTheme()
  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    editable,
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined
  })

  return (
    <BlockNoteView
      editor={editor}
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      className='mt-12'
      onChange={() => onChange(JSON.stringify(editor.document, null, 2))}
    />
  )
}
