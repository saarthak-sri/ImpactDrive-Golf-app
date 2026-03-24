"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, HeartPulse, Trophy, Target } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center">
      {/* Background gradients */}
      <div className="absolute top-0 -left-1/4 w-[150%] h-[500px] bg-gradient-to-b from-emerald-500/10 to-transparent blur-3xl -z-10 rounded-full" />
      
      {/* Navigation */}
      <nav className="w-full max-w-6xl mx-auto flex items-center justify-between p-6 z-10">
        <div className="text-xl font-bold tracking-tighter flex items-center gap-2">
           <HeartPulse className="text-emerald-400" />
           <span>Impact<span className="text-emerald-400">Drive</span></span>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-4 py-2 rounded-full font-medium hover:bg-slate-800 transition">
            Log In
          </Link>
          <Link href="/signup" className="px-4 py-2 bg-emerald-500 text-slate-950 rounded-full font-semibold hover:bg-emerald-400 transition shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            Start Winning
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-6xl mx-auto flex flex-col pt-32 pb-20 px-6 z-10 text-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-sm text-emerald-400 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Next Draw: $50,000 Prize Pool
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-tight"
        >
          Play the Game. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
            Change the World.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 font-light"
        >
          The first subscription platform that turns your regular golf scores into monthly massive prize draws, while automatically funding charities you care about.
        </motion.p>

        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8, delay: 0.3 }}
           className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Link href="/signup" className="flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 text-slate-950 rounded-full font-bold text-lg hover:bg-emerald-400 hover:scale-105 transition-all shadow-[0_0_30px_rgba(16,185,129,0.4)]">
            Become a Subscriber <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="#how-it-works" className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-800/50 text-white rounded-full font-bold text-lg hover:bg-slate-800 transition-all border border-slate-700 backdrop-blur-md">
            How it works
          </Link>
        </motion.div>
      </main>

      {/* Features grid */}
      <section id="how-it-works" className="w-full max-w-6xl mx-auto px-6 py-24 pb-32">
        <div className="grid md:grid-cols-3 gap-8">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 backdrop-blur-sm"
           >
              <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Target className="text-emerald-400 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Upload Scores</h3>
              <p className="text-slate-400 leading-relaxed">Simply input your last 5 Stableford scores. We calculate your personalized algorithmic draw entries every month.</p>
           </motion.div>
           
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 backdrop-blur-sm"
           >
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Trophy className="text-blue-400 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. Win Big</h3>
              <p className="text-slate-400 leading-relaxed">Match 3, 4, or 5 numbers in our monthly verified draw. The total prize pool scales directly with our community size.</p>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className="bg-gradient-to-br from-emerald-900/40 to-slate-900/50 p-8 rounded-3xl border border-emerald-800/50 backdrop-blur-sm relative overflow-hidden"
           >
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <HeartPulse className="w-32 h-32" />
              </div>
              <div className="w-12 h-12 bg-rose-500/20 rounded-2xl flex items-center justify-center mb-6">
                <HeartPulse className="text-rose-400 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Make an Impact</h3>
              <p className="text-slate-400 leading-relaxed">A guaranteed minimum of 10% of your subscription goes directly to a charity of your choice. Real impact, every month.</p>
           </motion.div>
        </div>
      </section>

      {/* Explore Charities Section */}
      <section className="w-full bg-slate-950 py-24 border-y border-slate-800">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-3xl md:text-5xl font-bold tracking-tight mb-6 mt-8"
          >
            Empower Non-Profits
          </motion.h2>
          <motion.p 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="text-slate-400 max-w-2xl mx-auto mb-12 text-lg"
          >
            We partner with leading global charities. You have the power to direct a minimum of 10% (and up to 100%) of your subscription directly to the cause nearest to your heart.
          </motion.p>
          <div className="flex flex-wrap justify-center gap-4 opacity-70">
            {['Global Relief Fund', 'Ocean Cleanup Initiative', 'Youth Sports Foundation', 'Cancer Research Inst.', 'Local Food Banks'].map((charity, i) => (
               <span key={i} className="px-4 py-2 border border-slate-700 bg-slate-900 rounded-full text-slate-300 font-medium">
                 {charity}
               </span>
            ))}
          </div>
        </div>
      </section>

      {/* Draw Mechanics Section */}
      <section className="w-full max-w-6xl mx-auto px-6 py-24 mt-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 md:p-12 overflow-hidden relative">
           <div className="absolute -right-20 -top-20 opacity-5">
              <Trophy className="w-96 h-96 text-emerald-500" />
           </div>
           <div className="relative z-10 max-w-2xl">
             <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">The Draw Mechanics.</h2>
             <ul className="space-y-6 text-lg text-slate-400">
                <li className="flex items-start gap-4">
                   <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0 mt-1">1</div>
                   <p>Play golf and log your Stableford rounds. Our system continuously takes your <strong>last 5 unique scores</strong> to generate your 5-digit draw ticket.</p>
                </li>
                <li className="flex items-start gap-4">
                   <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0 mt-1">2</div>
                   <p>At the end of every month, our algorithmic system draws 5 winning numbers based on the total active subscriber pool.</p>
                </li>
                <li className="flex items-start gap-4">
                   <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0 mt-1">3</div>
                   <p>Match exactly 3, 4, or 5 numbers to win a proportional slice of the tier prize pools. If no one hits Match 5, the jackpot rolls over to the next month!</p>
                </li>
             </ul>
           </div>
        </div>
      </section>

      {/* CTA / Initiate Subscription */}
      <section className="w-full bg-gradient-to-b from-slate-950 to-emerald-950 py-32 text-center px-6 relative mt-12 border-t border-slate-800">
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Ready to hit the links?</h2>
          <p className="text-xl text-emerald-200/70 mb-10">Start logging your scores today, lock in your draw numbers, and begin funding world-changing charities.</p>
          <Link href="/signup" className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-emerald-500 text-slate-950 rounded-full font-black text-xl hover:bg-emerald-400 hover:scale-105 transition-all shadow-[0_0_40px_rgba(16,185,129,0.5)]">
            Activate Subscription <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>
    </div>
  )
}
