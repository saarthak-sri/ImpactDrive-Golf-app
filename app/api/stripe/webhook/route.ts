import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { createServerClient } from '@supabase/ssr'
import { headers } from 'next/headers'
import Stripe from 'stripe'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = (await headers()).get('Stripe-Signature') as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
  
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`)
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  const supabaseAdmin = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll() { return [] }, setAll() {} } }
  )

  const session = event.data.object as any

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      const subscription = await stripe.subscriptions.retrieve(session.id) as any
      const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id
      
      // Find user by stripe_customer_id
      const { data: userData } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single()
        
      if (userData) {
        const periodEnd = (subscription as any).current_period_end
        const price = (subscription as any).items.data[0].price
        
        await supabaseAdmin.from('subscriptions').upsert({
          user_id: userData.id,
          stripe_subscription_id: subscription.id,
          plan_type: price.recurring?.interval === 'year' ? 'yearly' : 'monthly',
          status: subscription.status,
          current_period_end: new Date(periodEnd * 1000).toISOString(),
        }, { onConflict: 'stripe_subscription_id' })
      }
      break

    case 'customer.subscription.deleted':
      await supabaseAdmin.from('subscriptions')
        .update({ status: 'canceled' })
        .eq('stripe_subscription_id', session.id)
      break

    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return new NextResponse('Webhook Handled', { status: 200 })
}
