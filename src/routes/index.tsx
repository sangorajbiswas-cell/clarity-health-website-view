import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  HeartHandshake,
  MapPin,
  ShieldPlus,
} from "lucide-react";
import { CtaBand } from "@/components/SiteChrome";
import { ClinicImage } from "@/components/ClinicImage";
import { clinicImages } from "@/content/site";
import { useClinicDemoData } from "@/hooks/use-clinic-demo-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CLARITY HEALTH — Thoughtful care, made easier to navigate" },
      {
        name: "description",
        content:
          "A calm, illustrative clinic website demo with fictional doctors, services, and appointment requests.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { data } = useClinicDemoData();
  return (
    <>
      <section className="relative isolate min-h-[650px] overflow-hidden bg-forest-950 text-white sm:min-h-[730px]">
        <ClinicImage
          src={clinicImages.hero}
          alt="Illustrative healthcare consultation setting"
          loading="eager"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        />
        <div className="hero-scrim absolute inset-0 -z-10" />
        <div className="mx-auto flex min-h-[650px] max-w-7xl items-end px-5 pb-16 pt-24 sm:min-h-[730px] sm:px-8 sm:pb-20 lg:px-10">
          <div className="reveal-up max-w-3xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-[11px] font-semibold tracking-wide text-white backdrop-blur">
              <span className="size-2 rounded-full bg-sage-200" />
              {data.home.heroEyebrow}
            </p>
            <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[1.03] tracking-[-0.06em] sm:text-7xl lg:text-8xl">
              {data.home.heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/85 sm:text-lg sm:leading-8">
              {data.home.heroDescription}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/appointment"
                className="btn rounded-full bg-white px-6 text-forest-950 hover:bg-sage-100"
              >
                {data.home.appointmentCta} <ArrowUpRight size={17} aria-hidden />
              </Link>
              <Link
                to="/services"
                className="btn rounded-full border border-white/55 px-6 text-white hover:bg-white/10"
              >
                Explore care <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
            <p className="mt-6 max-w-lg text-xs leading-5 text-white/75">
              Demo only · Fictional sample content · Requests are not bookings or confirmed
              appointments
            </p>
          </div>
        </div>
        <div className="absolute bottom-8 right-7 hidden max-w-xs rounded-2xl border border-white/20 bg-forest-950/65 p-5 text-white backdrop-blur-md lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage-200">
            A thoughtful first step
          </p>
          <p className="mt-2 text-sm leading-6 text-white/85">
            Get a feel for this fictional clinic and send a local demo request.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="section-kicker">Care that feels considered</p>
            <h2 className="mt-4 max-w-xl font-display text-4xl font-semibold leading-tight tracking-tight text-forest-950 sm:text-5xl">
              {data.home.aboutTitle}
            </h2>
          </div>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-2xl text-sm leading-7 text-forest-950/70 sm:text-base">
              {data.home.aboutDescription}
            </p>
            <Link
              to="/about"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-forest-800"
            >
              About our approach <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: HeartHandshake,
              title: "Start with listening",
              text: "Make room for questions and clear next steps.",
            },
            {
              icon: ShieldPlus,
              title: "Care with context",
              text: "Present information in a calm, considerate way.",
            },
            {
              icon: CalendarDays,
              title: "A simpler first step",
              text: "Request a conversation without implying availability.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="rounded-2xl border border-forest-900/10 bg-white p-6 sm:p-7"
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-sage-100 text-forest-800">
                <Icon size={21} strokeWidth={1.7} aria-hidden />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-forest-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-forest-950/65">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="section-kicker">Areas of care</p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-forest-950 sm:text-5xl">
                Explore our departments.
              </h2>
            </div>
            <Link
              to="/departments"
              className="inline-flex items-center gap-2 text-sm font-semibold text-forest-800"
            >
              All departments <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {data.departments.slice(0, 4).map((department) => (
              <Link
                key={department.id}
                to="/departments"
                className="clinic-card group overflow-hidden"
              >
                <div className="aspect-[4/3] overflow-hidden bg-sage-100">
                  <ClinicImage
                    src={department.image}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold text-forest-950">
                    {department.name}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-forest-950/65">
                    {department.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-forest-800">
                    Learn more <ArrowUpRight size={14} aria-hidden />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="grid gap-9 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="section-kicker">Meet the example care team</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight text-forest-950 sm:text-5xl">
              People first. Always.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-forest-950/70">
              These fictional profiles demonstrate a directory layout. Names, qualifications,
              experience, and imagery are sample content only.
            </p>
            <Link to="/doctors" className="btn btn-forest mt-6">
              Meet the sample doctors <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {data.doctors.slice(0, 3).map((doctor) => (
              <Link key={doctor.id} to="/doctors" className="clinic-card group overflow-hidden">
                <div className="aspect-[4/5] overflow-hidden bg-sage-100">
                  <ClinicImage
                    src={doctor.image}
                    alt={`Illustrative portrait for ${doctor.name}`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-display font-semibold text-forest-950">{doctor.name}</h3>
                  <p className="mt-1 text-xs text-forest-950/65">{doctor.specialty}</p>
                  <p className="mt-2 text-[10px] leading-4 text-forest-700">
                    Fictional demo profile
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sage-100/70 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1fr] lg:items-center lg:px-10">
          <div className="relative min-h-[330px] overflow-hidden rounded-[1.5rem] sm:min-h-[440px]">
            <ClinicImage
              src={data.facilities[0]?.image ?? clinicImages.clinic}
              alt={data.facilities[0]?.alt ?? "Illustrative clinic interior"}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute bottom-4 left-4 rounded-xl bg-white/95 px-4 py-3 text-sm font-semibold text-forest-950 shadow-md sm:bottom-6 sm:left-6">
              {data.facilities[0]?.name ?? "A welcoming space"}
            </div>
          </div>
          <div>
            <p className="section-kicker">A place to feel at ease</p>
            <h2 className="mt-3 max-w-lg font-display text-4xl font-semibold leading-tight tracking-tight text-forest-950 sm:text-5xl">
              Considered spaces, clear information.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-forest-950/70">
              Explore illustrative clinic imagery and sample facility descriptions. All photographs
              are stock imagery and do not depict a real CLARITY HEALTH location.
            </p>
            <div className="mt-6 grid gap-3">
              {data.facilities.slice(0, 3).map((facility) => (
                <div key={facility.id} className="flex items-start gap-3 rounded-xl bg-white p-4">
                  <span className="mt-1 size-2 shrink-0 rounded-full bg-forest-700" />
                  <div>
                    <h3 className="text-sm font-semibold text-forest-950">{facility.name}</h3>
                    <p className="mt-1 text-xs leading-5 text-forest-950/65">
                      {facility.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/facilities"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-forest-800"
            >
              Explore the clinic <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr]">
          <div className="rounded-[1.5rem] bg-forest-900 p-7 text-white sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-sage-200">
              Illustrative clinic information
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold">Plan a first conversation.</h2>
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <div className="flex gap-3">
                <Clock3 size={18} className="mt-0.5 shrink-0 text-sage-200" aria-hidden />
                <div>
                  <h3 className="text-sm font-semibold">Example opening hours</h3>
                  <p className="mt-1 text-sm leading-6 text-white/70">{data.clinic.hours}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-sage-200" aria-hidden />
                <div>
                  <h3 className="text-sm font-semibold">Sample address</h3>
                  <p className="mt-1 text-sm leading-6 text-white/70">{data.clinic.address}</p>
                </div>
              </div>
            </div>
            <p className="mt-6 border-t border-white/15 pt-5 text-xs leading-5 text-white/65">
              This location, schedule, and all contact details are fictional examples.
            </p>
          </div>
          <div className="flex flex-col justify-center">
            <p className="section-kicker">Before you request a visit</p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-forest-950 sm:text-4xl">
              Requests are only requests.
            </h2>
            <p className="mt-4 text-sm leading-7 text-forest-950/70">
              The demo form records non-medical contact and preference details in this browser only.
              It does not confirm availability or create a real appointment.
            </p>
            <Link to="/appointment" className="btn btn-forest mt-6 w-fit">
              Request an appointment <ArrowUpRight size={16} aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-8 max-w-2xl">
            <p className="section-kicker">Words to guide us</p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-forest-950 sm:text-5xl">
              A philosophy, not a review page.
            </h2>
            <p className="mt-3 text-xs leading-5 text-forest-950/60">
              {data.home.testimonialsNote}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {data.testimonials.slice(0, 3).map((quote) => (
              <figure
                key={quote.id}
                className="rounded-2xl border border-forest-900/10 bg-ivory p-6"
              >
                <blockquote className="font-display text-lg font-medium leading-7 text-forest-950">
                  “{quote.quote}”
                </blockquote>
                <figcaption className="mt-5 border-t border-forest-900/10 pt-4">
                  <span className="block text-sm font-semibold text-forest-950">
                    {quote.attribution}
                  </span>
                  <span className="mt-1 block text-[11px] text-forest-700">{quote.context}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
