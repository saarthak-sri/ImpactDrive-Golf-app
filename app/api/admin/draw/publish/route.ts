import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { runDrawLogic } from '@/lib/draw-algorithm'

export async function POST() {
  try {
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Admin validation via JWT claim or DB lookup is required here in production

    const result = await runDrawLogic(supabaseAdmin, false) // false = Publish mode
    return NextResponse.json(result)
  } catch (error) {
    console.error('Publish error:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
