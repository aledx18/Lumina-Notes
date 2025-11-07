'use client'

import { ArchiveIcon, Settings, Trash2Icon, Undo2Icon } from 'lucide-react'
import Link from 'next/link'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import {
  useSuspenseArchivedDocuments,
  useUnarchiveDocument
} from '@/features/documents/hooks/use-suspense-document'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { ScrollArea } from '../ui/scroll-area'

export function NavSecondary() {
  const { data: archivedDocuments, isFetching } = useSuspenseArchivedDocuments()
  const unarchive = useUnarchiveDocument()

  return (
    <SidebarGroup className='mt-auto'>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <Popover>
              <PopoverTrigger asChild className='w-full'>
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
                        <Button
                          variant='ghost'
                          size='icon'
                          disabled={isFetching}
                        >
                          <Trash2Icon />
                        </Button>
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
