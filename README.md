# ImpactDrive - Golf Charity Subscription Platform ⛳️

ImpactDrive is a next-generation subscription platform bridging the gap between the game of golf, high-stakes monthly prize draws, and global charitable impact. 

By combining automated algorithmic mathematics, secure Stripe subscriptions, and a modern Framer Motion-powered interface, members log their everyday Stableford golf rounds to earn unique entry numbers. Every month, the system proportionally calculates active subscriptions, designates a massive multi-tier prize pool, guarantees at least 10% direct donation to user-selected charities, and securely matches users' aggregated scores against the official draw numbers. 

## 🛠 Tech Stack
- **Frontend Core:** Next.js 16 (App Router), React, TypeScript
- **Styling & UX:** Tailwind CSS, Framer Motion, Lucide React Icons
- **Database & Auth:** Supabase (PostgreSQL, Row Level Security, SSR Middleware), Google OAuth Integration
- **Billing & Subscriptions:** Stripe Checkout Sessions & Webhooks

## 🚀 Key Features
- **Algorithmic Draw Engine:** Dynamically calculates Tiers (3, 4, 5 matches) and physically rolls over Jackpots mathematically based on the active user subscription density.
- **Score Parsing Constraints:** Users can infinitely submit scores, but a Rolling-5 constraint permanently drops the oldest score, maintaining a hyper-efficient strict subset of 5 numbers per user on the backend.
- **Charitable Redirection:** Custom built directory interface empowering users to dynamically scale up their individual monthly charity contribution percentage safely above the 10% floor constraint.
- **Robust Admin Suite:** SSR middleware-gated dashboard enabling administrators to simulate live draws, manage charity endpoints, and approve proof-of-winnings via image uploads completely securely (bypassing normal RLS).

---

## 💻 Local Development Instructions

### 1. Prerequisites
To run the platform locally, you must have Node.js installed, as well as an active Supabase and Stripe project.

### 2. Environment Setup
Configure your `.env.local` file with the following required backbone keys:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
# Critical: Use the Service Role Key safely generated from the Supabase API settings for Admin DB overrides.
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret

NEXT_PUBLIC_APP_URL=http://localhost:3000
```
> **OAuth Note:** Google Authentication is fully integrated natively. To enable "Continue with Google", add your Supabase Callback URI (`https://<project-id>.supabase.co/auth/v1/callback`) to your Google Cloud Console Web App OAuth settings, and subsequently paste the generated Client ID & Secret into your Supabase Dashboard's Provider menu.

### 3. Database Initialization
Simply copy the entirety of `supabase/schema.sql` and run it in your Supabase SQL Editor. This will instantly build the unified schema hierarchy, complex user-sync triggers, and standard Row Level Security (RLS) policies.

### 4. Booting the Server
```bash
npm install
npm run dev
```
### 5. Troubleshooting OAuth Redirects
If you are redirected to `localhost:3000` after a Google Login on Vercel:
1. Go to your **Supabase Dashboard** -> **Authentication** -> **URL Configuration**.
2. Set your **Site URL** to your Vercel production URL (e.g., `https://impactdrive.vercel.app`).
3. Add `https://impactdrive.vercel.app/**` to the **Redirect URIs** list.
4. Save the changes. Supabase will now correctly resolve the `/auth/callback` on your production domain.

---

## 🧪 Demo Credentials

If you are evaluating or examining this build, you can use the pre-configured mock accounts below to rapidly bypass setup and explore advanced feature states:

### 1. The Administrator View
To test Draw Algorithmic Simulations, view all global users simultaneously, manage the active Charity directory, and approve pending winner proof-images:
- **Email:** `admin1@gmail.com`
- **Password:** `admin123`

*(Note: Once logged in, use the `Account` button or navigate manually to `http://localhost:3000/admin` to access the protected layout).*

### 2. Winnings / Dashboard State
To view a standard user dashboard populated with successfully logged Rolling-5 scores, an active subscription state, and active algorithmic winnings populated on the Draw Results screen:
- **Email:** `saltandwater21@gmail.com`
- **Password:** `flayed`
