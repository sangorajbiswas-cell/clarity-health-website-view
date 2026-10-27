import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, HeartHandshake, Leaf, Sparkles } from "lucide-react";
import { ClinicImage } from "@/components/ClinicImage";
import { CtaBand } from "@/components/SiteChrome";
import { clinicImages } from "@/content/site";
import { useClinicDemoData } from "@/hooks/use-clinic-demo-data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About CLARITY HEALTH — A clinic website demo" },
      {
        name: "description",
        content:
          "Learn about the fictional CLARITY HEALTH website demonstration and its illustrative care philosophy.",
      },
    ],
  }),
  component: About,
});

function About() {
  const { data } = useClinicDemoData();
  const values = [
    {
      icon: HeartHandshake,
      title: "Human conversations",
      description: "Use clear, welcoming language and leave room for questions.",
    },
    {
      icon: Leaf,
      title: "A gentler experience",
      description: "Thoughtful details can make a clinic website easier to approach.",
    },
    {
      icon: Sparkles,
      title: "Clarity at each step",
      description: "Explain what a request does—and what it does not do.",
    },
  ];
  return (
    <>
      <section className="bg-forest-950 text-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sage-200">
            A fictional clinic experience
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl font-semibold leading-tight tracking-tight sm:text-7xl">
            A clearer way to introduce care.
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
            CLARITY HEALTH is a demonstration website, not a real clinic. It shows how clear
            information, warm design, and honest expectations can work together in a healthcare
            experience.
          </p>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-2 lg:items-center lg:px-10">
        <div>
          <p className="section-kicker">Our example approach</p>
          <h2 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight text-forest-950 sm:text-5xl">
            {data.home.aboutTitle}
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-forest-950/70 sm:text-base">
            {data.home.aboutDescription}
          </p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-forest-950/70">
            The names, clinician profiles, services, clinic details, sample requests, and quotations
            throughout this site are invented for a frontend demonstration. No patient data, medical
            history, or diagnosis is collected.
          </p>
          <Link to="/services" className="btn btn-forest mt-6 w-fit">
            Explore sample services <ArrowUpRight size={16} aria-hidden />
          </Link>
        </div>
        <div className="relative min-h-[350px] overflow-hidden rounded-[1.5rem] sm:min-h-[480px]">
          <ClinicImage
            src={clinicImages.consultation}
            alt="Illustrative healthcare consultation stock photo"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute bottom-4 left-4 rounded-xl bg-white/95 px-4 py-3 text-xs font-semibold text-forest-950">
            Stock imagery · fictional clinic demo
          </div>
        </div>
      </section>
      <section className="bg-sage-100/70">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-18 lg:px-10">
          <p className="section-kicker">What this example values</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-forest-950 sm:text-4xl">
            Design that respects the person.
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {values.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-2xl bg-white p-6">
                <Icon size={23} className="text-forest-700" aria-hidden />
                <h3 className="mt-5 font-display text-lg font-semibold text-forest-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-forest-950/70">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
