import SearchCommand from '@/components/search-command'
import { AppSidebar } from '@/components/sidebarContainer/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { prefetchUser } from '@/features/documents/server/prefetch'
import { requireAuth } from '@/lib/auth-utils'
import { caller } from '@/trpc/server'

export default async function Layout({
  children
}: {
  children: React.ReactNode
}) {
  await requireAuth()

  const data = await caller.documents.getMany({ withChildren: false })

  prefetchUser()
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className='flex-1 overflow-hidden'>
          <SearchCommand data={data} />
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
