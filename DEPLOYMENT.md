# Deployment

## Development

```bash
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

App runs at: http://localhost:3000
Prisma Studio: `npx prisma studio` → http://localhost:5555

## Environment Variables

Copy `.env.example` to `.env` and fill in values:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Neon PostgreSQL with pgbouncer: `postgresql://...?pgbouncer=true` |
| `DIRECT_URL` | Yes | Neon direct connection (no pgbouncer, used for migrations) |
| `NEXTAUTH_URL` | Yes | Full URL of the app (e.g. `https://store.com`) |
| `NEXTAUTH_SECRET` | Yes | Random 32+ char string |
| `STRIPE_PUBLIC_KEY` | Yes | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook signing secret |
| `NEXT_PUBLIC_APP_URL` | Yes | Same as NEXTAUTH_URL |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | Yes | Same as STRIPE_PUBLIC_KEY |

## Production on Cloudflare Pages

### 1. Push to GitHub

```bash
git add .
git commit -m "feat: ready for deployment"
git push -u origin main
```

### 2. Deploy with OpenNext

```bash
npm run deploy    # builds and deploys to Cloudflare Pages
npm run preview   # local Cloudflare edge preview
```

Or set up automatic deployments via the Cloudflare Pages dashboard by linking your GitHub repo.

### 3. Set Environment Variables

In the Cloudflare Pages dashboard → Settings → Environment variables, add all variables from `.env`:
- `DATABASE_URL` (Neon pgbouncer URL)
- `DIRECT_URL` (Neon direct URL)
- `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
- `STRIPE_PUBLIC_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`

### 4. Apply Database Migrations

```bash
npx prisma migrate deploy
```

### 5. Stripe Webhooks

1. In Stripe Dashboard → Webhooks → Add endpoint
2. URL: `https://your-domain.com/api/webhooks/stripe`
3. Events to listen: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy the signing secret to `STRIPE_WEBHOOK_SECRET`

### 5. File Uploads in Production

For production, replace local file storage with:

**Cloudinary (recommended):**
```bash
npm install cloudinary
```
Add to `.env`:
```
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

**AWS S3:**
```bash
npm install @aws-sdk/client-s3
```

### 6. Post-Deploy Checklist

- [ ] Run `npx prisma migrate deploy` on production DB
- [ ] Run seed if needed: `npx prisma db seed`
- [ ] Verify Stripe webhook is receiving events
- [ ] Test full checkout flow with Stripe test card `4242 4242 4242 4242`
- [ ] Test admin login at `/admin`
- [ ] Check image uploads work
- [ ] Verify all env variables are set

## Build Commands

```bash
npm run build      # Production Next.js build
npm run start      # Start production server (Node)
npm run lint       # ESLint check
npm run deploy     # Build + deploy to Cloudflare Pages
npm run preview    # Build + preview on local Cloudflare edge
```

## Docker (Optional)

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:password@db:5432/store
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: store
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```
