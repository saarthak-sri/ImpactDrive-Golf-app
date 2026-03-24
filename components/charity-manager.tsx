"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, Loader2, CheckCircle2 } from 'lucide-react'

type Charity = { id: string; name: string; description: string; logo_url: string; is_featured: boolean }
type Prefs = { charity_id: string | null; contribution_percentage: number }

export function CharityManager({ charities, initialPrefs }: { charities: Charity[], initialPrefs: Prefs }) {
  const [selectedId, setSelectedId] = useState<string | null>(initialPrefs.charity_id)
  const [percentage, setPercentage] = useState<number>(initialPrefs.contribution_percentage || 10)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const router = useRouter()

  const handleSave = async () => {
    setLoading(true)
    setSuccess(false)
    try {
      const res = await fetch('/api/user/charity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ charity_id: selectedId, contribution_percentage: percentage })
      })
      if (!res.ok) throw new Error('Failed to save preferences')
      setSuccess(true)
      router.refresh()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-12">
      {/* Slider Section */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-2xl">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
           <Heart className="w-5 h-5 text-rose-400" /> My Impact Level
        </h2>
        
        <div className="space-y-6">
          <div className="flex justify-between items-end">
             <div>
               <p className="text-slate-400 text-sm mb-1">Percentage of subscription</p>
               <span className="text-4xl font-black text-emerald-400">{percentage}%</span>
             </div>
             <div className="text-right">
               <p className="text-slate-400 text-sm mb-1">Guaranteed Minimum</p>
               <span className="text-lg font-bold">10%</span>
             </div>
          </div>
          
          <input 
            type="range" 
            min="10" 
            max="100" 
            value={percentage} 
            onChange={(e) => setPercentage(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          
          <p className="text-sm text-slate-500">Every increase directly affects your chosen charity's monthly payout. The minimum is always 10%.</p>
        </div>
      </section>

      {/* Directory Section */}
      <section>
         <div className="flex items-center justify-between mb-6">
           <h2 className="text-xl font-bold">Select a Charity</h2>
           <button 
             onClick={handleSave} 
             disabled={loading || selectedId === initialPrefs.charity_id && percentage === initialPrefs.contribution_percentage}
             className="px-6 py-2 bg-emerald-500 text-slate-950 font-bold rounded-full hover:bg-emerald-400 transition disabled:opacity-50 flex items-center gap-2 shadow-[0_4px_14px_0_rgba(16,185,129,0.39)]"
           >
             {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Preferences'}
           </button>
         </div>
         {success && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-5 h-5" /> Impact settings updated successfully.
            </div>
         )}
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
           {charities.map(charity => (
             <div 
               key={charity.id}
               onClick={() => setSelectedId(charity.id)}
               className={`p-6 rounded-3xl border-2 transition-all cursor-pointer ${selectedId === charity.id ? 'border-emerald-500 bg-emerald-500/5 shadow-[0_0_30px_rgba(16,185,129,0.15)] scale-[1.02]' : 'border-slate-800 bg-slate-900 hover:border-slate-700'}`}
             >
                {charity.is_featured && <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded-full mb-4 uppercase tracking-wider">Featured</span>}
                <div className="h-12 w-12 bg-slate-800 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                  {charity.logo_url ? <img src={charity.logo_url} alt={charity.name} className="object-cover" /> : <Heart className="w-6 h-6 text-slate-500" />}
                </div>
                <h3 className="font-bold text-lg mb-2">{charity.name}</h3>
                <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">{charity.description}</p>
             </div>
           ))}
         </div>
      </section>
    </div>
  )
}
