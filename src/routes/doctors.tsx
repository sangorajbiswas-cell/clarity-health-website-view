import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, GraduationCap, MessageCircleHeart } from "lucide-react";
import { useMemo, useState } from "react";
import { ClinicImage } from "@/components/ClinicImage";
import { CtaBand } from "@/components/SiteChrome";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClinicDemoData } from "@/hooks/use-clinic-demo-data";
import type { ClinicDoctor } from "@/lib/clinic-data";

export const Route = createFileRoute("/doctors")({
  head: () => ({
    meta: [
      { title: "Our doctors — CLARITY HEALTH" },
      {
        name: "description",
        content:
          "Fictional sample doctor profiles for the CLARITY HEALTH clinic website demonstration.",
      },
    ],
  }),
  component: Doctors,
});

function Doctors() {
  const { data } = useClinicDemoData();
  const [specialty, setSpecialty] = useState("all");
  const [selected, setSelected] = useState<ClinicDoctor | null>(null);
  const specialties = useMemo(
    () => [...new Set(data.doctors.map((doctor) => doctor.specialty))],
    [data.doctors],
  );
  const doctors =
    specialty === "all"
      ? data.doctors
      : data.doctors.filter((doctor) => doctor.specialty === specialty);

  return (
    <>
      <section className="bg-sage-100/70">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
          <p className="section-kicker">The people behind the example</p>
          <h1 className="mt-3 max-w-4xl font-display text-5xl font-semibold leading-tight tracking-tight text-forest-950 sm:text-7xl">
            Meet our sample care team.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-forest-950/70 sm:text-base">
            Every profile below is fictional. Names, specialties, biographies, experience and
            qualifications are illustrative only, are not verified credentials, and do not represent
            real clinicians.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="section-kicker">Example profiles</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-forest-950">
              Our doctors
            </h2>
          </div>
          <label className="block w-full max-w-xs text-xs font-semibold text-forest-950">
            Filter by specialty
            <Select value={specialty} onValueChange={setSpecialty}>
              <SelectTrigger aria-label="Filter by specialty" className="mt-2 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All specialties</SelectItem>
                {specialties.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
        </div>

        {doctors.length ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doctor) => (
              <article key={doctor.id} className="clinic-card group overflow-hidden">
                <button
                  type="button"
                  className="block w-full text-left"
                  onClick={() => setSelected(doctor)}
                  aria-label={`View fictional profile for ${doctor.name}`}
                >
                  <div className="aspect-[4/3] overflow-hidden bg-sage-100">
                    <ClinicImage
                      src={doctor.image}
                      alt={`Illustrative stock portrait for fictional profile ${doctor.name}`}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-forest-700">
                      {doctor.specialty}
                    </p>
                    <h2 className="mt-2 font-display text-xl font-semibold text-forest-950">
                      {doctor.name}
                    </h2>
                    <p className="mt-2 text-sm text-forest-950/65">{doctor.experience}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-forest-800">
                      View sample profile <ArrowUpRight size={14} aria-hidden />
                    </span>
                  </div>
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-forest-900/20 p-10 text-center text-sm text-forest-950/65">
            No sample doctor profiles match this specialty.
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-14 sm:px-8 lg:px-10">
        <div className="flex items-start gap-4 rounded-2xl bg-sage-100 p-6 text-forest-950 sm:p-8">
          <GraduationCap size={22} className="mt-1 shrink-0 text-forest-700" aria-hidden />
          <div>
            <h2 className="font-display text-lg font-semibold">About sample qualifications</h2>
            <p className="mt-2 text-sm leading-6 text-forest-950/70">
              This demo intentionally does not claim or verify medical registration, qualifications,
              awards, or experience. Profile details are fictional placeholders for design
              demonstration.
            </p>
          </div>
        </div>
      </section>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl">
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle>{selected.name} · fictional profile</DialogTitle>
                <DialogDescription>
                  {selected.specialty} · illustrative sample only
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 aspect-[16/9] overflow-hidden rounded-xl bg-sage-100">
                <ClinicImage
                  src={selected.image}
                  alt={`Illustrative stock portrait for fictional profile ${selected.name}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-sm leading-6 text-forest-950/75">{selected.bio}</p>
              <p className="flex items-start gap-2 text-xs leading-5 text-forest-700">
                <MessageCircleHeart size={16} className="mt-0.5 shrink-0" aria-hidden />
                {selected.qualifications} Experience: {selected.experience}.
              </p>
              <Link to="/appointment" className="btn btn-forest w-fit">
                Request a conversation <ArrowUpRight size={15} aria-hidden />
              </Link>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
      <CtaBand />
    </>
  );
}
