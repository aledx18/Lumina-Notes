'use client'

import { Document } from '@/lib/generated/prisma'
import Cover from './components/cover'
import EditorContent from './components/editorContent'
import Toolbar from './components/toolbar'

type EditorDocumentProps = {
  document: Document
  onChange: (value: string) => void
}

export default function EditorDocument({
  document,
  onChange
}: EditorDocumentProps) {
  return (
    <div>
      <Cover id={document.id} url={document?.coverImage} />
      <div className='md:max-w-3xl lg:max-w-7xl mx-auto'>
        <Toolbar initialData={document} />
        <EditorContent initialContent={document?.content} onChange={onChange} />
      </div>
    </div>
  )
}
