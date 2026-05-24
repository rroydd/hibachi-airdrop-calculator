# Airdrop Tools Service

Monorepo for airdrop calculators, checkers, and project-specific tools.

## Apps

- `portal` - the future main hub page for all tools.
- `hibachi` - Hibachi airdrop calculator.
- `nado` - Nado airdrop calculator.

## Local Development

```bash
npm run dev:portal
npm run dev:hibachi
npm run dev:nado
```

Each app can be deployed as its own Vercel project. The portal can later become the main domain and link to every project-specific calculator.
