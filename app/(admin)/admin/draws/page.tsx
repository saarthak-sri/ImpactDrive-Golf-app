import { AdminDrawManager } from '@/components/admin-draw-manager'

export default function AdminDrawsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Draw Management</h1>
        <p className="text-slate-400">Run simulations of the mathematical draw logic before permanently committing the results to the database and issuing winnings.</p>
      </header>
      
      <AdminDrawManager />
    </div>
  )
}
