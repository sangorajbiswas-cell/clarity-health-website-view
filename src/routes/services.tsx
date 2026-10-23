import { createFileRoute } from "@tanstack/react-router";
import { Check, Info } from "lucide-react";
import { services } from "@/content/site";
import { CtaBand } from "@/components/SiteChrome";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services & Indicative Rates — BuildTrust Constructions" },
      { name: "description", content: "New homes, commercial buildings, renovations and interiors, with indicative rate guidance subject to site inspection." },
      { property: "og:title", content: "Services & Indicative Rates — BuildTrust" },
      { property: "og:description", content: "Construction services with transparent, indicative rate guidance." },
    ],
  }),
  component: Services,
});

function Services() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-14">
        <p className="eyebrow">Services</p>
        <h1 className="mt-2 text-4xl font-extrabold">What we build</h1>
        <div role="note" className="mt-6 flex gap-3 rounded-lg border border-primary/40 bg-accent p-4 text-accent-foreground">
          <Info className="shrink-0" aria-hidden />
          <p><strong>Indicative estimates only.</strong> Rates shown are sample guidance and not a quotation. Final pricing depends on design, materials, site conditions and is confirmed in writing after a site inspection.</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {services.map((s) => (
            <article key={s.slug} className="flex flex-col rounded-lg border bg-card p-6">
              <h2 className="text-2xl font-bold">{s.title}</h2>
              <p className="mt-2 text-muted-foreground">{s.summary}</p>
              <ul className="mt-4 space-y-1">
                {s.includes.map((i) => <li key={i} className="flex gap-2"><Check size={18} className="mt-0.5 text-primary" aria-hidden />{i}</li>)}
              </ul>
              <div className="mt-auto pt-6">
                <p className="text-xs font-bold uppercase text-muted-foreground">Indicative rate (estimate)*</p>
                <p className="font-display text-lg font-bold">{s.rateGuide}</p>
                <p className="text-xs text-muted-foreground">*Subject to site inspection</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
