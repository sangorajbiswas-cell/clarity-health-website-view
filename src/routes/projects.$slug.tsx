import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { projects, type Project } from "@/content/legacy-gym-site";
import { CtaBand } from "@/components/SiteChrome";
import { listProjects } from "@/lib/projects";

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    return { fallbackProject: projects.find((p) => p.slug === params.slug) ?? null };
  },
  head: () => ({
    meta: [
      { title: "Project details — portfolio demo" },
      {
        name: "description",
        content: "Explore a sample project gallery from the existing project tools.",
      },
    ],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-6xl px-4 py-20">
      <h1 className="text-3xl font-bold">Project not found</h1>
      <Link to="/projects" className="text-primary">
        Back to projects
      </Link>
    </div>
  ),
  component: ProjectDetail,
});

function ProjectDetail() {
  const { fallbackProject } = Route.useLoaderData();
  const { slug } = Route.useParams();
  const [project, setProject] = useState<Project | null>(fallbackProject);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let activeRequest = true;
    setProject(fallbackProject);
    setLoading(true);
    setActive(0);
    void listProjects({ publishedOnly: true })
      .then((publishedProjects) => {
        if (!activeRequest) return;
        const matchedProject = publishedProjects.find((entry) => entry.project.slug === slug);
        if (matchedProject) {
          setProject(matchedProject.project);
        } else if (publishedProjects.length > 0) {
          setProject(null);
        }
      })
      .catch((error: unknown) => {
        if (activeRequest) {
          console.error("Unable to load published project; using local content.", error);
        }
      })
      .finally(() => {
        if (activeRequest) setLoading(false);
      });
    return () => {
      activeRequest = false;
    };
  }, [fallbackProject, slug]);

  if (loading && !project) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-20" role="status">
        Loading project…
      </section>
    );
  }
  if (!project) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20">
        <h1 className="text-3xl font-bold">Project not found</h1>
        <Link to="/projects" className="text-primary">
          Back to projects
        </Link>
      </div>
    );
  }

  const p = project;
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-10">
        <Link to="/projects" className="text-sm font-semibold text-primary">
          ← All projects
        </Link>
        <p className="eyebrow mt-4">
          {p.category} · {p.status}
        </p>
        <h1 className="mt-2 text-4xl font-extrabold">{p.title}</h1>
        <p className="mt-2 flex items-center gap-1 text-muted-foreground">
          <MapPin size={16} aria-hidden /> {p.location}
        </p>
        <div className="mt-6 overflow-hidden rounded-lg">
          <img
            src={p.gallery[active] ?? p.cover}
            alt={`${p.title} — photo ${active + 1}`}
            width={1200}
            height={800}
            className="aspect-[3/2] w-full object-cover"
          />
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto" role="list" aria-label="Gallery">
          {p.gallery.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === active}
              className={`shrink-0 overflow-hidden rounded border-2 ${i === active ? "border-primary" : "border-transparent"}`}
            >
              <img
                src={img}
                alt=""
                loading="lazy"
                width={160}
                height={107}
                className="h-20 w-28 object-cover"
              />
            </button>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-lg">{p.description}</p>
      </section>
      <CtaBand />
    </>
  );
}
