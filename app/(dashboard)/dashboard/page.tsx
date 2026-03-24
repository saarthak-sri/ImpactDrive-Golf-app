import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { ArrowRight, Plus, Target, Trophy, HeartPulse, Beaker } from 'lucide-react'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Fetch subscriptions
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('status, current_period_end')
    .eq('user_id', user.id)
    .single()

  // Fetch scores (latest 5)
  const { data: scores } = await supabase
    .from('scores')
    .select('score, played_date')
    .eq('user_id', user.id)
    .order('played_date', { ascending: false })
    .limit(5)

  const isSubscribed = sub?.status === 'active'

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard overview</h1>
          <p className="text-slate-400">Welcome back. Here is your monthly impact and stats.</p>
        </div>
        {!isSubscribed && (
          <div className="flex items-center gap-3">
            <form action="/api/dev/mock-subscribe" method="POST">
               <button type="submit" className="px-5 py-2.5 bg-slate-800 text-emerald-400 font-bold rounded-full hover:bg-slate-700 transition flex items-center gap-2 border border-emerald-500/30">
                 <Beaker className="w-4 h-4" /> Mock Subscribe
               </button>
            </form>
            <Link href="/dashboard/subscribe" className="px-5 py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-full hover:bg-emerald-400 transition flex items-center gap-2">
              Activate Real Sub <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </header>

      {/* Subscription Banner */}
      {isSubscribed && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-between">
          <div>
            <span className="text-emerald-400 font-bold mb-1 block">Active Subscriber</span>
            <p className="text-sm text-slate-300">Your next draw entry is secured. Renewal on {new Date(sub.current_period_end).toLocaleDateString()}.</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Scores Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2"><Target className="w-5 h-5 text-emerald-400" /> Recent Scores</h3>
            <Link href="/dashboard/scores" className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">Add Score</Link>
          </div>
          <div className="flex-1 space-y-3">
            {scores && scores.length > 0 ? (
              scores.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-emerald-400 font-mono font-bold">{s.score} <span className="text-xs text-slate-500">pts</span></span>
                  <span className="text-xs text-slate-400">{new Date(s.played_date).toLocaleDateString()}</span>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 py-8">
                 <p className="text-sm mb-4">No scores logged yet.</p>
                 <Link href="/dashboard/scores" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-full text-sm text-white transition flex items-center gap-2">
                   <Plus className="w-4 h-4" /> Log your first round
                 </Link>
              </div>
            )}
          </div>
        </div>

        {/* Charity Impact */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2"><HeartPulse className="w-5 h-5 text-rose-400" /> My Impact</h3>
            <Link href="/dashboard/charity" className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">Manage</Link>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center text-center p-6 border-2 border-dashed border-slate-800 rounded-2xl">
            <p className="text-slate-400 mb-2">You are contributing</p>
            <span className="text-4xl font-black text-white">10%</span>
            <p className="text-sm text-slate-500 mt-2">of your subscription directly to charity.</p>
          </div>
        </div>

        {/* Draw Countdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Trophy className="w-48 h-48" />
          </div>
          <h3 className="font-bold text-lg mb-2 relative z-10">Next Draw</h3>
          <p className="text-slate-400 text-sm mb-6 relative z-10">Estimated Prize Pool</p>
          <div className="flex-1 flex items-end">
            <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
              $12,450
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
