import Link from 'next/link'
import AuthForm from '../auth-form'
import { HeartPulse } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-slate-950">
      {/* Visual Side */}
      <div className="hidden md:flex flex-col justify-between bg-slate-900 p-12 border-r border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-900 to-slate-950 z-0"></div>
        <Link href="/" className="z-10 text-2xl font-bold flex items-center gap-2">
           <HeartPulse className="text-emerald-400" />
           <span>Impact<span className="text-emerald-400">Drive</span></span>
        </Link>
        <div className="z-10 max-w-sm">
          <h2 className="text-4xl font-black mb-4 tracking-tight">Welcome back.</h2>
          <p className="text-slate-400 text-lg leading-relaxed">Check your latest draw results, manage your scores, and track your charitable impact.</p>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
           <h1 className="text-3xl font-bold mb-2">Log in</h1>
           <p className="text-slate-400 mb-8">Enter your credentials to access your dashboard.</p>
           <AuthForm type="login" />
           <p className="mt-6 text-center text-sm text-slate-400">
             Don't have an account? <Link href="/signup" className="text-emerald-400 hover:text-emerald-300 font-medium">Sign up</Link>
           </p>
        </div>
      </div>
    </div>
  )
}
