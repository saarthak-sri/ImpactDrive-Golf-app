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
      <body className={cn(inter.className, "bg-slate-950 text-slate-50 min-h-screen antialiased flex flex-col selection:bg-emerald-500/30")}>
        <div className="flex-grow">
          {children}
        </div>
        <footer className="py-12 border-t border-slate-900 bg-slate-950/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 text-center space-y-2">
            <p className="text-slate-500 text-sm font-medium">
              Made with ❤️ by <span className="text-slate-300">Saarthak Srivastav</span>
            </p>
            <a 
              href="https://github.com/saarthak-sri" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block text-emerald-500/70 hover:text-emerald-400 text-xs transition-all hover:underline"
            >
              Github: https://github.com/saarthak-sri
            </a>
          </div>
        </footer>
      </body>
    </html>
  )
}
