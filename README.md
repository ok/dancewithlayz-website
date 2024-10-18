## Dancewithlayz Website Code Overview

This codebase represents the website for the artist Lay'z, an A.I.A. (Artificial Intelligence Artist). The website showcases Lay'z's music, albums, and videos, and allows fans to connect with the artist on social media.

### Inputs

The website requires the following inputs to be set up:

- **Environment variables:**
    - `SUPABASE_URL`: Your Supabase project URL.
    - `SUPABASE_SERVICE_KEY`: Your Supabase service key.
    - `STRIPE_SECRET_KEY` (optional): Your Stripe secret key (if using payments).
    - `NEXT_PUBLIC_STRIPE_PRICE_ID` (optional): Your Stripe price ID (if using payments).
    - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (optional): Your Clerk publishable key (if using authentication).
    - `CLERK_SECRET_KEY` (optional): Your Clerk secret key (if using authentication).
    - Other Clerk-related environment variables (optional): See [Clerk Documentation](https://clerk.dev/docs) for details.
- **Configuration:**
    - In `config.ts`, set `auth.enabled` to `true` if using Clerk authentication and `payments.enabled` to `true` if using Stripe payments.

### Outputs

The website provides the following outputs:

- **Landing page:**
    - Displays Lay'z's artist image and bio.
    - Showcases featured songs, albums, and videos.
- **Navigation menu:**
    - Allows users to navigate to different sections of the website.
- **Social media links:**
    - Connects users to Lay'z's social media profiles.
- **Footer:**
    - Contains copyright information and links to legal pages (terms & conditions, privacy policy).

### Usage

To use the website, follow these steps:

1. Clone the repository.
2. Install dependencies using `yarn`.
3. Set up environment variables in a `.env` file.
4. Configure features in `config.ts`.
5. Run Prisma migrations using `npx prisma migrate dev`.
6. Start the development server using `yarn dev`.
7. Open your browser and navigate to `http://localhost:3000`.

### Important Notes

- The website uses a variety of technologies, including Next.js, Tailwind CSS, Supabase, Prisma, and potentially Clerk and Stripe. Refer to their respective documentation for more information.
- Ensure data protection by enabling Row Level Security (RLS) in your Supabase project and making Supabase calls only on the server-side.
