'use client'

import { ArchiveIcon, Settings, Trash2Icon, Undo2Icon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import {
  useRemoveDocument,
  useSuspenseArchivedDocuments,
  useUnarchiveDocument
} from '@/features/documents/hooks/use-suspense-document'
import ConfirmModal from '../modals/confirm-modal'

export function NavSecondary() {
  const { data: archivedDocuments, isFetching } = useSuspenseArchivedDocuments()
  const unarchive = useUnarchiveDocument()
  const remove = useRemoveDocument()

  return (
    <SidebarGroup className='mt-auto'>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <Popover>
              <PopoverTrigger asChild className='w-full cursor-pointer'>
                <SidebarMenuButton
                  className='data-[state=open]:bg-accent data-[state=open]:text-accent-foreground'
                  asChild
                >
                  <span>
                    <ArchiveIcon />
                    Archive
                  </span>
                </SidebarMenuButton>
              </PopoverTrigger>
              <PopoverContent forceMount side='right' className='w-72 p-1'>
                <ScrollArea className='h-44 px-3'>
                  {archivedDocuments.map((document) => (
                    <div
                      key={document.id}
                      className='text-sm rounded-sm w-full flex items-center hover:bg-sidebar-accent justify-between gap-y-3'
                    >
                      <span className='truncate pl-1'>{document.name}</span>
                      {/* todo: add child count ... no muestra hijos de hijos o solo hijos sin el padre*/}
                      <span className='truncate pl-1'>
                        {document.childDocuments
                          .map((child) => child.name)
                          .join(', ')}
                      </span>

                      <div className='flex'>
                        <Button
                          onClick={() => {
                            unarchive.mutateAsync({
                              id: document.id
                            })
                          }}
                          variant='ghost'
                          size='icon'
                          disabled={isFetching}
                        >
                          <Undo2Icon />
                        </Button>
                        <ConfirmModal
                          onConfirm={() => {
                            remove.mutateAsync({
                              id: document.id
                            })
                          }}
                        >
                          <Button
                            variant='ghost'
                            size='icon'
                            disabled={isFetching}
                          >
                            <Trash2Icon />
                          </Button>
                        </ConfirmModal>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
                <p className='text-xs text-muted-foreground pl-4 py-2'>
                  Last edited by: ...
                </p>
              </PopoverContent>
            </Popover>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href='/settings'>
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
