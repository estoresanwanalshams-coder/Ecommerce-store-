# Ecommerce-store-

Next.js ecommerce storefront for general GCC products with Supabase-backed product, category, and homepage settings management.

## Setup

```bash
npm install
npm run dev
```

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
NEXT_PUBLIC_ADMIN_EMAIL=your-admin-auth-email
```

## Supabase

Run `supabase/schema.sql` in Supabase SQL Editor before using the admin panel.
