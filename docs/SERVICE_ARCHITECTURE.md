# Service Architecture

This repository is structured as a small product family rather than a single one-off calculator.

## Structure

- `portal` is the public index/hub for all calculators and checkers.
- `hibachi`, `nado`, and future folders are standalone Next.js apps.
- Each project app owns its own formulas, share image route, SEO, and deployment settings.

## Adding A New Project

1. Copy the closest existing calculator folder.
2. Rename the package in `package.json`.
3. Replace referral links, official links, metadata, favicon, share image copy, and disclaimer.
4. Add the project to `portal/src/data/projects.ts`.
5. Add workspace scripts in the root `package.json`.
6. Run lint/build for the changed app and portal.

## Deployment Model

Recommended:

- Deploy `portal` to the main domain.
- Deploy each calculator to its own Vercel project/subdomain.
- Link all calculators from the portal.

This keeps every calculator isolated, so a bug or dependency issue in one project does not take down the whole service.
