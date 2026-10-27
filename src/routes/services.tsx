import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { useMemo, useState } from "react";
import { ClinicImage } from "@/components/ClinicImage";
import { CtaBand } from "@/components/SiteChrome";
import { useClinicDemoData } from "@/hooks/use-clinic-demo-data";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Care & services — CLARITY HEALTH" },
      {
        name: "description",
        content:
          "Illustrative clinic services and departments for this fictional healthcare website demo.",
      },
    ],
  }),
  component: Services,
});

function Services() {
  const { data } = useClinicDemoData();
  const categories = useMemo(
    () => [...new Set(data.services.map((service) => service.department))],
    [data.services],
  );
  const [department, setDepartment] = useState("All services");
  const filtered =
    department === "All services"
      ? data.services
      : data.services.filter((service) => service.department === department);

  return (
    <>
      <section className="bg-sage-100/70">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
          <p className="section-kicker">Clear information, gentle next steps</p>
          <h1 className="mt-3 max-w-4xl font-display text-5xl font-semibold leading-tight tracking-tight text-forest-950 sm:text-7xl">
            Care and services.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-forest-950/70 sm:text-base">
            These example service descriptions are fictional placeholders for a website design demo.
            They are not medical advice, treatment guidance, or a representation of services offered
            by a real clinic.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="section-kicker">Illustrative directory</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-forest-950">
              Explore the sample services
            </h2>
          </div>
          <label className="block w-full max-w-xs text-xs font-semibold text-forest-950">
            Filter by department
            <select
              className="field mt-2"
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
            >
              <option>All services</option>
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>
        </div>
        {filtered.length ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((service) => (
              <article key={service.id} className="clinic-card overflow-hidden">
                <div className="aspect-[16/10] overflow-hidden bg-sage-100">
                  <ClinicImage
                    src={service.image}
                    alt="Illustrative healthcare stock imagery"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-forest-700">
                    {service.department}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-semibold text-forest-950">
                    {service.name}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-forest-950/70">{service.description}</p>
                  <p className="mt-4 flex items-center gap-2 text-xs text-forest-700">
                    <Clock3 size={15} aria-hidden /> {service.visitLength} · sample only
                  </p>
                  <Link
                    to="/appointment"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-forest-800"
                  >
                    Request a conversation <ArrowUpRight size={15} aria-hidden />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-8 rounded-xl border border-dashed border-forest-900/20 p-10 text-center text-sm text-forest-950/65">
            No example services in this department yet.
          </p>
        )}
      </section>
      <CtaBand />
    </>
  );
}
