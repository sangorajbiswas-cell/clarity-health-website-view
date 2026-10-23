import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { services, site, whatsappLink } from "@/content/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Request a Quote — BuildTrust Constructions" },
      { name: "description", content: "Tell us about your construction project and request a free site inspection and quote." },
      { property: "og:title", content: "Request a Quote — BuildTrust" },
      { property: "og:description", content: "Request a free site inspection and written estimate." },
    ],
  }),
  component: Contact,
});

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z.string().trim().regex(/^[+\d][\d\s-]{7,17}$/, "Enter a valid phone number"),
  email: z.string().trim().email("Enter a valid email").max(255).or(z.literal("")),
  service: z.string().min(1, "Choose a project type"),
  location: z.string().trim().min(2, "Enter the site location").max(150),
  budget: z.string().max(50),
  timeline: z.string().max(50),
  message: z.string().trim().min(10, "Please add a few details (min 10 characters)").max(1500),
  consent: z.literal(true, { errorMap: () => ({ message: "Please agree so we can contact you" }) }),
});

type Errors = Partial<Record<keyof z.infer<typeof enquirySchema>, string>>;

function Field({ label, name, error, children }: { label: string; name: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block font-semibold">{label}</label>
      {children}
      {error && <p id={`${name}-err`} className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
}

function Contact() {
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = Object.fromEntries(fd) as Record<string, string>;
    const parsed = enquirySchema.safeParse({ ...raw, consent: raw.consent === "on" });
    if (!parsed.success) {
      const errs: Errors = {};
      for (const i of parsed.error.issues) errs[i.path[0] as keyof Errors] ??= i.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    const d = parsed.data;
    // Until the database is connected, enquiries are sent via WhatsApp.
    const text = `New quote enquiry\nName: ${d.name}\nPhone: ${d.phone}\nEmail: ${d.email || "-"}\nProject: ${d.service}\nLocation: ${d.location}\nBudget: ${d.budget || "-"}\nTimeline: ${d.timeline || "-"}\nDetails: ${d.message}`;
    setDone(whatsappLink(text));
  }

  const inv = (k: keyof Errors) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${k}-err` : undefined });

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1fr_320px]">
      <div>
        <p className="eyebrow">Request a quote</p>
        <h1 className="mt-2 text-4xl font-extrabold">Tell us about your project</h1>
        <p className="mt-2 text-muted-foreground">We'll get back to arrange a site inspection. Estimates are confirmed only after inspection.</p>

        {done ? (
          <div className="mt-8 rounded-lg border bg-card p-6" role="status">
            <h2 className="text-2xl font-bold">Almost done</h2>
            <p className="mt-2">Tap below to send your enquiry to us on WhatsApp.</p>
            <a href={done} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp mt-4"><MessageCircle size={18} /> Send via WhatsApp</a>
          </div>
        ) : (
          <form noValidate onSubmit={onSubmit} className="mt-8 grid gap-5 sm:grid-cols-2">
            <Field label="Full name *" name="name" error={errors.name}><input id="name" name="name" className="field" autoComplete="name" {...inv("name")} /></Field>
            <Field label="Phone *" name="phone" error={errors.phone}><input id="phone" name="phone" type="tel" className="field" autoComplete="tel" {...inv("phone")} /></Field>
            <Field label="Email" name="email" error={errors.email}><input id="email" name="email" type="email" className="field" autoComplete="email" {...inv("email")} /></Field>
            <Field label="Project type *" name="service" error={errors.service}>
              <select id="service" name="service" className="field" defaultValue="" {...inv("service")}>
                <option value="" disabled>Select…</option>
                {services.map((s) => <option key={s.slug}>{s.title}</option>)}
                <option>Other</option>
              </select>
            </Field>
            <Field label="Site location *" name="location" error={errors.location}><input id="location" name="location" className="field" {...inv("location")} /></Field>
            <Field label="Approx. budget" name="budget">
              <select id="budget" name="budget" className="field" defaultValue="">
                <option value="">Prefer not to say</option><option>Under ₹10 lakh</option><option>₹10–25 lakh</option><option>₹25–50 lakh</option><option>₹50 lakh – 1 crore</option><option>Above ₹1 crore</option>
              </select>
            </Field>
            <Field label="Timeline" name="timeline">
              <select id="timeline" name="timeline" className="field" defaultValue="">
                <option value="">Not sure yet</option><option>Within 1 month</option><option>1–3 months</option><option>3–6 months</option><option>6+ months</option>
              </select>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Project details *" name="message" error={errors.message}><textarea id="message" name="message" rows={5} className="field" placeholder="Plot size, floors, scope of work…" {...inv("message")} /></Field>
            </div>
            <div className="sm:col-span-2">
              <label className="flex items-start gap-3">
                <input type="checkbox" name="consent" className="mt-1 size-5 accent-primary" {...inv("consent")} />
                <span>I agree to be contacted by {site.name} by phone, WhatsApp or email about this enquiry. My details won't be shared with third parties.</span>
              </label>
              {errors.consent && <p id="consent-err" className="mt-1 text-sm text-destructive">{errors.consent}</p>}
            </div>
            <button type="submit" className="btn btn-primary sm:col-span-2">Submit enquiry</button>
          </form>
        )}
      </div>
      <aside className="space-y-3">
        <a href={`tel:${site.phone}`} className="btn btn-ink w-full"><Phone size={18} /> Call {site.phoneDisplay}</a>
        <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp w-full"><MessageCircle size={18} /> Chat on WhatsApp</a>
        <a href={`mailto:${site.email}`} className="btn btn-outline w-full"><Mail size={18} /> {site.email}</a>
        <div className="rounded-lg border bg-card p-4 text-sm"><p className="font-semibold">Office</p><p>{site.address}</p><p className="mt-2">{site.hours}</p></div>
      </aside>
    </section>
  );
}
