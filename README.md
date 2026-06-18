# Stack'd Totes — Booking Website

Eco-friendly moving-tote rental site with online reservations, an availability
calendar, email notifications, and an admin dashboard.

Built with **Next.js 16 (App Router) + Supabase + Tailwind v4 + TypeScript** —
the same stack as the commission-tracker project.

---

## What's included

| Page | Path | Notes |
|------|------|-------|
| Landing | `/` | Hero, value props, how-it-works, mission, founder, pricing preview |
| Pricing | `/pricing` | Package cards + FAQ |
| Booking | `/order` | Pick package + delivery/pickup dates (calendar hides taken/blocked days) |
| Confirmation | `/order/success` | Shown after a successful reservation |
| Admin login | `/admin/login` | Password gate |
| Admin dashboard | `/admin` | Calendar to block dates + bookings table with status |

When someone books, you get an **email notification** and the customer gets a
**confirmation email**. Bookings appear instantly in the admin dashboard.

> The site runs right now in **demo mode** (calendar works, design is live).
> Bookings can't be saved until you connect Supabase + Resend below.

---

## Go-live checklist (~10 minutes)

### 1. Supabase (database) — free
1. Create a project at https://supabase.com.
2. **SQL Editor → New query** → paste the contents of [`supabase/schema.sql`](supabase/schema.sql) → **Run**.
3. **Project Settings → API** → copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `service_role` secret key → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Resend (email notifications) — free
1. Create an account at https://resend.com.
2. **API Keys → Create** → copy into `RESEND_API_KEY`.
3. Set `OWNER_EMAIL` to where you want new-order alerts.
4. (Optional but recommended) verify your domain in Resend, then set
   `EMAIL_FROM` to e.g. `Stack'd Totes <hello@yourdomain.com>`.

### 3. Stripe (online card payment) — optional but ready to go
The booking flow defaults to **pay-on-delivery**. To collect card payment online
via Stripe Checkout instead:

1. Create an account at https://stripe.com.
2. **Developers → API keys** → copy the **Secret key** into `STRIPE_SECRET_KEY`.
3. Add a webhook so paid bookings get confirmed automatically:
   - **Developers → Webhooks → Add endpoint**
   - URL: `https://YOUR_DOMAIN/api/stripe/webhook`
   - Events: `checkout.session.completed` and `checkout.session.expired`
   - Copy the **Signing secret** into `STRIPE_WEBHOOK_SECRET`.
4. Set `NEXT_PUBLIC_STRIPE_ENABLED=true` to flip the checkout button to "pay now".

**Testing locally:** install the [Stripe CLI](https://stripe.com/docs/stripe-cli)
and run `stripe listen --forward-to localhost:3000/api/stripe/webhook` — it prints
a signing secret to use for `STRIPE_WEBHOOK_SECRET`. Use test card `4242 4242 4242 4242`.

How it works: on submit we create a `pending`/unpaid order, send the customer to
Stripe Checkout, and the webhook marks it **paid + confirmed** and fires the
notification emails. Abandoned/expired checkouts auto-cancel so the dates free up.

### 4. Fill in `.env.local`
Open `.env.local` and replace the placeholder values. Also set:
- `ADMIN_PASSWORD` — what you type to log into `/admin`
- `ADMIN_SECRET` — any long random string

### 5. Run it
```bash
npm run dev
```
Visit http://localhost:3000 and http://localhost:3000/admin

---

## Things to customize

- **Prices & packages:** [`lib/packages.ts`](lib/packages.ts)
- **Service area counties:** `SERVICE_AREA` in [`lib/packages.ts`](lib/packages.ts)
- **Founder photo & story:** the `#founder` section in [`app/page.tsx`](app/page.tsx) (marked with `TODO`)
- **Brand colors:** `--brand-*` vars in [`app/globals.css`](app/globals.css)

## Deploy (Vercel)
1. Push this folder to a GitHub repo.
2. Import it at https://vercel.com → add the same environment variables.
3. Set `NEXT_PUBLIC_SITE_URL` to your live domain.

## Notes
- Availability model: one set of totes (one concurrent rental). A date is
  unavailable if it's owner-blocked or inside an active reservation's range.
  Adjust in `app/api/availability/route.ts` if you carry more inventory.
- Payment: **pay-on-delivery** by default; flip `NEXT_PUBLIC_STRIPE_ENABLED=true`
  (plus the Stripe keys) to collect card payment online via Stripe Checkout.
