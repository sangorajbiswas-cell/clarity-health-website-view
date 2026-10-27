import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Check } from "lucide-react";
import { useGymDemoData } from "@/hooks/use-gym-demo-data";

export const Route = createFileRoute("/memberships")({
  head: () => ({ meta: [{ title: "Memberships — IRON DISTRICT" }] }),
  component: MembershipsPage,
});

function MembershipsPage() {
  const { data } = useGymDemoData();
  const plans = data.plans.filter((plan) => plan.active);

  return (
    <section className="min-h-[70vh] bg-paper px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto max-w-[1200px]">
        <p className="section-kicker">DEMO OPTIONS · ILLUSTRATIVE PRICING</p>
        <h1 className="mt-3 max-w-3xl font-display text-5xl font-bold leading-[0.92] tracking-[-0.075em] sm:text-7xl">
          Find your fit.
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-6 text-ink/60 sm:text-base">
          Sample plans for this fictional gym concept. Prices and inclusions are examples, not a
          real offer.
        </p>
        {plans.length ? (
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.id}
                className={`flex flex-col border p-6 ${plan.featured ? "border-ink bg-ink text-white" : "border-ink/15 bg-white"}`}
              >
                <p className={`section-kicker ${plan.featured ? "!text-primary" : ""}`}>
                  {plan.name}
                </p>
                {plan.featured ? (
                  <span className="mt-3 w-fit bg-primary px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-ink">
                    Recommended sample
                  </span>
                ) : null}
                <p className="mt-6 font-display text-4xl font-bold tracking-[-0.06em]">
                  {plan.price}
                </p>
                <p className={`mt-1 text-xs ${plan.featured ? "text-white/50" : "text-ink/50"}`}>
                  {plan.period}
                </p>
                <p className={`mt-5 text-sm ${plan.featured ? "text-white/70" : "text-ink/65"}`}>
                  {plan.description}
                </p>
                <ul className="mt-6 flex-1 space-y-3 border-t border-current/15 pt-5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check size={16} className="mt-0.5 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className={`mt-7 inline-flex items-center gap-2 text-sm font-bold ${plan.featured ? "text-primary" : "text-ink"}`}
                >
                  Ask about this plan <ArrowUpRight size={16} />
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-10 border border-dashed border-ink/25 p-8 text-sm text-ink/60">
            No demo plans are currently published.
          </p>
        )}
      </div>
    </section>
  );
}
