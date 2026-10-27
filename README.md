# CLARITY HEALTH

A fictional clinic website and publicly accessible demo admin, built on the existing TanStack Start application.

## What is included

- Public home, doctors, services, departments, facilities, about, contact, and appointment-request pages.
- Direct admin access at `/admin`, with working pages for doctors, services, departments, facilities, appointment requests, website content, and clinic information.
- Existing Supabase project tools remain separately available at `/admin/portfolio`.
- Create, edit, and delete actions for illustrative doctors, services, departments, facilities, and sample quotes.
- Appointment-request search, status filtering, detail viewing, and status updates. A request is not a booking or confirmation.
- Public and admin screens share typed demo content. Changes are saved in the current browser's `localStorage` and immediately appear on public pages.
- Existing Supabase project-management code and configuration are retained; clinic demo data does not require the Supabase backend.

## Run locally

```sh
npm install
npm run dev
```

Use the local URL printed by Vite. Existing validation scripts include `npm test`, `npm run lint`, and `npm run build`.
The separate `/admin/portfolio` tool uses the existing `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` configuration when set; clinic demo content itself does not connect to Supabase.

## Privacy and demo limitations

This is an unauthenticated, publicly accessible frontend demonstration. The admin panel is not protected and is not production-secure. Demo content is stored only in the current browser's `localStorage`; it is browser-specific, can be cleared by the browser, and is not shared with other users or devices.

All clinic, doctor, facility, and quote content is fictional and illustrative. The example contact details use reserved sample values. Public appointment submissions are only demo requests saved in local browser storage; they do not reach a clinic, check availability, or confirm an appointment. Do not enter real patient details, medical histories, symptoms, diagnoses, or other sensitive information. This project is not suitable for real patient management or medical care.

Use **Clinic information → Reset all demo content** to restore the initial examples for this browser.
