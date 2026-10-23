import { createFileRoute } from "@tanstack/react-router";
import { site, stats } from "@/content/site";
import { CtaBand } from "@/components/SiteChrome";
import img from "@/assets/project-2.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — BuildTrust Constructions" },
      { name: "description", content: "Who we are, how we work, and what you can expect when you build with BuildTrust." },
      { property: "og:title", content: "About BuildTrust Constructions" },
      { property: "og:description", content: "How we work and what to expect." },
    ],
  }),
  component: About,
});

function About() {
  const visible = stats.filter((s) => s.value);
  return (
    <>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2">
        <div>
          <p className="eyebrow">About us</p>
          <h1 className="mt-2 text-4xl font-extrabold">{site.name}</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            [Placeholder] Add your company story here — when you started, who leads the team, and the kind of work you specialise in. Only include facts you can verify.
          </p>
          <h2 className="mt-8 text-2xl font-bold">Our commitments</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>Itemised written estimates after site inspection</li>
            <li>Regular progress updates with photos</li>
            <li>Clear payment milestones tied to work stages</li>
            <li>Safe, tidy and respectful worksites</li>
          </ul>
          {visible.length > 0 && (
            <dl className="mt-8 grid grid-cols-3 gap-4">
              {visible.map((s) => <div key={s.label}><dt className="text-sm text-muted-foreground">{s.label}</dt><dd className="font-display text-3xl font-extrabold text-primary">{s.value}</dd></div>)}
            </dl>
          )}
        </div>
        <img src={img} alt="Building under construction" loading="lazy" width={1200} height={800} className="rounded-lg object-cover" />
      </section>
      <CtaBand />
    </>
  );
}
