import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { ScoreEntry } from '@/components/score-entry'
import { Target } from 'lucide-react'

export default async function ScoresPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const { data: scores } = await supabase
    .from('scores')
    .select('score, played_date')
    .eq('user_id', user?.id)
    .order('played_date', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2">My Scores</h1>
        <p className="text-slate-400">Manage your latest Stableford rounds affecting your draw entries.</p>
      </header>

      <ScoreEntry />

      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Target className="w-5 h-5 text-emerald-400" /> Active Roster (Latest 5)</h2>
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
          {scores && scores.length > 0 ? (
            <div className="divide-y divide-slate-800">
              {scores.map((s, i) => (
                <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-800/50 transition">
                  <div className="flex flex-col">
                    <span className="text-sm text-slate-400 font-medium mb-1">Round {i + 1}</span>
                    <span className="text-slate-200">{new Date(s.played_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-baseline gap-1 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                    <span className="text-2xl font-black text-emerald-400">{s.score}</span>
                    <span className="text-sm font-medium text-slate-500">pts</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">
              <Target className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No active scores. Play a round and log it above!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
