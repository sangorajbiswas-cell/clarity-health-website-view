import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ClinicImage } from "@/components/ClinicImage";
import { CtaBand } from "@/components/SiteChrome";
import { useClinicDemoData } from "@/hooks/use-clinic-demo-data";

export const Route = createFileRoute("/departments")({
  head: () => ({
    meta: [
      { title: "Departments — CLARITY HEALTH" },
      {
        name: "description",
        content: "Explore fictional sample departments in the CLARITY HEALTH website demo.",
      },
    ],
  }),
  component: Departments,
});

function Departments() {
  const { data } = useClinicDemoData();
  return (
    <>
      <section className="bg-sage-100/70">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
          <p className="section-kicker">A simple way to explore care</p>
          <h1 className="mt-3 max-w-4xl font-display text-5xl font-semibold leading-tight tracking-tight text-forest-950 sm:text-7xl">
            Sample departments.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-forest-950/70 sm:text-base">
            All departments and descriptions on this page are fictional demo content. They do not
            describe an operating clinic or specific medical services.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
        {data.departments.length ? (
          <div className="grid gap-5 sm:grid-cols-2">
            {data.departments.map((department) => (
              <article
                key={department.id}
                className="clinic-card grid overflow-hidden sm:grid-cols-[0.8fr_1.2fr]"
              >
                <div className="min-h-52 bg-sage-100 sm:min-h-64">
                  <ClinicImage
                    src={department.image}
                    alt="Illustrative stock photo representing a sample department"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-5 sm:p-7">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-forest-700">
                    Sample department
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-semibold text-forest-950">
                    {department.name}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-forest-950/70">
                    {department.description}
                  </p>
                  <p className="mt-4 text-xs text-forest-700">
                    Example profile: {department.leadDoctor}
                  </p>
                  <Link
                    to="/services"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-forest-800"
                  >
                    Browse sample services <ArrowRight size={15} aria-hidden />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed p-10 text-center text-sm">
            No sample departments are listed.
          </p>
        )}
      </section>
      <CtaBand />
    </>
  );
}
