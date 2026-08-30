import { AdminNav } from '@/components/admin/AdminNav'
import { requireAdmin } from '@/lib/auth/session'
export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) { await requireAdmin(); return <div className="admin-shell"><AdminNav />{children}</div> }
