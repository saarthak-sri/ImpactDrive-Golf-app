import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils' // Assuming default path aliasing

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ImpactDrive | Play the Game, Change the World',
  description: 'The first subscription platform that turns your regular golf scores into monthly massive prize draws, while funding charities.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.className, "bg-slate-950 text-slate-50 min-h-screen antialiased selection:bg-emerald-500/30")}>
        {children}
      </body>
    </html>
  )
}
