"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlusCircle, Loader2 } from 'lucide-react'

export function ScoreEntry() {
  const [score, setScore] = useState<number | ''>('')
  const [playedDate, setPlayedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (score === '' || score < 1 || score > 45) {
      setError('Stableford score must be between 1 and 45')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: Number(score), played_date: playedDate })
      })

      if (!res.ok) {
        throw new Error(await res.text())
      }

      setScore('')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
      <h3 className="font-bold text-lg mb-2">Log New Round</h3>
      {error && (
        <div className="p-3 bg-red-500/10 text-red-400 text-sm rounded-xl border border-red-500/20">
          {error}
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-slate-400">Stableford Score (1-45)</label>
          <input 
            type="number" 
            min="1" 
            max="45"
            value={score}
            onChange={(e) => setScore(e.target.value ? Number(e.target.value) : '')}
            required
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="e.g. 36"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-slate-400">Date Played</label>
          <input 
            type="date"
            value={playedDate}
            onChange={(e) => setPlayedDate(e.target.value)}
            required
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-white [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
          />
        </div>
      </div>
      <button 
        type="submit" 
        disabled={loading}
        className="w-full py-3 px-4 bg-emerald-500 text-slate-950 font-bold rounded-xl hover:bg-emerald-400 transition flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><PlusCircle className="w-5 h-5" /> Submit Score</>}
      </button>
      <p className="text-xs text-slate-500 text-center mt-4">
        Remember: Only your 5 most recent scores are kept active for the algorithmic draw.
      </p>
    </form>
  )
}
