'use client'

import { EditIcon, SaveIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  useSuspenseDocument,
  useUpdateDocumentName
} from '../hooks/use-suspense-document'

export function EditorBreadcrumbs({ documentId }: { documentId: string }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href='/documents'>Documents</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <EditorHeaderInput documentId={documentId} />
      </BreadcrumbList>
    </Breadcrumb>
  )
}
export function EditorSaveButton() {
  return (
    <div className='ml-auto'>
      <Button size='sm' disabled={false} onClick={() => console.log('save')}>
        <SaveIcon className='size-4' />
        Save
      </Button>
    </div>
  )
}

export function EditorHeaderInput({ documentId }: { documentId: string }) {
  const { data: document } = useSuspenseDocument(documentId)

  const [name, setName] = useState(document.name)
  const [isEditing, setIsEditing] = useState(false)

  const updateName = useUpdateDocumentName()

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (document.name) {
      setName(document.name)
    }
  }, [document.name])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleSave = async () => {
    if (name === document.name) {
      setIsEditing(false)
      return
    }

    try {
      await updateName.mutateAsync({
        id: documentId,
        name
      })
    } catch (e) {
      setName(document.name)
      console.log(e)
    } finally {
      setIsEditing(false)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSave()
    } else if (event.key === 'Escape') {
      setName(document.name)
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <Input
        disabled={updateName.isPending}
        value={name}
        onChange={(e) => setName(e.target.value)}
        ref={inputRef}
        onKeyDown={handleKeyDown}
        onBlur={handleSave}
        className='min-w-[100px] px-2 w-auto'
      />
    )
  }

  return (
    <div className='relative inline-flex items-center justify-center group'>
      <BreadcrumbItem
        onClick={() => setIsEditing(true)}
        className='cursor-pointer font-semibold hover:text-primary'
      >
        {document.name}
        <span className='ml-2 invisible group-hover:visible transition-opacity'>
          <EditIcon className='size-4 stroke-accent-foreground' />
        </span>
      </BreadcrumbItem>
    </div>
  )
}

export default function EditorHeader({ documentId }: { documentId: string }) {
  return (
    <header className='flex h-16 shrink-0 items-center gap-2'>
      <div className='flex items-center justify-between w-full px-4 '>
        <div className='flex gap-2 items-center'>
          <SidebarTrigger className='-ml-1' />
          <EditorBreadcrumbs documentId={documentId} />
        </div>
        <EditorSaveButton />
      </div>
    </header>
  )
}
