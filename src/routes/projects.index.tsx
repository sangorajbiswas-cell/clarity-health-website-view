import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ProjectCard } from "@/components/SiteChrome";
import { usePublishedProjects } from "@/hooks/use-projects";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Projects — BuildTrust Constructions" },
      {
        name: "description",
        content: "Browse completed and ongoing residential, commercial and renovation projects.",
      },
      { property: "og:title", content: "Projects — BuildTrust Constructions" },
      { property: "og:description", content: "Completed and ongoing construction projects." },
    ],
  }),
  component: Projects,
});

const statuses = ["all", "completed", "ongoing"] as const;
const categories = ["All", "Residential", "Commercial", "Renovation"] as const;

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`btn !min-h-10 !py-2 capitalize ${active ? "btn-ink" : "border bg-card"}`}
    >
      {children}
    </button>
  );
}

function Projects() {
  const projects = usePublishedProjects();
  const [status, setStatus] = useState<(typeof statuses)[number]>("all");
  const [cat, setCat] = useState<(typeof categories)[number]>("All");
  const list = projects.filter(
    (p) => (status === "all" || p.status === status) && (cat === "All" || p.category === cat),
  );
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <p className="eyebrow">Portfolio</p>
      <h1 className="mt-2 text-4xl font-extrabold">Our projects</h1>
      <div className="mt-8 space-y-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
          {statuses.map((s) => (
            <Chip key={s} active={status === s} onClick={() => setStatus(s)}>
              {s}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {categories.map((c) => (
            <Chip key={c} active={cat === c} onClick={() => setCat(c)}>
              {c}
            </Chip>
          ))}
        </div>
      </div>
      <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
        {list.length} project{list.length === 1 ? "" : "s"}
      </p>
      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <ProjectCard key={p.slug} p={p} />
        ))}
      </div>
    </section>
  );
}
