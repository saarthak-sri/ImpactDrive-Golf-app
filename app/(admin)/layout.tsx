import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ShieldAlert, Users, HeartHandshake, Dices, Image as ImageIcon, LayoutDashboard } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard') // Redirect non-admins to standard dashboard
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 space-y-8 flex flex-col">
        <Link href="/admin" className="text-xl font-bold flex items-center gap-2">
           <ShieldAlert className="text-rose-500" />
           <span>Admin<span className="text-slate-400 font-normal">Panel</span></span>
        </Link>
        
        <nav className="flex-1 space-y-2">
           <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800">
             <Users className="w-5 h-5" /> Users & Subs
           </Link>
           <Link href="/admin/draws" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium bg-rose-500/10 text-rose-400">
             <Dices className="w-5 h-5" /> Draw Management
           </Link>
           <Link href="/admin/charities" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800">
             <HeartHandshake className="w-5 h-5" /> Charities
           </Link>
           <Link href="/admin/verification" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800">
             <ImageIcon className="w-5 h-5" /> Verifications
           </Link>
        </nav>

        <div className="pt-8 border-t border-slate-800">
           <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-emerald-400 hover:bg-emerald-500/10">
              <LayoutDashboard className="w-5 h-5" /> Back to Dashboard
           </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8 max-w-6xl">
         {children}
      </main>
    </div>
  )
}
