"use client"

import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'

export default function SubscribePage() {
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubscribe = async (priceId: string) => {
    setLoadingPriceId(priceId)
    setError(null)
    
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ priceId })
      })

      if (!res.ok) {
        throw new Error("Stripe checkout failed. Ensure your Stripe Secret Keys are configured in your environment variables.")
      }

      const { url } = await res.json()
      if (url) {
        window.location.href = url
      }
    } catch (err: any) {
      setError(err.message)
      setLoadingPriceId(null)
    }
  }

  const plans = [
    {
      name: "Impact Monthly",
      price: "$29",
      interval: "/ month",
      priceId: "price_monthly_mock_id", // Replace with real Stripe Price ID later
      description: "Join the platform, log your scores, and securely enter the automated monthly draw.",
      features: [
        "10% Minimum Charity Contribution",
        "1 Entry into Monthly Draw",
        "Unlimited Score Logging",
        "Rolling 5 Handicap Sync",
        "Member Dashboard Access"
      ],
      popular: false
    },
    {
      name: "Impact Annual",
      price: "$290",
      interval: "/ year",
      priceId: "price_yearly_mock_id", // Replace with real Stripe Price ID later
      description: "Commit to a full year of impact at a massive discount (Get 2 Months Free).",
      features: [
        "Everything in Monthly",
        "2 Months Free",
        "Priority Support Tracking",
        "Annual Charity Impact Report",
        "VIP Draw Multipliers (Coming Soon)"
      ],
      popular: true
    }
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500 pb-12 mt-8">
       <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-4xl font-black tracking-tight">Fuel your Impact.</h1>
          <p className="text-slate-400 text-lg">Choose a subscription plan to unlock full access. Remember, at least 10% of your chosen subscription goes directly to your charity.</p>
       </div>

       {error && (
         <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-500 text-center rounded-2xl max-w-2xl mx-auto">
            {error}
         </div>
       )}

       <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map(plan => (
            <div key={plan.name} className={`relative p-8 rounded-3xl border flex flex-col bg-slate-900 ${plan.popular ? 'border-emerald-500 shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]' : 'border-slate-800'}`}>
               {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-500 text-slate-950 text-sm font-bold tracking-widest uppercase rounded-full">
                     Most Popular
                  </div>
               )}
               
               <div className="mb-6 mt-4">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-slate-400 text-sm h-12">{plan.description}</p>
               </div>

               <div className="mb-8 flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white">{plan.price}</span>
                  <span className="text-slate-400 font-medium">{plan.interval}</span>
               </div>

               <div className="flex-1 space-y-4 mb-8 border-t border-slate-800 pt-8">
                 {plan.features.map(f => (
                   <div key={f} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span className="text-slate-300 font-medium">{f}</span>
                   </div>
                 ))}
               </div>

               <button 
                 onClick={() => handleSubscribe(plan.priceId)}
                 disabled={loadingPriceId !== null}
                 className={`w-full py-4 px-6 rounded-xl font-bold flex items-center justify-center transition-all ${plan.popular ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:-translate-y-1' : 'bg-slate-800 text-white hover:bg-slate-700 hover:-translate-y-1'}`}
               >
                 {loadingPriceId === plan.priceId ? <Loader2 className="w-6 h-6 animate-spin" /> : `Subscribe ${plan.interval.replace('/', '').trim()}`}
               </button>
            </div>
          ))}
       </div>
    </div>
  )
}
