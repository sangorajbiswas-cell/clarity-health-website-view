# IRON DISTRICT

A responsive gym website and no-auth demo admin workspace, built on the existing TanStack Start app.

## What’s included

- Public home, workout programs, weekly schedule, story, memberships, offers, facilities/gallery, and first-visit request pages.
- Responsive navigation, class filters, weekly schedule selector, and validated visit-request form.
- Open demo admin at `/admin` with direct sections at `/admin/programs`, `/admin/trainers`, `/admin/memberships`, `/admin/offers`, `/admin/facilities`, `/admin/gallery`, `/admin/enquiries`, and `/admin/settings`.
- Demo admin changes persist in this browser's `localStorage` and immediately update the public catalog. Sample records are fictional and do not connect to a membership or payment system.
- The original Supabase portfolio manager remains available in the admin’s **Portfolio tools** section.

## Run locally

The project uses the existing package scripts and dependencies:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Validate with `npm test`, `npm run lint`, and `npm run build`.

The demo gym website and admin do not require authentication or a database. The retained portfolio tools use the existing Supabase configuration (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local`).

## Demo behavior

The admin is public and deliberately has no sign-in, authentication, or access control. Its sample data and enquiries submitted through the demo form are stored only in this browser's `localStorage`, which is browser-specific demo storage and is not suitable for real customer or sensitive information. Use **Reset demo data** in the admin header to restore the initial examples. Enquiry submission saves a fictional demo record locally and offers an optional WhatsApp handoff; it is not connected to a customer database.

Public copy, contact details, and initial program, offer, facility, gallery, trainer, schedule, and plan examples are maintained in `src/content/site.ts` and the typed demo catalog. All supplied gym details, pricing, imagery, trainers, profiles, and offers are illustrative. This public admin demo is not production-secure. Verify and replace sample content and contact details before publishing.
