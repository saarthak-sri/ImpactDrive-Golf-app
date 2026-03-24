import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { CharityManager } from '@/components/charity-manager'
import { HeartPulse } from 'lucide-react'

export default async function CharityPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Parallel fetching
  const [charitiesReq, prefsReq] = await Promise.all([
    supabase.from('charities').select('*').order('is_featured', { ascending: false }),
    supabase.from('user_charity_preferences').select('*').eq('user_id', user?.id).single()
  ])

  const charities = charitiesReq.data || []
  const prefs = prefsReq.data || { charity_id: null, contribution_percentage: 10 }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">My Impact</h1>
        <p className="text-slate-400 max-w-2xl">Control exactly where your guaranteed contribution goes. Increase your percentage to drive more impact to causes you care about.</p>
      </header>

      {charities.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl">
          <HeartPulse className="w-12 h-12 mx-auto mb-4 text-rose-500/50" />
          <h3 className="text-xl font-bold mb-2">Charity Directory Empty</h3>
          <p className="text-slate-400">Our team is currently onboarding charity partners. Check back soon for the directory update.</p>
        </div>
      ) : (
        <CharityManager charities={charities} initialPrefs={prefs} />
      )}
    </div>
  )
}
