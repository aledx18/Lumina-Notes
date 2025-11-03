import AppHeader from '@/components/app-header'
import { AppSidebar } from '@/components/sidebarContainer/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className='flex-1 overflow-hidden'>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
