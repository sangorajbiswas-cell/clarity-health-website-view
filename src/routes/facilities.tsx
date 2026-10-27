import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { useGymDemoData } from "@/hooks/use-gym-demo-data";

export const Route = createFileRoute("/facilities")({
  head: () => ({
    meta: [
      { title: "Facilities & gallery — IRON DISTRICT" },
      {
        name: "description",
        content: "Illustrative facilities and gallery for the IRON DISTRICT gym demo.",
      },
    ],
  }),
  component: FacilitiesPage,
});

function FacilitiesPage() {
  const { data } = useGymDemoData();
  const [selected, setSelected] = useState<number | null>(null);
  const images = data.gallery;
  const selectedImage = selected === null ? null : (images[selected] ?? null);

  function move(direction: number) {
    if (!images.length || selected === null) return;
    setSelected((selected + direction + images.length) % images.length);
  }

  return (
    <section className="min-h-[70vh] bg-paper px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto max-w-[1200px]">
        <p className="section-kicker">FACILITIES · ILLUSTRATIVE DEMO</p>
        <h1 className="mt-3 max-w-3xl font-display text-5xl font-bold leading-[0.92] tracking-[-0.075em] sm:text-7xl">
          Space to do the work.
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-6 text-ink/60">
          Sample facilities and imagery. This website is a fictional concept and does not claim that
          a real gym or facility exists.
        </p>
        {data.facilities.length ? (
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {data.facilities.map((facility) => (
              <article key={facility.id} className="border border-ink/10 bg-white">
                <ImageWithFallback
                  src={facility.image}
                  alt={facility.alt}
                  loading="lazy"
                  className="h-64 w-full object-cover"
                />
                <div className="p-5">
                  <h2 className="font-display text-2xl font-bold">{facility.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-ink/60">{facility.description}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-8 border border-dashed border-ink/25 p-8 text-sm text-ink/55">
            No demo facilities have been added.
          </p>
        )}
        <div className="mt-14">
          <h2 className="font-display text-3xl font-bold tracking-[-0.05em]">
            Photo gallery <span className="text-sm font-normal text-ink/45">· sample images</span>
          </h2>
          {images.length ? (
            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setSelected(index)}
                  aria-label={`Open image: ${image.caption}`}
                  className="group relative aspect-[4/3] overflow-hidden bg-secondary text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <ImageWithFallback
                    src={image.image}
                    alt={image.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 p-3 pt-10 text-left text-xs font-semibold text-white">
                    {image.caption}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="mt-5 text-sm text-ink/55">No demo gallery images have been added.</p>
          )}
        </div>
      </div>
      <Dialog
        open={selectedImage !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent
          aria-describedby="gallery-caption"
          className="max-w-5xl border-0 bg-ink p-3 text-white sm:p-5"
        >
          <DialogTitle className="sr-only">Gallery image preview</DialogTitle>
          {selectedImage ? (
            <>
              <ImageWithFallback
                src={selectedImage.image}
                alt={selectedImage.alt}
                className="max-h-[75vh] w-full object-contain"
              />
              <DialogDescription id="gallery-caption" className="text-center text-white/75">
                {selectedImage.caption}
              </DialogDescription>
              {images.length > 1 ? (
                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => move(-1)}
                    aria-label="Previous image"
                    className="flex size-10 items-center justify-center border border-white/25 text-white hover:bg-white/10"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(1)}
                    aria-label="Next image"
                    className="flex size-10 items-center justify-center border border-white/25 text-white hover:bg-white/10"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              ) : null}
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
