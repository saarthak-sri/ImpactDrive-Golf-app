"use client"

import { useState } from 'react'
import { Play, UploadCloud, Loader2, RefreshCw } from 'lucide-react'
import { SimulationResult } from '@/lib/draw-algorithm'

export function AdminDrawManager() {
  const [loadingSim, setLoadingSim] = useState(false)
  const [loadingPub, setLoadingPub] = useState(false)
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSimulate = async () => {
    setLoadingSim(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/admin/draw/simulate', { method: 'POST' })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoadingSim(false)
    }
  }

  const handlePublish = async () => {
    if (!confirm('Are you sure? This will finalize the draw and assign winnings.')) return
    
    setLoadingPub(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/draw/publish', { method: 'POST' })
      if (!res.ok) throw new Error(await res.text())
      alert('Draw successfully published!')
      setResult(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoadingPub(false)
    }
  }

  return (
    <div className="space-y-8">
       {error && <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-500 rounded-2xl">{error}</div>}

       <div className="flex gap-4">
         <button 
           onClick={handleSimulate} 
           disabled={loadingSim || loadingPub}
           className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition"
         >
           {loadingSim ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
           Run Simulation
         </button>
         <button 
           onClick={handlePublish} 
           disabled={loadingSim || loadingPub || !result} 
           className="flex items-center gap-2 px-6 py-3 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
         >
           {loadingPub ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
           Publish Results To Database
         </button>
       </div>

       {result && (
         <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-8">
           <h3 className="text-xl font-bold border-b border-slate-800 pb-4">Simulation Results</h3>
           
           <div className="grid md:grid-cols-3 gap-6">
             <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
               <p className="text-slate-400 text-sm mb-1">Total Prize Pool</p>
               <p className="text-3xl font-black">${result.totalPrizePool.toLocaleString()}</p>
             </div>
             <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
               <p className="text-slate-400 text-sm mb-1">Winning Numbers</p>
               <p className="text-2xl font-bold tracking-widest text-emerald-400">{result.winningNumbers.join(', ')}</p>
             </div>
             <div className="bg-slate-950 p-6 rounded-2xl border border-rose-500/30">
               <p className="text-rose-400 text-sm mb-1 font-bold">Jackpot Rollover (If No T5)</p>
               <p className="text-3xl font-black text-rose-500">${result.rollover.toLocaleString()}</p>
             </div>
           </div>

           <div>
              <h4 className="font-bold mb-4">Tier Breakdown</h4>
              <div className="space-y-3">
                 <div className="flex justify-between p-4 bg-slate-950 rounded-xl border border-emerald-500/20">
                   <span className="font-bold text-emerald-400">Match 5 (40%)</span>
                   <span>{result.tierBreakdown.matches5.count} winners</span>
                   <span className="font-mono">${result.tierBreakdown.matches5.amountPerWinner.toLocaleString()} /ea</span>
                 </div>
                 <div className="flex justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
                   <span className="font-bold text-slate-300">Match 4 (35%)</span>
                   <span>{result.tierBreakdown.matches4.count} winners</span>
                   <span className="font-mono">${result.tierBreakdown.matches4.amountPerWinner.toLocaleString()} /ea</span>
                 </div>
                 <div className="flex justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
                   <span className="font-bold text-slate-300">Match 3 (25%)</span>
                   <span>{result.tierBreakdown.matches3.count} winners</span>
                   <span className="font-mono">${result.tierBreakdown.matches3.amountPerWinner.toLocaleString()} /ea</span>
                 </div>
              </div>
           </div>
         </div>
       )}
    </div>
  )
}
