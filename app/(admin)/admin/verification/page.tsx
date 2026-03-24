import { createServerClient } from '@supabase/ssr'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { ImageIcon, Check, X } from 'lucide-react'
import { revalidatePath } from 'next/cache'

export default async function AdminVerificationPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, 
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
  )

  const { data: pending, error } = await supabase
    .from('draw_winners')
    .select('id, matched_tier, prize_amount, proof_url, status, created_at, user_id')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) {
    return <div className="p-8 text-red-500">Database Error: {error.message}</div>
  }

  // Fetch emails manually
  const userIds = pending?.map(p => p.user_id) || []
  let userMap = new Map()
  if (userIds.length > 0) {
    const { data: usersData } = await supabase.from('users').select('id, email').in('id', userIds)
    userMap = new Map(usersData?.map(u => [u.id, u.email]) || [])
  }

  const enrichedPending = pending?.map(p => ({
    ...p,
    email: userMap.get(p.user_id)
  }))

  async function processVerification(formData: FormData) {
    "use server"
    const winnerId = formData.get('id') as string
    const action = formData.get('action') as 'approved' | 'rejected'

    const supabaseAction = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    await supabaseAction
      .from('draw_winners')
      .update({ status: action }) // Update to 'approved' or 'rejected'
      .eq('id', winnerId)

    revalidatePath('/admin/verification')
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Pending Verifications</h1>
        <p className="text-slate-400">Review users claiming draw matches. Confirm their proof and approve standard payouts.</p>
      </header>

      {(!enrichedPending || enrichedPending.length === 0) ? (
        <div className="p-12 border border-slate-800 bg-slate-900 rounded-3xl text-center">
          <ImageIcon className="w-12 h-12 mx-auto mb-4 text-emerald-500/30" />
          <h3 className="text-xl font-bold mb-2">All Caught Up</h3>
          <p className="text-slate-400">There are no pending winner verifications requiring your attention.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {enrichedPending.map((w: any) => (
            <div key={w.id} className="p-6 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6">
               <div className="flex-1">
                 <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-sm tracking-wider uppercase rounded-full">
                       Match {w.matched_tier}
                    </span>
                    <span className="text-slate-500 text-sm">{new Date(w.created_at).toLocaleDateString()}</span>
                 </div>
                 <p className="font-medium text-lg mb-1">{w.email}</p>
                 <p className="text-3xl font-black text-white">${Number(w.prize_amount).toLocaleString()}</p>
                 
                 {w.proof_url ? (
                   <a href={w.proof_url} target="_blank" className="inline-block mt-4 text-sm text-blue-400 hover:underline">View Uploaded Proof Document &rarr;</a>
                 ) : (
                   <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm rounded-xl">
                     User has not uploaded proof yet. Do not approve without external verification.
                   </div>
                 )}
               </div>

               <div className="flex items-center gap-3 md:flex-col md:min-w-32">
                 <form action={processVerification} className="w-full">
                    <input type="hidden" name="id" value={w.id} />
                    <button 
                      type="submit" 
                      name="action" 
                      value="approved" 
                      className="w-full px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition flex items-center justify-center gap-2 mb-3"
                    >
                       <Check className="w-5 h-5" /> Approve
                    </button>
                    <button 
                      type="submit" 
                      name="action" 
                      value="rejected" 
                      className="w-full px-4 py-3 bg-slate-800 hover:bg-rose-500/20 text-rose-400 font-bold rounded-xl transition flex items-center justify-center gap-2 border border-slate-700"
                    >
                       <X className="w-5 h-5" /> Reject
                    </button>
                 </form>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
