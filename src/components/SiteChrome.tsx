import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, Dumbbell, Menu, X } from "lucide-react";
import { publicCopy, type Project } from "@/content/site";
import { useSiteContent } from "@/hooks/use-site-content";

const nav = publicCopy.header.navigation;

export function BrandMark({ light = false }: { light?: boolean }) {
  const { content } = useSiteContent();
  const [first, ...rest] = content.name.toUpperCase().split(" ");
  return (
    <Link
      to="/"
      aria-label="IRON DISTRICT home"
      className={`inline-flex items-center gap-2.5 ${light ? "text-white" : "text-ink"}`}
    >
      <span className="flex size-9 items-center justify-center bg-primary text-ink">
        <Dumbbell size={19} strokeWidth={2.5} aria-hidden />
      </span>
      <span className="font-display text-sm font-extrabold leading-[0.94] tracking-[-0.06em] sm:text-base">
        {first}
        <br />
        {rest.join(" ")}
      </span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { content } = useSiteContent();
  return (
    <>
      <div className="hidden bg-primary py-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-ink sm:block">
        {publicCopy.header.banner}
      </div>
      <header className="site-header sticky top-0 z-40 border-b border-ink/10 bg-paper/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <BrandMark />
          <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-[13px] font-semibold text-ink/65 transition-colors hover:text-ink"
                activeProps={{ className: "text-ink" }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/admin"
              className="text-[13px] font-bold text-ink transition-colors hover:text-ink/60"
            >
              Admin Panel
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/contact"
              className="btn btn-primary hidden !min-h-11 !px-5 !text-xs sm:inline-flex"
            >
              {content.ctaText} <ArrowUpRight size={15} />
            </Link>
            <button
              type="button"
              className="flex size-11 items-center justify-center border border-ink/15 md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {open ? (
          <nav
            className="border-t border-ink/10 bg-paper px-5 pb-5 pt-2 md:hidden"
            aria-label="Mobile navigation"
          >
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="block border-b border-ink/10 py-4 text-base font-semibold"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="block border-b border-ink/10 py-4 text-base font-bold"
            >
              Admin Panel
            </Link>
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="btn btn-primary mt-4 w-full"
            >
              {content.ctaText} <ArrowUpRight size={17} />
            </Link>
          </nav>
        ) : null}
      </header>
    </>
  );
}

export function Footer() {
  const { content } = useSiteContent();
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr] md:py-20 lg:px-12">
        <div>
          <BrandMark light />
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/55">{content.tagline}</p>
        </div>
        <div>
          <p className="section-kicker !text-primary">{publicCopy.footer.findUs}</p>
          <p className="mt-4 text-sm leading-6 text-white/75">{content.address}</p>
          <p className="mt-1 text-sm text-white/55">{content.hours}</p>
        </div>
        <div>
          <p className="section-kicker !text-primary">{publicCopy.footer.move}</p>
          <Link
            to="/contact"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-primary"
          >
            {publicCopy.footer.visitCta} <ArrowUpRight size={16} />
          </Link>
          <p className="mt-2 text-sm text-white/55">
            <a href={`mailto:${content.email}`} className="hover:text-white">
              {content.email}
            </a>
          </p>
          <div className="mt-4 flex gap-4 text-xs font-semibold text-white/55">
            <a
              href={content.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              Instagram
            </a>
            <a
              href={content.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              Facebook
            </a>
          </div>
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-5 text-xs text-white/45">
            <span>© {new Date().getFullYear()} IRON DISTRICT</span>
            <Link to="/admin" className="hover:text-white">
              {publicCopy.footer.adminLink}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function MobileCtaBar() {
  const { content } = useSiteContent();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-paper/95 p-3 backdrop-blur md:hidden">
      <Link to="/contact" className="btn btn-primary w-full">
        {content.ctaText} <ArrowUpRight size={17} />
      </Link>
    </div>
  );
}

export function CtaBand() {
  return (
    <section className="bg-primary text-ink">
      <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-6 px-5 py-12 sm:px-8 md:flex-row md:items-center md:px-12 md:py-16">
        <div>
          <p className="section-kicker">{publicCopy.ctaBand.eyebrow}</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold leading-tight tracking-[-0.05em] sm:text-4xl">
            {publicCopy.ctaBand.title}
          </h2>
        </div>
        <Link to="/contact" className="btn btn-ink shrink-0">
          {publicCopy.ctaBand.button} <ArrowUpRight size={17} />
        </Link>
      </div>
    </section>
  );
}

export function ProjectCard({ p }: { p: Project }) {
  return (
    <Link
      to="/projects/$slug"
      params={{ slug: p.slug }}
      className="group block overflow-hidden border border-ink/10 bg-white"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={p.cover}
          alt={p.title}
          loading="lazy"
          width={1200}
          height={800}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-ink">
          {p.status}
        </span>
      </div>
      <div className="p-5">
        <p className="section-kicker">{p.category}</p>
        <h3 className="mt-2 font-display text-xl font-bold tracking-[-0.04em]">{p.title}</h3>
        <p className="mt-1 text-sm text-ink/55">{p.summary}</p>
      </div>
    </Link>
  );
}
