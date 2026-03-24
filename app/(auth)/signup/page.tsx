import Link from 'next/link'
import AuthForm from '../auth-form'
import { HeartPulse } from 'lucide-react'

export default function SignupPage() {
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-slate-950">
      {/* Form Side */}
      <div className="flex items-center justify-center p-8 order-2 md:order-1">
        <div className="w-full max-w-md">
           <h1 className="text-3xl font-bold mb-2">Join ImpactDrive</h1>
           <p className="text-slate-400 mb-8">Start your subscription to win big and give back.</p>
           <AuthForm type="signup" />
           <p className="mt-6 text-center text-sm text-slate-400">
             Already have an account? <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">Log in</Link>
           </p>
        </div>
      </div>

      {/* Visual Side */}
      <div className="hidden md:flex flex-col justify-between bg-slate-900 p-12 border-l border-slate-800 relative overflow-hidden order-1 md:order-2">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-900 to-slate-950 z-0"></div>
        <div className="z-10 flex justify-end">
          <Link href="/" className="text-2xl font-bold flex items-center gap-2">
             <HeartPulse className="text-emerald-400" />
             <span>Impact<span className="text-emerald-400">Drive</span></span>
          </Link>
        </div>
        <div className="z-10 max-w-sm ml-auto text-right">
          <h2 className="text-4xl font-black mb-4 tracking-tight">Your game. Your impact.</h2>
          <p className="text-slate-400 text-lg leading-relaxed">Join thousands of golfers turning their weekend rounds into massive charity contributions and cash prizes.</p>
        </div>
      </div>
    </div>
  )
}
