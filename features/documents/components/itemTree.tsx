'use client'

import {
  ChevronRight,
  FileTextIcon,
  FolderIcon,
  FolderOpenIcon,
  MoreHorizontalIcon,
  PlusIcon
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import {
  SidebarMenuAction,
  SidebarMenuItem,
  SidebarMenuSub
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { singleDocument } from './containerTree'

interface ItemTreeProps {
  item: singleDocument
  onAddChild: (parentId?: string) => void
}

export default function ItemTree({ item, onAddChild }: ItemTreeProps) {
  const pathname = usePathname()
  const isActive = pathname === `/documents/${item.id}`
  const hasChildren = item.childDocuments?.length > 0

  const Content = (
    <div className='flex gap-x-2 w-full p-2 overflow-hidden rounded-md items-center hover:bg-sidebar-accent [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0'>
      {hasChildren ? (
        <>
          <FolderIcon className='group-data-[state=open]/trigger:hidden group-hover/item:hidden' />
          <FolderOpenIcon className='hidden not-first:group-data-[state=open]/trigger:block group-data-[state=open]/trigger:group-hover/item:hidden' />
          <ChevronRight className='hidden group-hover/item:block group-data-[state=open]/trigger:rotate-90 transition-transform duration-200' />
        </>
      ) : (
        <FileTextIcon />
      )}
      <Link
        className='flex items-center gap-2 w-full [&>svg]:size-4 [&>svg]:shrink-0'
        href={`/documents/${item.id}`}
      >
        {item.name}
      </Link>
    </div>
  )

  return (
    <SidebarMenuItem>
      <Collapsible className='group/item hover:[&_.item-action]:visible'>
        <div
          className={cn(
            'flex w-full select-none items-center gap-2 overflow-hidden rounded-md text-left text-sm outline-hidden ring-sidebar-ring',
            isActive && 'bg-sidebar-accent text-sidebar-accent-foreground'
          )}
        >
          {hasChildren ? (
            <CollapsibleTrigger className='group/trigger' asChild>
              {Content}
            </CollapsibleTrigger>
          ) : (
            Content
          )}

          <div className='absolute top-2 right-1 flex gap-1'>
            {[
              {
                icon: MoreHorizontalIcon,
                label: 'Toggle',
                onClick: () => {},
                id: '1'
              },
              {
                icon: PlusIcon,
                label: 'Add page inside',
                onClick: () => onAddChild(item.id),
                id: '2'
              }
            ].map(({ icon: Icon, label, onClick, id }) => (
              <SidebarMenuAction
                key={id}
                className={cn(
                  'item-action static invisible right-1.5 top-1.5 hover:bg-sidebar-accent',
                  isActive && 'hover:bg-card'
                )}
                onClick={onClick}
              >
                <Icon />
                <span className='sr-only'>{label}</span>
              </SidebarMenuAction>
            ))}
          </div>
        </div>

        {hasChildren && (
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.childDocuments.map((subItem: singleDocument) => (
                <ItemTree
                  key={subItem.id}
                  item={subItem}
                  onAddChild={onAddChild}
                />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        )}
      </Collapsible>
    </SidebarMenuItem>
  )
}
