import { createServerClient } from '@supabase/ssr'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { Users, ShieldAlert, BadgeCheck } from 'lucide-react'

export default async function AdminUsersPage() {
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // List users directly from Auth API to bypass any missing triggers
  const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers()

  if (error) {
    return <div className="p-8 text-red-500">Database Error: {error.message}</div>
  }

  // Fetch public user roles just in case
  const { data: publicUsers } = await supabaseAdmin.from('users').select('id, role')
  const pubMap = new Map(publicUsers?.map(u => [u.id, u]) || [])

  // Fetch subscriptions
  const { data: subs } = await supabaseAdmin.from('subscriptions').select('user_id, status, plan_type')
  const subsMap = new Map(subs?.map(s => [s.user_id, s]) || [])

  // Map enriched users
  const enrichedUsers = users?.map((u: any) => {
    const pData = pubMap.get(u.id)
    return {
      id: u.id,
      email: u.email,
      role: pData?.role || 'user',
      created_at: u.created_at,
      subscription: subsMap.get(u.id)
    }
  })
  // Optional: sort by latest
  if (enrichedUsers) enrichedUsers.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2">User Management</h1>
        <p className="text-slate-400">View and manage platform users, their roles, and subscription status.</p>
      </header>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/50 text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Subscription</th>
                <th className="px-6 py-4 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {enrichedUsers?.map((u: any) => (
                <tr key={u.id} className="hover:bg-slate-800/20 transition">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-200">{u.email}</div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">{u.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    {u.role === 'admin' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold uppercase tracking-wider">
                        <ShieldAlert className="w-3 h-3" /> Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-medium uppercase tracking-wider">
                        User
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {u.subscription?.status === 'active' ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
                         <BadgeCheck className="w-4 h-4" /> {u.subscription.plan_type}
                      </span>
                    ) : (
                      <span className="text-slate-500">Inactive</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {(!enrichedUsers || enrichedUsers.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <Users className="w-8 h-8 mx-auto mb-3 opacity-20" />
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
