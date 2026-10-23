import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, MessageCircle, Phone, X } from "lucide-react";
import { site, whatsappLink } from "@/content/site";

const nav = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="font-display text-lg font-extrabold">
          Build<span className="text-primary">Trust</span>
        </Link>
        <nav className="hidden gap-6 md:flex" aria-label="Main">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="font-medium hover:text-primary" activeProps={{ className: "text-primary" }} activeOptions={{ exact: n.to === "/" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/contact" className="btn btn-primary hidden sm:inline-flex">Get a quote</Link>
          <button className="btn md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t px-4 pb-4 md:hidden" aria-label="Mobile">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="block py-3 text-lg font-medium">
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-ink pb-24 pt-12 text-ink-foreground md:pb-12">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-3">
        <div>
          <p className="font-display text-xl font-extrabold">Build<span className="text-primary">Trust</span> Constructions</p>
          <p className="mt-2 opacity-80">{site.tagline}</p>
        </div>
        <div className="space-y-1 opacity-90">
          <p><a href={`tel:${site.phone}`}>{site.phoneDisplay}</a></p>
          <p><a href={`mailto:${site.email}`}>{site.email}</a></p>
          <p>{site.address}</p>
          <p>{site.hours}</p>
        </div>
        <div className="text-sm opacity-70">
          <p>All prices on this site are indicative estimates and subject to site inspection.</p>
          <p className="mt-2">© {new Date().getFullYear()} {site.name}</p>
        </div>
      </div>
    </footer>
  );
}

/** Sticky mobile call / WhatsApp bar */
export function MobileCtaBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t bg-background p-2 md:hidden">
      <a href={`tel:${site.phone}`} className="btn btn-ink"><Phone size={18} /> Call</a>
      <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp"><MessageCircle size={18} /> WhatsApp</a>
    </div>
  );
}

export function CtaBand() {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-12 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold">Planning a project?</h2>
          <p className="mt-1 opacity-90">Tell us about it — we'll arrange a site visit and a written estimate.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/contact" className="btn btn-ink">Request a quote</Link>
          <a href={`tel:${site.phone}`} className="btn btn-outline"><Phone size={18} /> Call now</a>
        </div>
      </div>
    </section>
  );
}

export function ProjectCard({ p }: { p: import("@/content/site").Project }) {
  return (
    <Link to="/projects/$slug" params={{ slug: p.slug }} className="group block overflow-hidden rounded-lg border bg-card">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={p.cover} alt={p.title} loading="lazy" width={1200} height={800} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <span className={`absolute left-3 top-3 rounded px-2 py-1 text-xs font-bold uppercase ${p.status === "completed" ? "bg-ink text-ink-foreground" : "bg-primary text-primary-foreground"}`}>
          {p.status}
        </span>
      </div>
      <div className="p-4">
        <p className="eyebrow">{p.category}</p>
        <h3 className="mt-1 text-lg font-bold">{p.title}</h3>
        <p className="text-sm text-muted-foreground">{p.summary}</p>
      </div>
    </Link>
  );
}
