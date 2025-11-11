'use client'

import { FileIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { useSearch } from '@/hooks/use-search'
import { Document } from '@/lib/generated/prisma'

type SearchCommandProps = {
  data: Document[]
}

export default function SearchCommand({ data }: SearchCommandProps) {
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  const toggle = useSearch((store) => store.toggle)
  const isOpen = useSearch((store) => store.isOpen)
  const onClose = useSearch((store) => store.onClose)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggle()
      }
    }
    document.addEventListener('keydown', down)
    return () => {
      document.removeEventListener('keydown', down)
    }
  }, [toggle])

  const onSelect = (id: string) => {
    router.push(`/documents/${id}`)
    onClose()
  }

  if (!isMounted) return null

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder='Search...' />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading='Documents'>
          {data.map((document) => (
            <CommandItem
              key={document.id}
              value={`${document.name}`}
              title={document.name}
              onSelect={onSelect}
            >
              {document.icon ? (
                <p className='mr-2 text-[18px] '>{document.icon}</p>
              ) : (
                <FileIcon />
              )}
              <p>{document.name}</p>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
