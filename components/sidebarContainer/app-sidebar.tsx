import { NotebookPenIcon } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { ContainerTree } from '@/features/documents/components/containerTree'
import {
  prefetchArchivedDocuments,
  prefetchDocuments
} from '@/features/documents/server/prefetch'
import { caller, HydrateClient } from '@/trpc/server'
import { NavSecondary } from './nav-secondary'
import { NavUser } from './nav-user'

export async function AppSidebar() {
  const user = await caller.user.getOne()

  prefetchDocuments()
  prefetchArchivedDocuments()

  return (
    <Sidebar variant='inset' collapsible='icon'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <Link href='/'>
                <div className='bg-muted text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                  <NotebookPenIcon className='size-4' />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>Lumina-Notes</span>
                  <span className='truncate text-xs'>Enterprise</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <HydrateClient>
          <ErrorBoundary fallback={<div>Error!</div>}>
            <Suspense fallback={<div>Loading...</div>}>
              <ContainerTree />
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
        <NavSecondary />
      </SidebarContent>
      <SidebarFooter>
        {user && (
          <Suspense fallback={<div>Loading...</div>}>
            <NavUser name={user.name} email={user.email} image={user.image} />
          </Suspense>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
