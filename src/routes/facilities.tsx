import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ClinicImage } from "@/components/ClinicImage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useClinicDemoData } from "@/hooks/use-clinic-demo-data";
import type { ClinicFacility } from "@/lib/clinic-data";

export const Route = createFileRoute("/facilities")({
  head: () => ({
    meta: [
      { title: "Our spaces — CLARITY HEALTH demo" },
      {
        name: "description",
        content:
          "Fictional facility descriptions and illustrative stock images for the clinic website demo.",
      },
    ],
  }),
  component: Facilities,
});

function Facilities() {
  const { data } = useClinicDemoData();
  const [selected, setSelected] = useState<ClinicFacility | null>(null);
  return (
    <>
      <section className="bg-sage-100/70">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
          <p className="section-kicker">Spaces in our example</p>
          <h1 className="mt-3 max-w-4xl font-display text-5xl font-semibold leading-tight tracking-tight text-forest-950 sm:text-7xl">
            A calm place to begin.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-forest-950/70">
            All spaces and images are illustrative stock content. They do not depict a real CLARITY
            HEALTH clinic.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
        {data.facilities.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.facilities.map((facility) => (
              <button
                key={facility.id}
                type="button"
                onClick={() => setSelected(facility)}
                className="clinic-card group overflow-hidden text-left"
                aria-label={`View ${facility.name} sample image`}
              >
                <div className="aspect-[4/3] overflow-hidden bg-sage-100">
                  <ClinicImage
                    src={facility.image}
                    alt={facility.alt}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h2 className="font-display text-lg font-semibold text-forest-950">
                    {facility.name}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-forest-950/70">
                    {facility.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed p-10 text-center text-sm">
            No illustrative spaces have been added.
          </p>
        )}
      </section>
      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl">
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle>{selected.name}</DialogTitle>
                <DialogDescription>
                  Illustrative stock image · fictional clinic demo
                </DialogDescription>
              </DialogHeader>
              <div className="aspect-[16/10] overflow-hidden rounded-xl bg-sage-100">
                <ClinicImage
                  src={selected.image}
                  alt={selected.alt}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-sm leading-6 text-forest-950/70">{selected.description}</p>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
