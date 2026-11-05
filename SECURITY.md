# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |

## Reporting a Vulnerability

Please report security vulnerabilities privately by emailing **security@teamcoco.app** (or create a private GitHub Security Advisory).

Do **not** open public issues for security vulnerabilities.

We will acknowledge receipt within 48 hours and provide a timeline for fix.

## Security Features

- **No user data stored** - No database, no authentication, no PII
- **API keys in secrets** - All external API keys stored in Cloudflare Worker secrets
- **Restrictive CORS** - Configure `ALLOWED_ORIGIN` secret for your domain
- **CSP headers** - Workers return `Content-Security-Policy: default-src 'none'; frame-ancestors 'none';`
- **No inline scripts** - All JS loaded via modules
- **HTTPS only** - Enforced by Cloudflare

## Deployment Security Checklist

- [ ] Set `TICKETMASTER_API_KEY` as Worker secret
- [ ] Set `ALLOWED_ORIGIN` as Worker secret to your domain
- [ ] Enable Cloudflare WAF (free tier)
- [ ] Configure rate limiting via Cloudflare
- [ ] Use custom domain with Cloudflare Pages
- [ ] Enable Cloudflare Bot Fight Mode

## Known Limitations

- Client-side caching uses localStorage (not encrypted)
- No rate limiting at Worker level (rely on Cloudflare)
- CORS defaults to `*` if `ALLOWED_ORIGIN` not set