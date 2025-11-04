'use client'

import { ChevronRight, FileIcon, FileTextIcon, PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '@/components/ui/sidebar'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import {
  useCreateDocument,
  useSuspenseDocuments
} from '../hooks/use-suspense-document'

/*
 * Subcomponent: DocumentChildren
 **/

// biome-ignore lint/suspicious/noExplicitAny: <any>
function DocumentChildren({ docChildren }: { docChildren: any[] }) {
  return (
    <CollapsibleContent>
      <SidebarMenuSub>
        {docChildren.map((subItem) => (
          <SidebarMenuSubItem key={subItem.id}>
            <SidebarMenuSubButton asChild>
              <Link href={subItem.id}>
                <FileIcon className='size-4' />
                <span>{subItem.name}</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        ))}
      </SidebarMenuSub>
    </CollapsibleContent>
  )
}

/*
 * Subcomponent: DocumentMenuActions
 **/
function DocumentMenuActions({
  isActive,
  hasChildren,
  onAddChild
}: {
  isActive: boolean
  hasChildren: boolean
  onAddChild: () => void
}) {
  return (
    <div className='absolute top-1.5 right-1 flex gap-1'>
      <Tooltip delayDuration={400}>
        <TooltipTrigger asChild>
          <SidebarMenuAction
            className={cn(
              'item-action static invisible right-1.5 top-1.5',
              isActive && 'hover:bg-card'
            )}
            onClick={(e) => {
              e.preventDefault()
              onAddChild()
            }}
          >
            <PlusIcon />
            <span className='sr-only'>Add page inside</span>
          </SidebarMenuAction>
        </TooltipTrigger>
        <TooltipContent side='bottom'>
          <p>Add a page Inside</p>
        </TooltipContent>
      </Tooltip>

      {/* Toggle children */}
      {hasChildren && (
        <CollapsibleTrigger asChild>
          <SidebarMenuAction
            className={cn(
              'static data-[state=open]:rotate-90',
              isActive && 'hover:bg-card'
            )}
          >
            <ChevronRight />
            <span className='sr-only'>Toggle</span>
          </SidebarMenuAction>
        </CollapsibleTrigger>
      )}
    </div>
  )
}

/*
 * Main Component: NavDocuments
 **/
export function NavDocuments() {
  const createDocument = useCreateDocument()
  const { data: documents } = useSuspenseDocuments()
  const pathname = usePathname()

  const handleCreate = (parentId?: string) => {
    createDocument.mutate(
      { parentDocumentId: parentId },
      {
        onError: console.error,
        onSuccess: (data) => console.log(data)
      }
    )
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className='flex items-center justify-between gap-2 text-sm mb-2 group'>
        Documents
        <div className='opacity-0 group-hover:opacity-100 transition-opacity'>
          <Button size='xs' variant='secondary' onClick={() => handleCreate()}>
            <PlusIcon className='size-4' />
          </Button>
        </div>
      </SidebarGroupLabel>

      <SidebarMenu>
        {documents?.map((item) => {
          const isActive = pathname === `/documents/${item.id}`
          const hasChildren = !!item.childDocuments?.length

          return (
            <Collapsible key={item.id} defaultOpen={isActive} asChild>
              <SidebarMenuItem className='relative hover:[&_.item-action]:visible'>
                <SidebarMenuButton
                  isActive={isActive}
                  asChild
                  tooltip={item.name}
                >
                  <Link href={`/documents/${item.id}`}>
                    <FileTextIcon />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>

                <DocumentMenuActions
                  isActive={isActive}
                  hasChildren={hasChildren}
                  onAddChild={() => handleCreate(item.id)}
                />

                {hasChildren && item.childDocuments && (
                  <DocumentChildren docChildren={item.childDocuments} />
                )}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
