import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Tag } from "lucide-react";
import { useGymDemoData } from "@/hooks/use-gym-demo-data";

export const Route = createFileRoute("/offers")({
  head: () => ({ meta: [{ title: "Offers — IRON DISTRICT" }] }),
  component: OffersPage,
});

function OffersPage() {
  const { data } = useGymDemoData();
  const offers = data.offers.filter((offer) => offer.active);
  return (
    <section className="min-h-[70vh] bg-ink px-5 py-16 text-white sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto max-w-[1200px]">
        <p className="section-kicker !text-primary">PROMOTIONS · DEMO CONTENT</p>
        <h1 className="mt-3 max-w-3xl font-display text-5xl font-bold leading-[0.92] tracking-[-0.075em] sm:text-7xl">
          A little extra motivation.
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-6 text-white/60">
          These illustrative promotions are for the demonstration only and do not represent real
          commercial offers.
        </p>
        {offers.length ? (
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {offers.map((offer) => (
              <article key={offer.id} className="border border-white/15 bg-white/[0.04] p-6 sm:p-8">
                <span className="flex size-11 items-center justify-center bg-primary text-ink">
                  <Tag size={20} />
                </span>
                <h2 className="mt-5 font-display text-3xl font-bold tracking-[-0.05em]">
                  {offer.title}
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-6 text-white/60">{offer.description}</p>
                {offer.code ? (
                  <p className="mt-5 w-fit border border-primary px-3 py-2 text-xs font-bold tracking-widest text-primary">
                    SAMPLE CODE: {offer.code}
                  </p>
                ) : null}
                <p className="mt-4 text-xs text-white/45">{offer.endDate}</p>
                <Link
                  to="/contact"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary"
                >
                  Ask about this offer <ArrowUpRight size={16} />
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-10 border border-dashed border-white/25 p-8 text-sm text-white/55">
            No demo offers are currently active.
          </p>
        )}
      </div>
    </section>
  );
}
