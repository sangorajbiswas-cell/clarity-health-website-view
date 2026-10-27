import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, HeartHandshake, MoveUpRight, Sparkles } from "lucide-react";
import { CtaBand } from "@/components/SiteChrome";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { publicCopy, siteImages } from "@/content/site";
import { useGymDemoData } from "@/hooks/use-gym-demo-data";
import { useSiteContent } from "@/hooks/use-site-content";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our story — IRON DISTRICT" },
      { name: "description", content: publicCopy.aboutPage.description },
    ],
  }),
  component: About,
});

const valueIcons = [HeartHandshake, Sparkles, MoveUpRight];

function About() {
  const { data } = useGymDemoData();
  const { content } = useSiteContent();
  const trainers = data.trainers;
  return (
    <>
      <section className="relative overflow-hidden bg-ink px-5 py-20 text-white sm:px-8 sm:py-28 lg:px-12">
        <div className="absolute -bottom-16 -right-4 select-none font-display text-[36vw] font-bold leading-none tracking-[-0.1em] text-white/[0.035]">
          ID
        </div>
        <div className="relative mx-auto max-w-[1440px]">
          <p className="section-kicker !text-primary">{publicCopy.aboutPage.heroEyebrow}</p>
          <h1 className="mt-4 max-w-5xl font-display text-6xl font-bold leading-[0.88] tracking-[-0.08em] sm:text-8xl">
            {publicCopy.aboutPage.headline}
          </h1>
          <p className="mt-8 max-w-lg text-base leading-7 text-white/60">
            {publicCopy.aboutPage.description}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-20 lg:px-12">
        <div>
          <p className="section-kicker">{publicCopy.aboutPage.storyEyebrow}</p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl font-bold leading-[0.96] tracking-[-0.065em] sm:text-6xl">
            {publicCopy.aboutPage.storyTitle}
          </h2>
          <div className="mt-6 max-w-xl space-y-4 text-sm leading-6 text-ink/60 sm:text-base">
            {publicCopy.aboutPage.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <Link to="/services" className="mt-7 inline-flex items-center gap-2 text-sm font-bold">
            {publicCopy.aboutPage.storyLink} <ArrowRight size={17} />
          </Link>
        </div>
        <div className="relative min-h-[420px] overflow-hidden bg-ink">
          <ImageWithFallback
            src={siteImages.story}
            alt={publicCopy.aboutPage.imageAlt}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/55 to-transparent" />
          <div className="absolute bottom-5 left-5 flex items-center gap-3 text-white sm:bottom-8 sm:left-8">
            <span className="flex size-11 items-center justify-center bg-primary text-ink">
              <Sparkles size={20} />
            </span>
            <p className="font-display text-sm font-bold">{publicCopy.aboutPage.imageCaption}</p>
          </div>
        </div>
      </section>

      <section className="bg-primary">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-12 sm:px-8 md:grid-cols-3 lg:px-12">
          {publicCopy.aboutPage.values.map((item, index) => {
            const Icon = valueIcons[index] ?? Sparkles;
            return (
              <article key={item.title} className="border-t border-ink/20 pt-5">
                <Icon size={22} strokeWidth={1.8} />
                <h2 className="mt-5 font-display text-xl font-bold tracking-[-0.04em]">
                  {item.title}
                </h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-ink/65">{item.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="section-kicker">{publicCopy.aboutPage.coachesEyebrow}</p>
            <h2 className="mt-2 font-display text-4xl font-bold tracking-[-0.065em] sm:text-5xl">
              {publicCopy.aboutPage.coachesTitle}
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-ink/60">
            {publicCopy.aboutPage.coachesDescription}
          </p>
        </div>
        <div className="mt-9 grid gap-5 sm:grid-cols-3">
          {trainers.map((trainer) => (
            <article key={trainer.name} className="group">
              <div className="aspect-[4/5] overflow-hidden bg-secondary">
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex items-start justify-between gap-3 border-b border-ink/15 py-4">
                <div>
                  <h3 className="font-display text-lg font-bold">{trainer.name}</h3>
                  <p className="mt-0.5 text-xs text-ink/55">{trainer.role}</p>
                </div>
                <span className="mt-1 inline-flex size-8 items-center justify-center border border-ink/15">
                  <MoveUpRight size={15} />
                </span>
              </div>
              <p className="mt-3 text-xs font-semibold text-ink/50">
                {trainer.specialties.join(" · ")}
              </p>
              <p className="mt-1 text-[11px] text-ink/45">
                {trainer.experience} · Illustrative profile
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-ink/10 bg-white">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-5 py-12 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <div>
            <p className="section-kicker">{publicCopy.aboutPage.visitEyebrow}</p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-[-0.05em]">
              {publicCopy.aboutPage.visitTitle}
            </h2>
            <p className="mt-1 text-sm text-ink/55">
              {content.hours} · {content.address}
            </p>
          </div>
          <Link to="/contact" className="btn btn-ink w-fit">
            {publicCopy.aboutPage.visitCta} <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
