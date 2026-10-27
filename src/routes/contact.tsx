import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";
import { z } from "zod";
import { ArrowUpRight, Clock3, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { publicCopy, siteImages, whatsappLink } from "@/content/site";
import { useGymDemoData } from "@/hooks/use-gym-demo-data";
import { useSiteContent } from "@/hooks/use-site-content";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Book a first visit — IRON DISTRICT" },
      {
        name: "description",
        content: publicCopy.contactPage.description,
      },
    ],
  }),
  component: Contact,
});

export const enquirySchema = z.object({
  name: z.string().trim().min(2, publicCopy.contactPage.validation.name).max(100),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s-]{7,17}$/, publicCopy.contactPage.validation.phone),
  email: z
    .string()
    .trim()
    .email(publicCopy.contactPage.validation.email)
    .max(255)
    .or(z.literal("")),
  service: z.string().min(1, publicCopy.contactPage.validation.interest),
  location: z.string().trim().min(2, publicCopy.contactPage.validation.location).max(150),
  budget: z.string().max(50),
  timeline: z.string().max(50),
  message: z.string().trim().min(10, publicCopy.contactPage.validation.details).max(1500),
  consent: z.literal(true, {
    errorMap: () => ({ message: publicCopy.contactPage.validation.consent }),
  }),
});

type Errors = Partial<Record<keyof z.infer<typeof enquirySchema>, string>>;

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string | undefined;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-xs font-bold">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${name}-err`} className="mt-1 text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Contact() {
  const { content } = useSiteContent();
  const { data: demoData, setData } = useGymDemoData();
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState<string | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const raw = Object.fromEntries(formData) as Record<string, string>;
    const parsed = enquirySchema.safeParse({ ...raw, consent: raw["consent"] === "on" });
    if (!parsed.success) {
      const nextErrors: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Errors;
        nextErrors[key] ??= issue.message;
      }
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    const data = parsed.data;
    const inquiry: import("@/lib/gym-data").GymLead = {
      id: `enquiry-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: data.name,
      email: data.email || "Not provided",
      phone: data.phone,
      interest: data.service,
      message: data.message,
      received: new Date().toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
      status: "New",
    };
    setData((current) => ({ ...current, leads: [inquiry, ...current.leads] }));
    const text = [
      `${content.name} — first visit request`,
      `Name: ${data.name}`,
      `Phone: ${data.phone}`,
      `Email: ${data.email || "-"}`,
      `Interested in: ${data.service}`,
      `Based in: ${data.location}`,
      `Training experience: ${data.budget || "-"}`,
      `Best time to start: ${data.timeline || "-"}`,
      `A little more: ${data.message}`,
    ].join("\n");
    setDone(whatsappLink(text));
  }

  const props = (key: keyof Errors) => ({
    "aria-invalid": Boolean(errors[key]),
    "aria-describedby": errors[key] ? `${key}-err` : undefined,
  });

  return (
    <section className="bg-paper">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1fr_0.58fr] lg:gap-24 lg:px-12">
        <div>
          <p className="section-kicker">{publicCopy.contactPage.eyebrow}</p>
          <h1 className="mt-3 max-w-3xl font-display text-5xl font-bold leading-[0.91] tracking-[-0.075em] sm:text-7xl">
            {publicCopy.contactPage.headline}
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-ink/60 sm:text-base">
            {publicCopy.contactPage.description}
          </p>

          {done ? (
            <div className="mt-8 border border-ink/15 bg-white p-6 sm:p-8" role="status">
              <span className="flex size-11 items-center justify-center bg-primary text-ink">
                <MessageCircle size={20} />
              </span>
              <h2 className="mt-5 font-display text-2xl font-bold tracking-[-0.05em]">
                {publicCopy.contactPage.successTitle}
              </h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-ink/60">
                {publicCopy.contactPage.successDescription}
              </p>
              <a
                href={done}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary mt-5"
              >
                {publicCopy.contactPage.whatsappCta} <ArrowUpRight size={17} />
              </a>
            </div>
          ) : (
            <form noValidate onSubmit={onSubmit} className="mt-8 grid gap-5 sm:grid-cols-2">
              <Field label={publicCopy.contactPage.formName} name="name" error={errors.name}>
                <input
                  id="name"
                  name="name"
                  className="field"
                  autoComplete="name"
                  required
                  {...props("name")}
                />
              </Field>
              <Field label={publicCopy.contactPage.formPhone} name="phone" error={errors.phone}>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="field"
                  autoComplete="tel"
                  required
                  {...props("phone")}
                />
              </Field>
              <Field label={publicCopy.contactPage.formEmail} name="email" error={errors.email}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="field"
                  autoComplete="email"
                  {...props("email")}
                />
              </Field>
              <Field
                label={publicCopy.contactPage.formInterest}
                name="service"
                error={errors.service}
              >
                <select
                  id="service"
                  name="service"
                  className="field"
                  defaultValue=""
                  required
                  {...props("service")}
                >
                  <option value="" disabled>
                    {publicCopy.contactPage.classPlaceholder}
                  </option>
                  {demoData.programs.map((program) => (
                    <option key={program.id}>{program.title}</option>
                  ))}
                  {demoData.plans
                    .filter((plan) => plan.active)
                    .map((plan) => (
                      <option key={plan.id}>{plan.name} membership</option>
                    ))}
                  <option>{publicCopy.contactPage.justLooking}</option>
                </select>
              </Field>
              <Field
                label={publicCopy.contactPage.formLocation}
                name="location"
                error={errors.location}
              >
                <input
                  id="location"
                  name="location"
                  className="field"
                  defaultValue={publicCopy.contactPage.locationDefault}
                  autoComplete="address-level2"
                  required
                  {...props("location")}
                />
              </Field>
              <Field label={publicCopy.contactPage.formExperience} name="budget">
                <select id="budget" name="budget" className="field" defaultValue="">
                  {publicCopy.contactPage.experienceOptions.map((option, index) => (
                    <option key={option} value={index === 0 ? "" : option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={publicCopy.contactPage.formVisit} name="timeline">
                <select id="timeline" name="timeline" className="field" defaultValue="">
                  {publicCopy.contactPage.visitOptions.map((option, index) => (
                    <option key={option} value={index === 0 ? "" : option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="sm:col-span-2">
                <Field
                  label={publicCopy.contactPage.formMessage}
                  name="message"
                  error={errors.message}
                >
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="field resize-y"
                    placeholder={publicCopy.contactPage.messagePlaceholder}
                    required
                    {...props("message")}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <label className="flex items-start gap-3 text-xs leading-5 text-ink/65">
                  <input
                    type="checkbox"
                    name="consent"
                    className="mt-0.5 size-4 accent-primary"
                    {...props("consent")}
                  />
                  <span>
                    {publicCopy.contactPage.consentLead} {content.name}{" "}
                    {publicCopy.contactPage.consentTail}
                  </span>
                </label>
                {errors.consent ? (
                  <p id="consent-err" className="mt-1 text-xs text-destructive">
                    {errors.consent}
                  </p>
                ) : null}
              </div>
              <button type="submit" className="btn btn-primary w-fit sm:col-span-2">
                {publicCopy.contactPage.submit} <ArrowUpRight size={17} />
              </button>
              <p className="text-[11px] leading-5 text-ink/40 sm:col-span-2">
                {publicCopy.contactPage.demoNote}
              </p>
            </form>
          )}
        </div>

        <aside className="space-y-3 lg:pt-28">
          <div className="relative min-h-[230px] overflow-hidden bg-ink text-white">
            <img
              src={siteImages.trainingFloor}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
            <div className="absolute bottom-5 left-5">
              <p className="section-kicker !text-primary">{publicCopy.contactPage.sidebarTitle}</p>
              <p className="mt-2 font-display text-xl font-bold">{content.address}</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="flex items-start gap-3 border border-ink/10 bg-white p-4">
              <Clock3 size={18} className="mt-0.5 shrink-0 text-ink/50" />
              <div>
                <p className="text-xs font-bold">{publicCopy.contactPage.hoursTitle}</p>
                <p className="mt-1 text-xs text-ink/55">{content.hours}</p>
              </div>
            </div>
            <a
              href={`tel:${content.phone}`}
              className="flex items-start gap-3 border border-ink/10 bg-white p-4 transition hover:border-ink/40"
            >
              <Phone size={18} className="mt-0.5 shrink-0 text-ink/50" />
              <div>
                <p className="text-xs font-bold">{publicCopy.contactPage.phoneTitle}</p>
                <p className="mt-1 text-xs text-ink/55">{content.phoneDisplay}</p>
              </div>
            </a>
            <a
              href={`mailto:${content.email}`}
              className="flex items-start gap-3 border border-ink/10 bg-white p-4 transition hover:border-ink/40"
            >
              <Mail size={18} className="mt-0.5 shrink-0 text-ink/50" />
              <div>
                <p className="text-xs font-bold">{publicCopy.contactPage.emailTitle}</p>
                <p className="mt-1 text-xs text-ink/55">{content.email}</p>
              </div>
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 border border-ink/10 bg-white p-4 transition hover:border-ink/40"
            >
              <MapPin size={18} className="mt-0.5 shrink-0 text-ink/50" />
              <div>
                <p className="text-xs font-bold">{publicCopy.contactPage.directionsTitle}</p>
                <p className="mt-1 text-xs text-ink/55">{publicCopy.contactPage.directionsNote}</p>
              </div>
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
