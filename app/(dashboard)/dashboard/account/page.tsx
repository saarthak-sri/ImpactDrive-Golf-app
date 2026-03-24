import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { UserCircle, BadgeCheck, ArrowRight } from 'lucide-react'

export default async function AccountPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2">My Account</h1>
        <p className="text-slate-400">Manage your profile and authentication settings.</p>
      </header>

      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center">
             <UserCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Email Address</p>
            <p className="text-xl font-bold">{user?.email}</p>
          </div>
        </div>
        
        <hr className="border-slate-800" />
        
        <div className="flex items-center justify-between">
            <div>
               <p className="font-bold flex items-center gap-2"><BadgeCheck className="w-5 h-5 text-emerald-400" /> Billing Settings</p>
               <p className="text-sm text-slate-400">Manage your subscription, cards, and invoices.</p>
            </div>
            <Link href="/dashboard/subscribe" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition font-medium flex items-center gap-2">
               Manage billing <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
      </div>
    </div>
  )
}
