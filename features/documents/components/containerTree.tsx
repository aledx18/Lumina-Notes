'use client'

import { inferProcedureOutput } from '@trpc/server'
import { PlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu
} from '@/components/ui/sidebar'
import { AppRouter } from '@/trpc/routers/_app'
import {
  useCreateDocument,
  useSuspenseDocuments
} from '../hooks/use-suspense-document'
import ItemTree from './itemTree'

export type singleDocument = inferProcedureOutput<
  AppRouter['documents']['getMany']
>[number]

export function ContainerTree() {
  const createDocument = useCreateDocument()
  // todo : add error handling, loading, etc
  const { data, isLoading } = useSuspenseDocuments()
  const router = useRouter()

  const typedData = data as inferProcedureOutput<
    AppRouter['documents']['getMany']
  >

  const handleCreate = (parentId?: string) => {
    createDocument.mutate(
      { parentDocumentId: parentId },
      {
        onError: console.error,
        onSuccess: (data) => router.push(`/documents/${data.id}`)
      }
    )
  }
  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarGroupLabel className='flex items-center justify-between gap-2 text-sm mt-4 group'>
            <Button
              disabled={isLoading}
              size='lg'
              variant='secondary'
              onClick={() => handleCreate()}
            >
              Create a new File
              <PlusIcon />
            </Button>
          </SidebarGroupLabel>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Files</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {typedData.map((item: singleDocument) => (
              <ItemTree
                key={item.id}
                item={item}
                onAddChild={handleCreate}
                disabled={isLoading}
              />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  )
}
