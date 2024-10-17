## Next.js 14 Starter Kit

This comprehensive Next.js 14 starter kit provides a robust foundation for rapidly building and deploying your SaaS application. It empowers you to concentrate on your core business logic while leveraging industry-leading technologies.

### Inputs

- **Environment Variables:**
  - `SUPABASE_URL`: URL of your Supabase project
  - `SUPABASE_SERVICE_KEY`: Service key for your Supabase project
  - `STRIPE_SECRET_KEY`: Secret key for your Stripe account (if using payments)
  - `NEXT_PUBLIC_STRIPE_PRICE_ID`: Stripe price ID for your subscription plan (if using payments)
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Publishable key for your Clerk account (if using authentication)
  - `CLERK_SECRET_KEY`: Secret key for your Clerk account (if using authentication)
  - `NEXT_PUBLIC_CLERK_SIGN_IN_URL`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL`, `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`, `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`: URLs for Clerk authentication flow (if using authentication)
- **Configuration (`config.ts`):**
  - `auth.enabled`: Enable or disable Clerk authentication
  - `payments.enabled`: Enable or disable Stripe payments

### Outputs

- **Fully functional Next.js 14 application** with:
  - Pre-configured authentication (Clerk)
  - Integrated payments (Stripe)
  - Tailwind CSS for styling
  - Shadcn UI for pre-built components
  - Tanstack Query for data fetching and caching
  - Upstash (Redis) for rate-limiting
  - Prisma ORM for database interactions
  - Supabase for database and authentication
- **Landing Page:** Includes a visually appealing hero section, featured song/album/video sections, and sample blog cards.
- **Dashboard:** (Located at `/dashboard`) Provides a user interface for managing your application's data and functionality.
- **Documentation:** This README.md file outlines the setup process, configuration options, and additional resources.

### How to Use

1. **Clone the repository:** `git clone <repository-url> && cd <project-directory>`
2. **Install dependencies:** `yarn`
3. **Set up environment variables:** Create a `.env` file in the root directory with the required variables (see Inputs).
4. **Configure features:** Modify `config.ts` to enable or disable authentication and payments.
5. **Set up the database:** Run Prisma migrations: `npx prisma migrate dev`
6. **Start the development server:** `yarn dev`
7. **Access your application:** Open `http://localhost:3000` in your browser.

### Additional Configuration

- **Webhooks:** Configure webhooks for Clerk (authentication) at `/api/auth/webhook` and Stripe (payments) at `/api/payments/webhook`.
- **Customization:** Tailor the landing page, dashboard, and other components to meet your specific requirements.
- **Database:** Adjust the Prisma schema in `prisma/schema.prisma` to modify the database structure.

### Security Notes

- **Row Level Security (RLS):** Implement RLS in your Supabase project to protect data at the database level.
- **Server-side Supabase Calls:** Perform Supabase calls within API routes or server components to safeguard your service key.

### Further Learning

- **Next.js Documentation:** https://nextjs.org/docs
- **Tailwind CSS Documentation:** https://tailwindcss.com/docs
- **Supabase Documentation:** https://supabase.io/docs
- **Prisma Documentation:** https://www.prisma.io/docs
- **Clerk Documentation:** https://clerk.dev/docs (if using authentication)
- **Stripe Documentation:** https://stripe.com/docs (if using payments)
