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
| `DATABASE_URL` | Yes | SQLite: `file:./dev.db` / PostgreSQL: `postgresql://...` |
| `NEXTAUTH_URL` | Yes | Full URL of the app (e.g. `https://store.com`) |
| `NEXTAUTH_SECRET` | Yes | Random 32+ char string |
| `STRIPE_PUBLIC_KEY` | Yes | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook signing secret |
| `NEXT_PUBLIC_APP_URL` | Yes | Same as NEXTAUTH_URL |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | Yes | Same as STRIPE_PUBLIC_KEY |

## Production on Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourname/store.git
git push -u origin main
```

### 2. Create Vercel Project

1. Import from GitHub on vercel.com
2. Add all environment variables from `.env`
3. Set `DATABASE_URL` to your PostgreSQL connection string

### 3. Database (PostgreSQL)

Options:
- **Supabase** (free tier) — `postgresql://...supabase.co:5432/postgres`
- **PlanetScale** — MySQL-compatible, Prisma supported
- **Neon** — serverless PostgreSQL, Vercel integration available
- **Railway** — simple, affordable

```bash
# Update prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

# Run migration
npx prisma migrate deploy
```

### 4. Stripe Webhooks

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
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint check
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
