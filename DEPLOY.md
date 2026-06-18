# Deploying Stack'd Totes (with your GoDaddy domain)

## ⚠️ Important: this app can't be "uploaded" to GoDaddy hosting

Stack'd Totes is a **Next.js app with a live server** — it runs server code for
online booking, Stripe payments/webhooks, the database, email, and the admin
login. GoDaddy's standard **shared/cPanel hosting and the Website Builder are
static/PHP only** and cannot run a Node.js/Next.js server. So you don't upload
files to GoDaddy like an HTML site.

**The right setup (and it's free):**

> Host the app on **Vercel** (made by the creators of Next.js), then **point your
> GoDaddy domain at it**. GoDaddy stays your domain registrar — only the DNS
> records change.

This is the standard, supported way to run a Next.js site on a custom domain.

---

## Step 1 — Put the code on GitHub
Vercel deploys straight from a GitHub repo.

```bash
cd stackd-totes
git init
git add .
git commit -m "Stack'd Totes site"
```
Create an empty repo at github.com, then:
```bash
git remote add origin https://github.com/<you>/stackd-totes.git
git branch -M main
git push -u origin main
```
> `.gitignore` already excludes `node_modules`, `.next`, and your `.env.local`,
> so secrets are never pushed.

## Step 2 — Deploy on Vercel
1. Sign up at https://vercel.com with your GitHub account (free).
2. **Add New → Project → import `stackd-totes`.** It auto-detects Next.js.
3. Under **Environment Variables**, add everything from your `.env.local`
   (Supabase, Resend, Stripe, `ADMIN_PASSWORD`, `ADMIN_SECRET`). Set
   `NEXT_PUBLIC_SITE_URL` to your real domain (e.g. `https://stackdtotes.com`).
4. **Deploy.** You'll get a live `*.vercel.app` URL in ~1 minute.

## Step 3 — Connect your GoDaddy domain
1. In Vercel: **Project → Settings → Domains → Add** your domain (e.g.
   `stackdtotes.com`). Vercel shows the exact DNS records to create.
2. Log into **GoDaddy → your domain → DNS → Manage DNS**, and set:
   - **A record** — Host `@` → value Vercel gives you (currently `76.76.21.21`).
   - **CNAME** — Host `www` → `cname.vercel-dns.com`.
   (Always use the exact values shown in *your* Vercel dashboard.)
3. Save. DNS usually propagates in minutes (up to a few hours). Vercel
   auto-issues a free SSL certificate, so `https://` just works.

## Step 4 — Point Stripe + Resend at the live domain
- **Stripe webhook:** update (or create) the endpoint URL to
  `https://yourdomain.com/api/stripe/webhook` and copy the new signing secret
  into Vercel's `STRIPE_WEBHOOK_SECRET`.
- **Resend:** verify your domain so confirmation emails send from
  `you@yourdomain.com` instead of the test sender.

---

## Alternatives to Vercel
Any Node host works the same way (deploy there, point GoDaddy DNS at it):
**Netlify**, **Render**, **Railway**, or a GoDaddy **VPS** (advanced — you'd
manage Node/PM2/Nginx yourself). For a small business site, Vercel's free tier
is by far the simplest.

## Updating the site later
With GitHub + Vercel connected, every `git push` auto-deploys. No re-uploading.
