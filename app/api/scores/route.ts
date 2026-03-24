import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    const { score, played_date } = await req.json()
    
    if (score < 1 || score > 45) {
      return new NextResponse('Score must be between 1 and 45', { status: 400 })
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return new NextResponse('Unauthorized', { status: 401 })

    // Fetch existing scores
    const { data: scores } = await supabase
      .from('scores')
      .select('id, played_date')
      .eq('user_id', user.id)
      .order('played_date', { ascending: true })

    // Rolling 5 limitation logic
    if (scores && scores.length >= 5) {
      // The oldest one is at index 0 because ascending order
      await supabase.from('scores').delete().eq('id', scores[0].id)
    }

    const { data, error } = await supabase
      .from('scores')
      .insert([{ user_id: user.id, score, played_date }])
      .select()

    if (error) return new NextResponse(error.message, { status: 400 })
    return NextResponse.json(data[0])
    
  } catch (error) {
    console.error('Score Insert API Error:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
