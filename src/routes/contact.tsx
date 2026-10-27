import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock3, Mail, MapPin, Phone } from "lucide-react";
import { ClinicImage } from "@/components/ClinicImage";
import { CtaBand } from "@/components/SiteChrome";
import { clinicImages } from "@/content/site";
import { useClinicDemoData } from "@/hooks/use-clinic-demo-data";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — CLARITY HEALTH demo" },
      {
        name: "description",
        content:
          "Sample contact information for the fictional CLARITY HEALTH clinic website demonstration.",
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  const { data } = useClinicDemoData();
  const phoneHref = data.clinic.phone.replace(/[^\d+]/g, "");
  return (
    <>
      <section className="bg-sage-100/70">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
          <p className="section-kicker">We’re easy to find (in this example)</p>
          <h1 className="mt-3 max-w-4xl font-display text-5xl font-semibold leading-tight tracking-tight text-forest-950 sm:text-7xl">
            Contact the sample clinic.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-forest-950/70">
            All contact details, maps, and opening hours shown here are fictional placeholders. This
            is not a real healthcare provider.
          </p>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1fr_0.85fr] lg:px-10">
        <div className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-forest-900/10 bg-white p-6">
            <MapPin size={22} className="text-forest-700" aria-hidden />
            <h2 className="mt-4 font-display text-lg font-semibold text-forest-950">
              Example address
            </h2>
            <p className="mt-2 text-sm leading-6 text-forest-950/70">{data.clinic.address}</p>
            <a
              href={data.clinic.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-forest-800"
            >
              Open sample directions <ArrowUpRight size={15} aria-hidden />
            </a>
          </article>
          <article className="rounded-2xl border border-forest-900/10 bg-white p-6">
            <Clock3 size={22} className="text-forest-700" aria-hidden />
            <h2 className="mt-4 font-display text-lg font-semibold text-forest-950">
              Sample opening hours
            </h2>
            <p className="mt-2 text-sm leading-6 text-forest-950/70">{data.clinic.hours}</p>
          </article>
          <article className="rounded-2xl border border-forest-900/10 bg-white p-6">
            <Phone size={22} className="text-forest-700" aria-hidden />
            <h2 className="mt-4 font-display text-lg font-semibold text-forest-950">
              Example phone
            </h2>
            <a href={`tel:${phoneHref}`} className="mt-2 block text-sm text-forest-950/70">
              {data.clinic.phone}
            </a>
          </article>
          <article className="rounded-2xl border border-forest-900/10 bg-white p-6">
            <Mail size={22} className="text-forest-700" aria-hidden />
            <h2 className="mt-4 font-display text-lg font-semibold text-forest-950">
              Example email
            </h2>
            <a
              href={`mailto:${data.clinic.email}`}
              className="mt-2 block break-all text-sm text-forest-950/70"
            >
              {data.clinic.email}
            </a>
          </article>
        </div>
        <div className="relative min-h-[330px] overflow-hidden rounded-3xl bg-sage-100 sm:min-h-[430px]">
          <ClinicImage
            src={clinicImages.clinic}
            alt="Illustrative stock image of a bright clinic interior"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/95 p-5 shadow-md">
            <p className="text-xs font-semibold uppercase tracking-wide text-forest-700">
              Sample location
            </p>
            <p className="mt-2 font-display text-lg font-semibold text-forest-950">
              {data.clinic.address}
            </p>
            <p className="mt-1 text-xs text-forest-950/65">
              Fictional details · Not an operating clinic
            </p>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-5 pb-12 sm:px-8 lg:px-10">
        <div className="rounded-2xl bg-forest-900 p-6 text-white sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-8">
          <div>
            <h2 className="font-display text-2xl font-semibold">Have a question about the demo?</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
              Explore the public pages or submit a local demo request. No actual clinic contact is
              available.
            </p>
          </div>
          <Link
            to="/appointment"
            className="btn mt-5 w-full bg-white text-forest-950 hover:bg-sage-100 sm:mt-0 sm:w-auto"
          >
            Try a demo request <ArrowUpRight size={16} aria-hidden />
          </Link>
        </div>
      </div>
      <CtaBand />
    </>
  );
}
