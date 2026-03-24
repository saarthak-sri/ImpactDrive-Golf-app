"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HeartPulse, LayoutDashboard, Trophy, Target, Heart, UserCircle, LogOut, ShieldAlert } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    async function checkRole() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()
        
        if (data?.role === 'admin') {
          setIsAdmin(true)
        }
      }
    }
    checkRole()
  }, [supabase])

  const handleSignout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const links = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/scores', label: 'My Scores', icon: Target },
    { href: '/dashboard/draws', label: 'Draw Results', icon: Trophy },
    { href: '/dashboard/charity', label: 'My Impact', icon: Heart },
  ]

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 p-6 space-y-8">
        <Link href="/dashboard" className="text-xl font-bold flex items-center gap-2">
           <HeartPulse className="text-emerald-400" />
           <span>Impact<span className="text-emerald-400">Drive</span></span>
        </Link>

        <nav className="flex-1 space-y-2">
          {links.map(link => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            )
          })}

          {isAdmin && (
            <Link 
              href="/admin/draws"
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 mt-4"
            >
              <ShieldAlert className="w-5 h-5" />
              Admin Panel
            </Link>
          )}
        </nav>

        <div className="space-y-2 pt-8 border-t border-slate-800">
           <Link href="/dashboard/account" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium w-full text-slate-400 hover:text-slate-200 hover:bg-slate-800">
              <UserCircle className="w-5 h-5" /> Account
           </Link>
           <button onClick={handleSignout} className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
              <LogOut className="w-5 h-5" /> Sign Out
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
          <Link href="/dashboard" className="text-xl font-bold flex items-center gap-2">
            <HeartPulse className="text-emerald-400 w-6 h-6" />
          </Link>
          <div className="flex items-center gap-2">
             {isAdmin && (
               <Link href="/admin/draws" className="p-2 text-rose-400 hover:text-rose-300 transition-colors">
                 <ShieldAlert className="w-6 h-6" />
               </Link>
             )}
             <Link href="/dashboard/account" className="p-2 text-slate-400 hover:text-emerald-400 transition-colors">
               <UserCircle className="w-6 h-6" />
             </Link>
          </div>
        </div>
        
        <div className="p-4 md:p-8 max-w-6xl mx-auto pb-24 md:pb-8">
          {children}
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex justify-around items-center px-2 py-3 z-50 pb-safe">
          {links.map(link => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`flex flex-col items-center gap-1 flex-1 transition-all ${isActive ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Icon className="w-6 h-6 mb-0.5" />
                <span className="text-[10px] font-medium leading-none line-clamp-1">{link.label}</span>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}
