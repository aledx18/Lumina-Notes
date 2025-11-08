'use client'

import { EditIcon, SaveIcon, Trash2Icon, Undo2Icon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
import { Document } from '@/lib/generated/prisma'
import {
  useRemoveDocument,
  useSuspenseDocument,
  useUnarchiveDocument,
  useUpdateDocumentName
} from '../hooks/use-suspense-document'

export function EditorBreadcrumbs({ document }: { document: Document }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href='/documents'>Documents</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <EditorHeaderInput document={document} />
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

export function EditorHeaderInput({ document }: { document: Document }) {
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
        id: document.id,
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
  const { data: document, isFetching } = useSuspenseDocument(documentId)
  const router = useRouter()
  const unarchive = useUnarchiveDocument()
  const remove = useRemoveDocument()

  return (
    <header className='flex shrink-0 items-center flex-col'>
      <div className='flex h-16 items-center justify-between w-full px-4 '>
        <div className='flex gap-2 items-center'>
          <SidebarTrigger className='-ml-1' />
          <EditorBreadcrumbs document={document} />
        </div>
        <EditorSaveButton />
      </div>
      {document.isArchived && (
        <div className='bg-rose-400 w-full flex items-center justify-center py-2'>
          <div className='flex items-center gap-x-10'>
            <div className='flex gap-x-2'>
              <Button
                onClick={() => {
                  unarchive.mutateAsync(
                    {
                      id: document.id
                    },
                    {
                      onSuccess: () => {
                        router.push(`/documents/${document.id}`)
                      }
                    }
                  )
                }}
                variant='outline'
                size='sm'
                disabled={isFetching}
              >
                Restore
                <Undo2Icon />
              </Button>

              <Button
                onClick={() => {
                  remove.mutateAsync({
                    id: document.id
                  })
                }}
                variant='outline'
                size='sm'
                disabled={isFetching}
              >
                Delete
                <Trash2Icon />
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
