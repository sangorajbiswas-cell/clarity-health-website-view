import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Clock3,
  Dumbbell,
  MoveUpRight,
  ShieldCheck,
} from "lucide-react";
import { CtaBand } from "@/components/SiteChrome";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { publicCopy, site, siteImages } from "@/content/site";
import { useGymDemoData } from "@/hooks/use-gym-demo-data";
import { useSiteContent } from "@/hooks/use-site-content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IRON DISTRICT — Find your strong" },
      {
        name: "description",
        content: publicCopy.home.hero.description,
      },
      { property: "og:title", content: "IRON DISTRICT — Find your strong" },
      {
        property: "og:description",
        content: publicCopy.home.hero.description,
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { content } = useSiteContent();
  const { data } = useGymDemoData();
  const activePrograms = data.programs;
  const activePlans = data.plans.filter((plan) => plan.active);
  const trainers = data.trainers;
  const activeOffers = data.offers.filter((offer) => offer.active);
  return (
    <>
      <section className="relative min-h-[680px] overflow-hidden bg-ink text-white sm:min-h-[760px]">
        <ImageWithFallback
          src={site.heroImage}
          alt={`${content.name} training floor`}
          width={2200}
          height={1400}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="hero-scrim absolute inset-0" />
        <div className="hero-texture absolute inset-0" />
        <div className="relative mx-auto flex min-h-[680px] max-w-[1440px] flex-col justify-end px-5 pb-16 pt-20 sm:min-h-[760px] sm:px-8 sm:pb-24 lg:px-12">
          <div className="reveal-up max-w-4xl">
            <p className="mb-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
              <span className="h-px w-8 bg-primary" /> {publicCopy.home.hero.eyebrow}
            </p>
            <h1 className="max-w-4xl font-display text-[clamp(4rem,11vw,9rem)] font-bold leading-[0.81] tracking-[-0.085em]">
              {publicCopy.home.hero.firstLine}
              <br />
              {publicCopy.home.hero.secondLine}{" "}
              <span className="text-primary">{publicCopy.home.hero.accent}</span>
            </h1>
            <p className="mt-7 max-w-md text-base leading-7 text-white/75 sm:text-lg">
              {content.heroDescription}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/contact" className="btn btn-primary !min-h-14 !px-7">
                {content.ctaText} <ArrowUpRight size={18} />
              </Link>
              <Link
                to="/services"
                className="btn btn-outline !min-h-14 !border-white/45 !px-7 !text-white"
              >
                {publicCopy.home.hero.secondaryCta} <ArrowRight size={17} />
              </Link>
            </div>
          </div>
          <div className="mt-16 flex items-end justify-between border-t border-white/25 pt-5">
            <p className="max-w-xs text-[10px] font-semibold uppercase leading-5 tracking-[0.14em] text-white/65">
              {publicCopy.home.hero.disciplines}
            </p>
            <a
              href="#district"
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/65"
            >
              {publicCopy.home.hero.scrollLabel} <ArrowDown size={14} />
            </a>
          </div>
        </div>
      </section>

      <section id="district" className="bg-primary">
        <div className="mx-auto grid max-w-[1440px] gap-px bg-ink/15 px-5 sm:grid-cols-3 sm:px-8 lg:px-12">
          {publicCopy.home.principles.map((item) => (
            <div
              key={item.value}
              className="grid min-h-36 grid-cols-[52px_1fr] items-start gap-3 bg-primary py-7 sm:px-5 lg:min-h-40 lg:py-9"
            >
              <span className="font-display text-sm font-bold tracking-widest text-ink/50">
                {item.value}
              </span>
              <div>
                <h2 className="font-display text-xl font-bold tracking-[-0.04em]">{item.label}</h2>
                <p className="mt-1 text-sm text-ink/65">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="section-kicker">{publicCopy.home.classes.eyebrow}</p>
            <h2 className="mt-3 max-w-2xl font-display text-4xl font-bold leading-[0.98] tracking-[-0.065em] sm:text-6xl">
              {publicCopy.home.classes.title}
            </h2>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 pb-1 text-sm font-bold hover:text-ink/60"
          >
            {publicCopy.home.classes.link} <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {activePrograms.map((service, index) => (
            <Link
              key={service.slug}
              to="/services"
              className={`group relative min-h-[340px] overflow-hidden bg-ink text-white ${index === 0 ? "sm:col-span-2 lg:col-span-1" : ""}`}
            >
              <ImageWithFallback
                src={service.image}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-65 transition duration-700 group-hover:scale-105 group-hover:opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="section-kicker !text-primary">
                  {service.category} · {service.duration}
                </p>
                <h3 className="mt-2 font-display text-2xl font-bold tracking-[-0.05em]">
                  {service.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-5 text-white/70">{service.summary}</p>
                <span className="mt-4 inline-flex size-9 items-center justify-center border border-white/40 transition group-hover:border-primary group-hover:bg-primary group-hover:text-ink">
                  <ArrowUpRight size={17} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="overflow-hidden bg-ink text-white">
        <div className="grid min-h-[520px] lg:grid-cols-2">
          <div className="relative min-h-[360px] overflow-hidden lg:min-h-[620px]">
            <ImageWithFallback
              src={siteImages.trainingFloor}
              alt={publicCopy.home.floor.imageAlt}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-ink/35" />
            <div className="absolute bottom-5 left-5 flex items-center gap-2 bg-primary px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-ink sm:bottom-8 sm:left-8">
              <Dumbbell size={17} /> {publicCopy.home.floor.badge}
            </div>
          </div>
          <div className="flex flex-col justify-center px-6 py-14 sm:px-12 lg:px-16">
            <p className="section-kicker !text-primary">{publicCopy.home.floor.eyebrow}</p>
            <h2 className="mt-4 max-w-xl font-display text-4xl font-bold leading-[0.97] tracking-[-0.065em] sm:text-6xl">
              {publicCopy.home.floor.title}
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/60">
              {publicCopy.home.floor.description}
            </p>
            <div className="mt-9 grid max-w-lg grid-cols-2 gap-5 border-t border-white/15 pt-6">
              <div className="flex gap-3">
                <Clock3 size={20} className="mt-0.5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-bold">{publicCopy.home.floor.hoursTitle}</p>
                  <p className="mt-1 text-xs text-white/55">{content.hours}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <ShieldCheck size={20} className="mt-0.5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-bold">{publicCopy.home.floor.supportTitle}</p>
                  <p className="mt-1 text-xs text-white/55">{publicCopy.home.floor.supportNote}</p>
                </div>
              </div>
            </div>
            <Link
              to="/about"
              className="mt-8 inline-flex w-fit items-center gap-2 text-sm font-bold text-primary"
            >
              {publicCopy.home.floor.link} <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="section-kicker">{publicCopy.home.coaches.eyebrow}</p>
            <h2 className="mt-3 font-display text-4xl font-bold leading-[0.98] tracking-[-0.065em] sm:text-6xl">
              {publicCopy.home.coaches.title}
            </h2>
            <p className="mt-5 max-w-md text-sm leading-6 text-ink/60">
              {publicCopy.home.coaches.description}
            </p>
            <Link to="/about" className="mt-7 inline-flex items-center gap-2 text-sm font-bold">
              {publicCopy.home.coaches.link} <ArrowRight size={17} />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {trainers.map((trainer) => (
              <div key={trainer.name} className="min-w-0">
                <div className="aspect-[3/4] overflow-hidden bg-secondary">
                  <ImageWithFallback
                    src={trainer.image}
                    alt={trainer.name}
                    loading="lazy"
                    className="h-full w-full object-cover grayscale transition duration-500 hover:grayscale-0"
                  />
                </div>
                <p className="mt-3 truncate font-display text-sm font-bold">{trainer.name}</p>
                <p className="mt-0.5 text-xs text-ink/55">{trainer.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-white">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-16 sm:px-8 md:grid-cols-[1fr_auto] md:items-center lg:px-12">
          <div>
            <p className="section-kicker">{publicCopy.home.firstVisit.eyebrow}</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-[-0.06em] sm:text-5xl">
              {publicCopy.home.firstVisit.title}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-ink/60">
              {publicCopy.home.firstVisit.description}
            </p>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <Link to="/contact" className="btn btn-primary">
              {publicCopy.home.firstVisit.button} <ArrowUpRight size={17} />
            </Link>
            <Link to="/projects" className="text-xs font-semibold text-ink/55 hover:text-ink">
              {publicCopy.home.firstVisit.scheduleLink}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="section-kicker">{publicCopy.home.memberships.eyebrow}</p>
            <h2 className="mt-3 font-display text-4xl font-bold leading-[0.98] tracking-[-0.065em] sm:text-6xl">
              {publicCopy.home.memberships.title}
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-ink/60">
              {publicCopy.home.memberships.description}
            </p>
            <Link to="/contact" className="mt-7 inline-flex items-center gap-2 text-sm font-bold">
              {publicCopy.home.memberships.link} <MoveUpRight size={17} />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {activePlans.map((plan) => (
              <div
                key={plan.name}
                className={`border p-5 ${plan.featured ? "border-ink bg-ink text-white" : "border-ink/15 bg-white"}`}
              >
                <p className={`section-kicker ${plan.featured ? "!text-primary" : ""}`}>
                  {plan.name}
                </p>
                <p className="mt-6 font-display text-3xl font-bold tracking-[-0.06em]">
                  {plan.price}
                </p>
                <p className={`mt-1 text-xs ${plan.featured ? "text-white/50" : "text-ink/50"}`}>
                  {plan.period}
                </p>
                <p
                  className={`mt-5 min-h-10 text-xs leading-5 ${plan.featured ? "text-white/70" : "text-ink/60"}`}
                >
                  {plan.description}
                </p>
                <Link
                  to="/contact"
                  className={`mt-5 inline-flex items-center gap-1 text-xs font-bold ${plan.featured ? "text-primary" : ""}`}
                >
                  {publicCopy.home.memberships.planCta} <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      {activeOffers[0] ? (
        <section className="bg-primary text-ink">
          <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-5 px-5 py-9 sm:px-8 md:flex-row md:items-center lg:px-12">
            <div>
              <p className="section-kicker">DEMO OFFER · ILLUSTRATIVE</p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-[-0.05em] sm:text-3xl">
                {activeOffers[0].title}
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-ink/70">{activeOffers[0].description}</p>
            </div>
            <Link to="/offers" className="btn btn-ink w-fit">
              Explore offers <ArrowUpRight size={16} />
            </Link>
          </div>
        </section>
      ) : null}
      <section className="border-y border-ink/10 bg-white">
        <div className="mx-auto grid max-w-[1440px] gap-6 px-5 py-10 sm:px-8 md:grid-cols-[1fr_auto] md:items-center lg:px-12">
          <div>
            <p className="section-kicker">COMMUNITY NOTE · ILLUSTRATIVE</p>
            <p className="mt-3 max-w-3xl font-display text-xl font-bold leading-relaxed tracking-[-0.04em] sm:text-2xl">
              “A gym should feel like a place you want to come back to. That’s the idea behind this
              demo.”
            </p>
            <p className="mt-2 text-xs text-ink/55">
              IRON DISTRICT demo team · Sample brand statement, not a customer testimonial
            </p>
          </div>
          <Link to="/facilities" className="text-sm font-bold">
            Explore facilities & gallery <ArrowRight size={16} className="ml-1 inline" />
          </Link>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
