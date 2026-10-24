import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  MessageCircle,
  Phone,
  ShieldCheck,
  ClipboardList,
  HardHat,
} from "lucide-react";
import { services, site, stats, testimonials, whatsappLink } from "@/content/site";
import { CtaBand, ProjectCard } from "@/components/SiteChrome";
import { usePublishedProjects } from "@/hooks/use-projects";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BuildTrust Constructions — Homes, Commercial & Renovation" },
      {
        name: "description",
        content:
          "Residential, commercial and renovation construction with transparent estimates. Request a free site visit and quote.",
      },
      { property: "og:title", content: "BuildTrust Constructions" },
      {
        property: "og:description",
        content: "Construction you can trust. Request a site visit and quote.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const projects = usePublishedProjects();
  const visibleStats = stats.filter((s) => s.value);
  return (
    <>
      <section className="relative isolate min-h-[85vh] overflow-hidden text-ink-foreground">
        <img
          src={site.heroImage}
          alt="Modern home under construction at sunset"
          width={1600}
          height={1008}
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="hero-overlay absolute inset-0 -z-10" />
        <div className="mx-auto flex min-h-[85vh] max-w-6xl flex-col justify-end px-4 pb-16">
          <p className="eyebrow">Residential · Commercial · Renovation</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight sm:text-6xl">
            Built right. Priced clearly. Delivered with care.
          </h1>
          <p className="mt-4 max-w-xl text-lg opacity-90">{site.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/contact" className="btn btn-primary">
              Request a free quote
            </Link>
            <a href={`tel:${site.phone}`} className="btn btn-outline">
              <Phone size={18} /> {site.phoneDisplay}
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
            >
              <MessageCircle size={18} /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      {visibleStats.length > 0 && (
        <section className="border-b bg-card">
          <div className="mx-auto grid max-w-6xl grid-cols-3 gap-4 px-4 py-8 text-center">
            {visibleStats.map((s) => (
              <div key={s.label}>
                <p className="font-display text-3xl font-extrabold text-primary">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="eyebrow">Why clients choose us</p>
        <h2 className="mt-2 text-3xl font-extrabold">A process you can see and trust</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: ClipboardList,
              t: "Written, itemised estimates",
              d: "Every quote follows a site inspection and is broken down line by line.",
            },
            {
              icon: HardHat,
              t: "Single point of contact",
              d: "One project lead keeps you updated from groundwork to handover.",
            },
            {
              icon: ShieldCheck,
              t: "Quality checks at each stage",
              d: "Stage-wise inspections before moving on to the next phase.",
            },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="rounded-lg border bg-card p-6">
              <Icon className="text-primary" aria-hidden />
              <h3 className="mt-3 text-lg font-bold">{t}</h3>
              <p className="mt-1 text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">Services</p>
              <h2 className="mt-2 text-3xl font-extrabold">What we build</h2>
            </div>
            <Link to="/services" className="font-semibold text-primary">
              All services →
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <div key={s.slug} className="rounded-lg bg-card p-5">
                <h3 className="font-bold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow">Portfolio</p>
            <h2 className="mt-2 text-3xl font-extrabold">Recent projects</h2>
          </div>
          <Link to="/projects" className="font-semibold text-primary">
            View all →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 3).map((p) => (
            <ProjectCard key={p.slug} p={p} />
          ))}
        </div>
      </section>

      <section className="bg-ink py-16 text-ink-foreground">
        <div className="mx-auto max-w-6xl px-4">
          <p className="eyebrow">Client feedback</p>
          <h2 className="mt-2 text-3xl font-extrabold">What clients say</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {testimonials.map((t, i) => (
              <figure key={i} className="rounded-lg border border-ink-foreground/20 p-6">
                <span className="rounded bg-primary px-2 py-0.5 text-xs font-bold uppercase text-primary-foreground">
                  Sample placeholder
                </span>
                <blockquote className="mt-3 text-lg">“{t.quote}”</blockquote>
                <figcaption className="mt-3 text-sm opacity-75">
                  — {t.name}, {t.role}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-extrabold">How it works</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            "Send your enquiry",
            "Free site inspection",
            "Itemised written estimate",
            "Build & handover",
          ].map((s, i) => (
            <li key={s} className="flex items-center gap-3 rounded-lg border bg-card p-4">
              <span className="font-display text-2xl font-extrabold text-primary">{i + 1}</span>
              <span className="font-semibold">{s}</span>
              <CheckCircle2 className="ml-auto text-muted-foreground" size={18} aria-hidden />
            </li>
          ))}
        </ol>
      </section>

      <CtaBand />
    </>
  );
}
