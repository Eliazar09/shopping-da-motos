import type { Metadata } from 'next'
import Sidebar from '@/components/admin/layout/Sidebar'
import Topbar from '@/components/admin/layout/Topbar'

export const metadata: Metadata = {
  title: { default: 'Admin — Rafael Mota', template: '%s | Admin' },
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ display: 'flex', flexDirection: 'row', height: '100vh', overflow: 'hidden', background: '#FAFBFC' }}
    >
      <Sidebar />
      <div
        className="flex flex-1 flex-col overflow-hidden"
        style={{ display: 'flex', flex: '1 1 0%', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}
      >
        <Topbar />
        <main
          className="flex-1 overflow-y-auto overflow-x-hidden"
          style={{ flex: '1 1 0%', overflowY: 'auto', overflowX: 'hidden' }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
