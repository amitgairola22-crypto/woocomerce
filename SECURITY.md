# Security

## Authentication & Authorization

### Session Management
- NextAuth.js v5 with JWT strategy
- JWT secret: `NEXTAUTH_SECRET` (minimum 32 characters, random)
- Session expires: 30 days (default)
- HttpOnly cookies — not accessible from JavaScript

### Password Storage
- Hashed with `bcryptjs`, salt rounds = 12
- Minimum password length enforced (8 characters) via Zod
- Never logged or returned in API responses

### Role-Based Access Control

Every admin API route handler:
```typescript
const session = await auth();
if (!session?.user || !['admin', 'manager'].includes(session.user.role)) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

### Route Protection
- Admin pages: middleware redirects to `/login` if no valid session
- Customer pages: redirect to `/login` if not authenticated
- API routes: return 401/403 for unauthorized requests

## Input Validation

All API endpoints validate inputs with Zod:
```typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});
const result = schema.safeParse(await request.json());
if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 });
```

## Payment Security

- Card data **never touches our server** — handled entirely by Stripe Elements
- Payment is confirmed via Stripe webhooks, not client redirect
- Webhook signature verified: `stripe.webhooks.constructEvent(body, sig, secret)`
- Stripe secret key only used server-side (never in client bundles)
- `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` — only the public key is exposed to the browser

## File Upload Security

Upload endpoint validates:
- MIME type must start with `image/`
- Maximum file size: 5MB
- Filename sanitized (UUID, no user-supplied filenames)
- Stored outside web root in production (use object storage)

## SQL Injection

- All database queries go through Prisma's parameterized query builder
- Raw SQL (`$queryRaw`) never used with user input
- No string concatenation into SQL

## XSS Prevention

- React escapes all rendered values by default
- `dangerouslySetInnerHTML` only used for sanitized product description HTML
- Sanitize HTML from admin rich-text editor before storing (use DOMPurify server-side)

## CSRF

- NextAuth handles CSRF token for auth form submissions
- API route handlers that mutate state require session (not just cookie presence)
- SameSite cookie attribute set by NextAuth

## Rate Limiting

Planned for sensitive endpoints:
- `/api/auth/signin` — 5 attempts per 15 minutes per IP
- `/api/checkout/*` — 10 requests per minute per user
- `/api/coupons/validate` — 20 requests per minute per user

Implementation: use `upstash/ratelimit` with Redis, or a simple in-memory store for dev.

## Security Headers

Configure in `next.config.ts`:
```typescript
headers: [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]
```

## Environment Variables

- Never commit `.env` to git (`.gitignore` excludes it)
- Rotate `NEXTAUTH_SECRET` and Stripe keys if exposed
- Use separate Stripe test keys for development
- In production, use the platform's secret management (Cloudflare Pages → Settings → Environment variables)

## Dependency Security

- Run `npm audit` regularly
- Keep dependencies updated, especially `next`, `next-auth`, `stripe`
- Review `npm audit fix` output before applying automatically

## Checklist Before Production

- [ ] Change `NEXTAUTH_SECRET` to a strong random value
- [ ] Switch Stripe keys to live mode
- [ ] Set `NEXTAUTH_URL` to production domain
- [ ] Enable HTTPS
- [ ] Set security headers in `next.config.ts`
- [ ] Set up rate limiting on auth/checkout endpoints
- [ ] Move file uploads to object storage (S3/Cloudinary)
- [ ] Set up monitoring/alerting
- [ ] Run `npm audit` and fix critical/high vulnerabilities
- [ ] Change default admin password
