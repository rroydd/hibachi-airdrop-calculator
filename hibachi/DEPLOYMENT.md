# Deployment Guide

## Recommended Setup

Use Vercel for hosting. You do not need to buy a separate server for this Next.js app.

Buying a domain is optional:

- Without a custom domain, the site works on a free Vercel URL like `https://your-project.vercel.app`.
- With a custom domain, the site can use a cleaner URL like `https://your-domain.com`.

## Before Deploy

Run:

```bash
npm run lint
npm run build
```

## Vercel Environment Variable

After the final public URL is known, add this variable in Vercel:

```text
NEXT_PUBLIC_SITE_URL=https://your-final-domain.com
```

Set it for Production, Preview, and Development if Vercel asks which environments should receive it.

Redeploy after changing this value so canonical URLs, Open Graph images, `robots.txt`, and `sitemap.xml` use the final domain.

## Domain DNS

If the domain is bought through Vercel, Vercel usually configures DNS automatically.

If the domain is bought elsewhere, add the domain in:

```text
Vercel Project -> Settings -> Domains
```

Then follow the exact DNS records Vercel shows.

Common records:

- Apex/root domain, such as `example.com`: `A` record to `76.76.21.21`.
- WWW subdomain, such as `www.example.com`: `CNAME` record to the Vercel value shown in the dashboard.

The final DNS values may differ, so trust Vercel's dashboard for the exact records.

## Google Indexing

After the site is live:

1. Open Google Search Console.
2. Add the final domain or URL prefix.
3. Verify ownership.
4. Submit:

```text
https://your-final-domain.com/sitemap.xml
```

5. Use URL Inspection for the homepage and request indexing.

## Post-Deploy Checks

Open these URLs:

```text
https://your-final-domain.com
https://your-final-domain.com/robots.txt
https://your-final-domain.com/sitemap.xml
```

Check that all URLs inside `robots.txt`, `sitemap.xml`, canonical tags, and social preview tags use the final domain.
