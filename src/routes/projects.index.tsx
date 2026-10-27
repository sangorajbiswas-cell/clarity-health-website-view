import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, Clock3, MapPin, UserRound } from "lucide-react";
import { CtaBand } from "@/components/SiteChrome";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { publicCopy } from "@/content/site";
import { useGymDemoData } from "@/hooks/use-gym-demo-data";
import { useSiteContent } from "@/hooks/use-site-content";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Class schedule — IRON DISTRICT" },
      {
        name: "description",
        content: publicCopy.schedulePage.description,
      },
    ],
  }),
  component: Schedule,
});

const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;
const dayNames: Record<(typeof days)[number], string> = {
  MON: "Monday",
  TUE: "Tuesday",
  WED: "Wednesday",
  THU: "Thursday",
  FRI: "Friday",
  SAT: "Saturday",
  SUN: "Sunday",
};
function Schedule() {
  const { data } = useGymDemoData();
  const { content } = useSiteContent();
  const [day, setDay] = useState<(typeof days)[number]>("MON");
  const weeklySchedule = data.sessions;
  const sessions = weeklySchedule.filter((session) => session.day === day);

  useEffect(() => {
    setDay(days[(new Date().getDay() + 6) % 7] ?? "MON");
  }, []);

  return (
    <>
      <section className="bg-ink px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <p className="section-kicker !text-primary">{publicCopy.schedulePage.eyebrow}</p>
          <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="font-display text-6xl font-bold leading-[0.88] tracking-[-0.075em] sm:text-8xl">
                {publicCopy.schedulePage.headline}
              </h1>
              <p className="mt-6 max-w-lg text-sm leading-6 text-white/60 sm:text-base">
                {publicCopy.schedulePage.description}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-white/50">
              <MapPin size={15} className="text-primary" /> {content.address}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink/50">
          <CalendarDays size={15} /> {publicCopy.schedulePage.locationLabel}
        </div>
        <Tabs
          value={day}
          onValueChange={(value) => {
            const selectedDay = days.find((item) => item === value);
            if (selectedDay) setDay(selectedDay);
          }}
          className="mt-4"
        >
          <TabsList
            aria-label="Select a day"
            className="grid h-auto w-full grid-cols-7 rounded-none border-y border-ink/15 bg-transparent p-0"
          >
            {days.map((item) => (
              <TabsTrigger
                key={item}
                value={item}
                className="min-h-[64px] rounded-none border-r border-ink/10 text-xs font-bold tracking-[0.12em] last:border-r-0 data-[state=active]:bg-primary data-[state=active]:text-ink data-[state=active]:shadow-none sm:min-h-[76px] sm:text-sm"
              >
                {item}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={day} className="mt-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="section-kicker">
                  {publicCopy.schedulePage.sessionTitlePrefix} {dayNames[day]}{" "}
                  {publicCopy.schedulePage.sessionTitleSuffix}
                </p>
                <h2 className="mt-2 font-display text-3xl font-bold tracking-[-0.055em]">
                  {sessions.length} {publicCopy.schedulePage.sessionsDescription}
                </h2>
              </div>
              <p className="hidden text-xs text-ink/45 sm:block">
                {publicCopy.schedulePage.bookingCta}
              </p>
            </div>
            <div className="mt-6 divide-y divide-ink/10 border-y border-ink/15">
              {sessions.map((session, index) => (
                <article
                  key={session.id}
                  className="grid gap-4 py-5 sm:grid-cols-[100px_1fr_auto] sm:items-center sm:gap-6 sm:py-6"
                >
                  <div className="flex items-center gap-2 font-display text-xl font-bold tracking-[-0.04em]">
                    <Clock3 size={16} className="text-ink/40" /> {session.time}
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="hidden size-11 shrink-0 items-center justify-center bg-secondary font-display text-xs font-bold text-ink/55 sm:flex">
                      0{index + 1}
                    </span>
                    <div>
                      <p className="section-kicker">{session.category}</p>
                      <h3 className="mt-1 font-display text-xl font-bold tracking-[-0.04em]">
                        {session.className}
                      </h3>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-ink/50">
                        <UserRound size={13} /> {session.coach} <span className="mx-1">·</span>{" "}
                        {session.spots} spots left
                      </p>
                    </div>
                  </div>
                  <Link to="/contact" className="btn btn-outline !min-h-10 !px-4 !py-2 text-xs">
                    {publicCopy.schedulePage.bookingCta} <ArrowRight size={14} />
                  </Link>
                </article>
              ))}
              {sessions.length === 0 ? (
                <p className="py-8 text-sm text-ink/55">
                  No demo sessions are listed for this day.
                </p>
              ) : null}
            </div>
            <p className="mt-5 text-xs leading-5 text-ink/45">
              {publicCopy.schedulePage.disclaimer}
            </p>
          </TabsContent>
        </Tabs>
      </section>
      <CtaBand />
    </>
  );
}
