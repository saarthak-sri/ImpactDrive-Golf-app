import { createServerClient } from '@supabase/ssr'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { HeartHandshake, Plus } from 'lucide-react'
import { revalidatePath } from 'next/cache'

export default async function AdminCharitiesPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, 
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
  )

  const { data: charities, error } = await supabase
    .from('charities')
    .select('*')
    .order('created_at', { ascending: false })

  async function addCharity(formData: FormData) {
    "use server"
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const logo_url = formData.get('logo_url') as string
    const website_url = formData.get('website_url') as string
    const is_featured = formData.get('is_featured') === 'on'

    const supabaseAction = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error } = await supabaseAction.from('charities').insert([{
      name, 
      description, 
      logo_url: logo_url || null, 
      website_url: website_url || null, 
      is_featured
    }])

    if (error) {
       console.error("Charity Insert Error:", error)
       throw new Error(error.message)
    }

    revalidatePath('/admin/charities')
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Charities Directory Management</h1>
        <p className="text-slate-400">Add or manage organizations users can choose to fund.</p>
      </header>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Plus className="w-5 h-5 text-emerald-400" /> New Charity Partner</h2>
        <form action={addCharity} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input type="text" name="name" required placeholder="Charity Name" className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-emerald-500" />
            <input type="url" name="website_url" placeholder="Website URL" className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-emerald-500" />
            <input type="url" name="logo_url" placeholder="Logo Image URL" className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-emerald-500 md:col-span-2" />
            <textarea name="description" required placeholder="Short description" rows={3} className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-emerald-500 md:col-span-2"></textarea>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="is_featured" id="is_featured" className="w-4 h-4 accent-emerald-500 rounded bg-slate-950 border-slate-800" />
            <label htmlFor="is_featured" className="text-sm font-medium text-amber-400">Mark as Featured</label>
          </div>
          <button type="submit" className="px-6 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl hover:bg-emerald-400 transition">Add Charity</button>
        </form>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {charities?.map(c => (
          <div key={c.id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
             {c.is_featured && <span className="inline-block px-2 py-1 bg-amber-500/10 text-amber-400 text-xs font-bold rounded mb-3 uppercase tracking-wider">Featured</span>}
             <h3 className="font-bold text-lg">{c.name}</h3>
             <a href={c.website_url} target="_blank" className="text-sm text-emerald-400 hover:text-emerald-300 block mb-2">{c.website_url}</a>
             <p className="text-slate-400 text-sm line-clamp-3">{c.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
