import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(req: Request) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const { data, error } = await supabase
    .from('user_charity_preferences')
    .select('*, charity:charities(*)')
    .eq('user_id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') { // Ignore row not found
    return new NextResponse(error.message, { status: 400 })
  }
  
  return NextResponse.json(data || { contribution_percentage: 10, charity_id: null })
}

export async function POST(req: Request) {
  try {
    const { charity_id, contribution_percentage } = await req.json()
    
    if (contribution_percentage < 10 || contribution_percentage > 100) {
      return new NextResponse('Contribution percentage must be between 10% and 100%', { status: 400 })
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return new NextResponse('Unauthorized', { status: 401 })

    const { error } = await supabase
      .from('user_charity_preferences')
      .upsert({ user_id: user.id, charity_id, contribution_percentage })

    if (error) return new NextResponse(error.message, { status: 400 })
    return new NextResponse('OK', { status: 200 })
    
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 })
  }
}
