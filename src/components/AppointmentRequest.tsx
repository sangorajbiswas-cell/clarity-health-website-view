import { ArrowLeft, ArrowUpRight, CalendarDays, CheckCircle2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useClinicDemoData } from "@/hooks/use-clinic-demo-data";
import type { ClinicAppointmentRequest } from "@/lib/clinic-data";

export function AppointmentRequest() {
  const { data, setData, loaded } = useClinicDemoData();
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const name = String(values.get("name") ?? "").trim();
    const email = String(values.get("email") ?? "").trim();
    const phone = String(values.get("phone") ?? "").trim();
    const department = String(values.get("department") ?? "").trim();
    const preferredDoctor = String(values.get("doctor") ?? "").trim() || "No preference";
    const preferredDate = String(values.get("date") ?? "").trim() || "Flexible";
    if (name.length < 2) {
      setError("Enter a name with at least two characters.");
      return;
    }
    if (!phone && !email) {
      setError("Add a phone number or email so the demo clinic has a way to reply.");
      return;
    }
    if (phone && !/^\+?[\d ()-]{7,20}$/.test(phone)) {
      setError("Enter a valid phone number or leave it blank and provide an email.");
      return;
    }
    if (department && !data.departments.some((item) => item.name === department)) {
      setError("Choose a department from the list.");
      return;
    }
    if (
      preferredDoctor !== "No preference" &&
      !data.doctors.some((item) => item.name === preferredDoctor)
    ) {
      setError("Choose a doctor from the list.");
      return;
    }

    const request: ClinicAppointmentRequest = {
      id: `request-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name,
      email,
      phone,
      department,
      preferredDoctor,
      preferredDate,
      receivedAt: new Date().toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
      status: "New request",
    };
    setData((current) => ({ ...current, appointments: [request, ...current.appointments] }));
    setError("");
    setSubmitted(true);
    form.reset();
  }

  if (submitted) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
        <div
          className="rounded-3xl border border-forest-900/10 bg-white p-7 text-center shadow-sm sm:p-12"
          role="status"
        >
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-sage-100 text-forest-800">
            <CheckCircle2 size={26} aria-hidden />
          </span>
          <p className="section-kicker mt-6">Demo request recorded</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-forest-950">
            This is not a confirmed appointment.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-forest-950/70">
            The sample request has been saved only in this browser. No clinic received it and no
            availability was checked.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href="/" className="btn btn-forest">
              Return home <ArrowUpRight size={15} aria-hidden />
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-sage-100/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16 lg:px-10">
        <div>
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-forest-800"
          >
            <ArrowLeft size={15} aria-hidden /> Back home
          </a>
          <p className="section-kicker mt-8">A request, not a booking</p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight text-forest-950 sm:text-5xl">
            Request a conversation.
          </h1>
          <p className="mt-4 text-sm leading-7 text-forest-950/70">
            This fictional website demo saves a sample request in your browser. It does not contact
            a clinic, confirm a time, or provide medical advice.
          </p>
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-forest-900/10 bg-white p-4">
            <CalendarDays size={18} className="mt-0.5 shrink-0 text-forest-700" aria-hidden />
            <p className="text-xs leading-5 text-forest-950/70">
              Please do not enter medical histories, symptoms, diagnoses, identity details, or other
              sensitive information. The demo only needs contact and scheduling preferences.
            </p>
          </div>
        </div>

        <form
          onSubmit={submit}
          className="rounded-3xl border border-forest-900/10 bg-white p-5 shadow-sm sm:p-8"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-forest-700">
            Illustrative clinic details
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-forest-950">
              Your name
              <input
                name="name"
                autoComplete="name"
                required
                maxLength={100}
                className="field mt-2"
              />
            </label>
            <label className="text-xs font-semibold text-forest-950">
              Phone (optional)
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                maxLength={30}
                className="field mt-2"
              />
            </label>
            <label className="text-xs font-semibold text-forest-950 sm:col-span-2">
              Email (optional)
              <input
                name="email"
                type="email"
                autoComplete="email"
                maxLength={254}
                className="field mt-2"
              />
              <span className="mt-1 block font-normal text-forest-950/60">
                Provide at least one contact method.
              </span>
            </label>
            <label className="text-xs font-semibold text-forest-950">
              Sample department
              <select name="department" required defaultValue="" className="field mt-2">
                <option value="" disabled>
                  Choose an area
                </option>
                {data.departments.map((item) => (
                  <option key={item.id}>{item.name}</option>
                ))}
              </select>
            </label>
            <label className="text-xs font-semibold text-forest-950">
              Preferred sample doctor
              <select name="doctor" defaultValue="" className="field mt-2">
                <option value="">No preference</option>
                {data.doctors.map((item) => (
                  <option key={item.id}>{item.name}</option>
                ))}
              </select>
            </label>
            <label className="text-xs font-semibold text-forest-950 sm:col-span-2">
              Preferred date (optional)
              <input name="date" type="date" className="field mt-2" />
            </label>
          </div>
          {error ? (
            <p role="alert" className="mt-4 text-sm text-destructive">
              {error}
            </p>
          ) : null}
          {!loaded ? (
            <p role="status" className="mt-4 text-sm text-forest-950/60">
              Loading browser-local demo content…
            </p>
          ) : null}
          <button
            type="submit"
            disabled={!loaded}
            className="btn btn-forest mt-6 w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save demo request <ArrowUpRight size={16} aria-hidden />
          </button>
          <p className="mt-4 text-[11px] leading-5 text-forest-950/55">
            Browser-local demo only · Not sent · Not confirmed · No medical details
          </p>
        </form>
      </div>
    </section>
  );
}
