import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin } from "lucide-react";
import { projects } from "@/content/site";
import { CtaBand } from "@/components/SiteChrome";

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const project = projects.find((p) => p.slug === params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.project.title} — BuildTrust Projects` },
          { name: "description", content: loaderData.project.summary },
          { property: "og:title", content: loaderData.project.title },
          { property: "og:description", content: loaderData.project.summary },
        ]
      : [{ title: "Project not found — BuildTrust" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-6xl px-4 py-20"><h1 className="text-3xl font-bold">Project not found</h1><Link to="/projects" className="text-primary">Back to projects</Link></div>
  ),
  component: ProjectDetail,
});

function ProjectDetail() {
  const { project: p } = Route.useLoaderData();
  const [active, setActive] = useState(0);
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-10">
        <Link to="/projects" className="text-sm font-semibold text-primary">← All projects</Link>
        <p className="eyebrow mt-4">{p.category} · {p.status}</p>
        <h1 className="mt-2 text-4xl font-extrabold">{p.title}</h1>
        <p className="mt-2 flex items-center gap-1 text-muted-foreground"><MapPin size={16} aria-hidden /> {p.location}</p>
        <div className="mt-6 overflow-hidden rounded-lg">
          <img src={p.gallery[active]} alt={`${p.title} — photo ${active + 1}`} width={1200} height={800} className="aspect-[3/2] w-full object-cover" />
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto" role="list" aria-label="Gallery">
          {p.gallery.map((img, i) => (
            <button key={i} onClick={() => setActive(i)} aria-label={`Show photo ${i + 1}`} aria-current={i === active} className={`shrink-0 overflow-hidden rounded border-2 ${i === active ? "border-primary" : "border-transparent"}`}>
              <img src={img} alt="" loading="lazy" width={160} height={107} className="h-20 w-28 object-cover" />
            </button>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-lg">{p.description}</p>
      </section>
      <CtaBand />
    </>
  );
}
