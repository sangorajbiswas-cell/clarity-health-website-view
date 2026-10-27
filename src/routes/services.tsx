import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Clock3, MoveUpRight, UserRound } from "lucide-react";
import { CtaBand } from "@/components/SiteChrome";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { publicCopy } from "@/content/site";
import { useGymDemoData } from "@/hooks/use-gym-demo-data";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Classes — IRON DISTRICT" },
      {
        name: "description",
        content: publicCopy.classesPage.description,
      },
    ],
  }),
  component: Classes,
});

function Classes() {
  const { data } = useGymDemoData();
  const services = data.programs;
  const [category, setCategory] = useState("All classes");
  const categories = ["All classes", ...new Set(services.map((service) => service.category))];
  const visible = services.filter(
    (service) => category === "All classes" || service.category === category,
  );

  return (
    <>
      <section className="relative overflow-hidden bg-ink px-5 py-20 text-white sm:px-8 sm:py-28 lg:px-12">
        <div className="absolute -right-10 -top-20 select-none font-display text-[38vw] font-bold leading-none tracking-[-0.1em] text-white/[0.035]">
          MOVE
        </div>
        <div className="relative mx-auto max-w-[1440px]">
          <p className="section-kicker !text-primary">{publicCopy.classesPage.eyebrow}</p>
          <h1 className="mt-4 max-w-4xl font-display text-6xl font-bold leading-[0.88] tracking-[-0.075em] sm:text-8xl">
            {publicCopy.classesPage.headline}
          </h1>
          <div className="mt-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <p className="max-w-md text-sm leading-6 text-white/60 sm:text-base">
              {publicCopy.classesPage.description}
            </p>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
              {publicCopy.classesPage.note}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="section-kicker">{publicCopy.classesPage.lineupEyebrow}</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-[-0.06em] sm:text-4xl">
              {publicCopy.classesPage.lineupTitle}
            </h2>
          </div>
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Filter classes by category"
          >
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
                className={`min-h-10 border px-4 text-xs font-bold transition ${category === item ? "border-ink bg-ink text-white" : "border-ink/15 bg-white hover:border-ink/45"}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((service, index) => (
            <article key={service.slug} className="group border border-ink/10 bg-white">
              <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                <ImageWithFallback
                  src={service.image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]">
                  {service.category}
                </span>
                <span className="absolute bottom-4 right-4 bg-ink/90 px-2.5 py-1.5 text-[10px] font-semibold text-white">
                  0{index + 1} / 0{services.length}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-4 text-[11px] font-semibold text-ink/50">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 size={14} />
                    {service.duration}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <UserRound size={14} />
                    {service.level}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-xl font-bold tracking-[-0.04em]">
                  {service.title}
                </h3>
                <p className="mt-2 min-h-12 text-sm leading-5 text-ink/60">{service.summary}</p>
                <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-4">
                  <span className="text-xs font-semibold text-ink/55">Coach {service.coach}</span>
                  <Link
                    to="/projects"
                    aria-label={`View ${service.title} schedule`}
                    className="inline-flex size-9 items-center justify-center border border-ink/15 transition hover:border-primary hover:bg-primary"
                  >
                    <MoveUpRight size={16} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-secondary">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-12 sm:px-8 md:grid-cols-[1fr_auto] md:items-center lg:px-12">
          <div>
            <p className="section-kicker">{publicCopy.classesPage.beginnerEyebrow}</p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-[-0.05em] sm:text-3xl">
              {publicCopy.classesPage.beginnerTitle}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/60">
              {publicCopy.classesPage.beginnerDescription}
            </p>
          </div>
          <Link to="/contact" className="btn btn-ink w-fit">
            {publicCopy.classesPage.beginnerCta} <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
