import Stripe from 'stripe'

const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_building_dummy_key'

export const stripe = new Stripe(stripeKey, {
  apiVersion: '2026-02-25.clover', // Latest stable API version or specific
  appInfo: {
    name: 'ImpactDrive',
    version: '0.1.0'
  }
})
