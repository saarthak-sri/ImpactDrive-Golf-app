import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Trophy, Info } from 'lucide-react'

export default async function DrawsPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Fetch the latest published draw
  const { data: latestDraw } = await supabase
    .from('draws')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  // Fetch user's winning record for that draw, if any
  let userWinnings = null
  if (latestDraw) {
    const { data } = await supabase
      .from('draw_winners')
      .select('matched_tier, prize_amount, status')
      .eq('draw_id', latestDraw.id)
      .eq('user_id', user?.id)
      .single()
    userWinnings = data
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Draw Results</h1>
        <p className="text-slate-400">View the monthly draws and track your verified winnings.</p>
      </header>

      {!latestDraw ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl">
          <Trophy className="w-12 h-12 mx-auto mb-4 text-emerald-500/50" />
          <h3 className="text-xl font-bold mb-2">No Draws Yet</h3>
          <p className="text-slate-400">The first massive payout draw hasn't been executed yet. Keep your scores updated!</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-900/60 to-slate-900 p-8 rounded-full rounded-3xl border border-emerald-800/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Trophy className="w-32 h-32 text-emerald-400" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                 <span className="px-3 py-1 bg-emerald-500 text-slate-950 font-bold text-sm tracking-wider uppercase rounded-full">
                    Latest Finalized Draw
                 </span>
                 <span className="text-slate-400 font-medium">{latestDraw.month}/{latestDraw.year}</span>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                 <div>
                   <p className="text-slate-400 mb-1">Total Prize Pool Distributed</p>
                   <p className="text-4xl font-black text-white">${Number(latestDraw.total_prize_pool).toLocaleString()}</p>
                 </div>
                 {latestDraw.jackpot_rollover > 0 && (
                   <div>
                     <p className="text-slate-400 mb-1">Rolled Over to Next Month</p>
                     <p className="text-2xl font-black text-amber-400">${Number(latestDraw.jackpot_rollover).toLocaleString()}</p>
                   </div>
                 )}
              </div>

              <div>
                <p className="text-slate-400 mb-4">The Winning Numbers</p>
                <div className="flex gap-3 flex-wrap">
                  {(latestDraw.winning_scores as number[]).map((num, i) => (
                    <div key={i} className="w-14 h-14 rounded-2xl bg-slate-950 border border-emerald-500/50 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                      <span className="text-xl font-bold text-emerald-400">{num}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* User Results */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
             <h3 className="text-xl font-bold mb-6">Your Status for this Draw</h3>
             
             {userWinnings ? (
               <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                 <h4 className="text-emerald-400 font-bold text-lg mb-2">🎉 Congratulations! You won!</h4>
                 <div className="grid grid-cols-2 gap-4 mt-4">
                   <div>
                     <p className="text-slate-400 text-sm">Matched Numbers</p>
                     <p className="text-xl font-bold">{userWinnings.matched_tier}</p>
                   </div>
                   <div>
                     <p className="text-slate-400 text-sm">Prize Amount</p>
                     <p className="text-xl font-bold text-emerald-400">${Number(userWinnings.prize_amount).toLocaleString()}</p>
                   </div>
                   <div className="col-span-2 pt-4 mt-2 border-t border-emerald-500/20">
                     <p className="text-slate-400 text-sm">Payout Status</p>
                     <p className="font-bold capitalize">{userWinnings.status.replace('_', ' ')}</p>
                     {userWinnings.status === 'pending' && (
                       <div className="mt-4 p-4 bg-slate-950 rounded-xl flex items-start gap-4">
                          <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                          <div className="text-sm text-slate-300">
                             Please await admin verification. Our team cross-references scores and payment legitimacy before releasing funds to your connected Stripe account.
                          </div>
                       </div>
                     )}
                   </div>
                 </div>
               </div>
             ) : (
               <div className="text-center p-8 bg-slate-950 rounded-2xl border border-slate-800">
                  <p className="text-slate-400 mb-2">No winning match this round.</p>
                  <p className="text-sm font-medium">Keep uploading accurate scores to maximize your chances in the algorithmic draw next month!</p>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  )
}
