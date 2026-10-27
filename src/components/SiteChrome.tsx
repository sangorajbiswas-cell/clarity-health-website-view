import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, HeartPulse, Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import { useClinicDemoData } from "@/hooks/use-clinic-demo-data";

const navigation = [
  { to: "/doctors", label: "Our doctors" },
  { to: "/services", label: "Care & services" },
  { to: "/departments", label: "Departments" },
  { to: "/about", label: "About us" },
  { to: "/contact", label: "Contact" },
];

export function BrandMark() {
  const { data } = useClinicDemoData();
  return (
    <Link
      to="/"
      aria-label={`${data.clinic.name} home`}
      className="flex items-center gap-3 text-forest-950"
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-forest-800 text-white">
        <HeartPulse size={23} strokeWidth={1.7} aria-hidden />
      </span>
      <span className="font-display text-sm font-bold leading-[1.05] tracking-[0.055em] sm:text-base">
        {data.clinic.name}
        <span className="mt-1 block text-[9px] font-medium tracking-[0.19em] text-forest-700">
          CARE, WITH CLARITY
        </span>
      </span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { data } = useClinicDemoData();
  return (
    <>
      <div className="bg-forest-900 px-4 py-2 text-center text-[11px] font-medium tracking-wide text-white">
        Illustrative clinic demo · Not a real medical provider
      </div>
      <header className="site-header sticky top-0 z-40 border-b border-forest-900/10 bg-ivory/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[78px] max-w-7xl items-center justify-between gap-5 px-5 sm:px-8 lg:px-10">
          <BrandMark />
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">
            {navigation.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-[13px] font-medium text-forest-950/75 transition hover:text-forest-700"
                activeProps={{ className: "text-forest-800 font-semibold" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/appointment" className="btn btn-forest hidden sm:inline-flex">
              Request a visit <ArrowUpRight size={16} aria-hidden />
            </Link>
            <button
              type="button"
              className="flex size-11 items-center justify-center rounded-full border border-forest-900/15 lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {open ? (
          <nav
            id="mobile-navigation"
            className="border-t border-forest-900/10 bg-ivory px-5 pb-6 pt-2 lg:hidden"
            aria-label="Mobile navigation"
          >
            {navigation.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="block border-b border-forest-900/10 py-4 text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/appointment"
              onClick={() => setOpen(false)}
              className="btn btn-forest mt-5 w-full"
            >
              Request a visit <ArrowUpRight size={16} aria-hidden />
            </Link>
          </nav>
        ) : null}
      </header>
    </>
  );
}

export function Footer() {
  const { data } = useClinicDemoData();
  const phoneHref = data.clinic.phone.replace(/[^\d+]/g, "");
  return (
    <footer className="bg-forest-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.3fr_1fr_1fr] lg:px-10">
        <div>
          <BrandMark />
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/65">{data.clinic.tagline}</p>
          <p className="mt-4 max-w-sm text-xs leading-5 text-white/45">
            Fictional demonstration content. This website is not a medical provider.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Find us</h2>
          <p className="mt-4 text-sm leading-6 text-white/65">{data.clinic.address}</p>
          <p className="mt-2 text-sm leading-6 text-white/65">{data.clinic.hours}</p>
          <a
            href={data.clinic.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-sage-200 hover:text-white"
          >
            Directions <ArrowUpRight size={15} aria-hidden />
          </a>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Get in touch</h2>
          <a
            href={`tel:${phoneHref}`}
            className="mt-4 block text-sm text-white/65 hover:text-white"
          >
            {data.clinic.phone}
          </a>
          <a
            href={`mailto:${data.clinic.email}`}
            className="mt-2 block text-sm text-white/65 hover:text-white"
          >
            {data.clinic.email}
          </a>
          <Link to="/contact" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
            Contact the clinic <ArrowRight size={15} aria-hidden />
          </Link>
          <div className="mt-6 border-t border-white/15 pt-4 text-xs text-white/50">
            <span>
              © {new Date().getFullYear()} {data.clinic.name} · Demo
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function MobileCtaBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-forest-900/10 bg-ivory/95 p-3 backdrop-blur sm:hidden">
      <Link to="/appointment" className="btn btn-forest w-full">
        Request an appointment <ArrowUpRight size={16} aria-hidden />
      </Link>
    </div>
  );
}

export function CtaBand() {
  return (
    <section className="bg-sage-100">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-12 sm:px-8 md:flex-row md:items-center md:px-10 md:py-16">
        <div>
          <p className="section-kicker">A simple first step</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-forest-950 sm:text-4xl">
            Start with a conversation.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-forest-950/70">
            Send a demo appointment request. It is not a booking or a confirmation.
          </p>
        </div>
        <Link to="/appointment" className="btn btn-forest shrink-0">
          Request an appointment <ArrowUpRight size={16} aria-hidden />
        </Link>
      </div>
    </section>
  );
}

export function CallClinic() {
  const { data } = useClinicDemoData();
  const phoneHref = data.clinic.phone.replace(/[^\d+]/g, "");
  return (
    <a href={`tel:${phoneHref}`} className="btn btn-outline">
      <Phone size={16} aria-hidden /> Call the clinic
    </a>
  );
}
