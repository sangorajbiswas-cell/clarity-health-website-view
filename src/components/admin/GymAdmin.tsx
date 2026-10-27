import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  Activity,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CirclePlus,
  CreditCard,
  Dumbbell,
  Images,
  Inbox,
  LayoutDashboard,
  Menu,
  Megaphone,
  RotateCcw,
  Search,
  Settings2,
  Trash2,
  UserRound,
  UsersRound,
  Building2,
  type LucideIcon,
} from "lucide-react";
import { ProjectManager } from "@/components/admin/ProjectManager";
import { GymCatalog } from "@/components/admin/GymCatalog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useGymDemoData } from "@/hooks/use-gym-demo-data";
import { useSiteContent } from "@/hooks/use-site-content";
import type {
  GymDemoData as DemoData,
  GymClass,
  GymMember as Member,
  GymLead as Lead,
  GymPlan as Plan,
  GymSession as Session,
  GymTrainer as Trainer,
} from "@/lib/gym-data";
import { defaultSiteContent, type SiteContent } from "@/lib/site-content";

const sections = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "members", label: "Members", icon: UsersRound },
  { id: "classes", label: "Classes", icon: Dumbbell },
  { id: "programs", label: "Programs", icon: Activity },
  { id: "schedule", label: "Schedule", icon: CalendarDays },
  { id: "trainers", label: "Trainers", icon: UserRound },
  { id: "plans", label: "Memberships", icon: CreditCard },
  { id: "offers", label: "Offers", icon: Megaphone },
  { id: "facilities", label: "Facilities", icon: Building2 },
  { id: "gallery", label: "Gallery", icon: Images },
  { id: "leads", label: "Enquiries", icon: Inbox },
  { id: "website", label: "Settings", icon: Settings2 },
  { id: "portfolio", label: "Portfolio tools", icon: BriefcaseBusiness },
] as const;

type SectionId = (typeof sections)[number]["id"];

const sectionPaths: Record<SectionId, string> = {
  overview: "",
  members: "members",
  classes: "classes",
  programs: "programs",
  schedule: "schedule",
  trainers: "trainers",
  plans: "memberships",
  offers: "offers",
  facilities: "facilities",
  gallery: "gallery",
  leads: "enquiries",
  website: "settings",
  portfolio: "portfolio",
};

const pathSections = Object.fromEntries(
  Object.entries(sectionPaths).map(([id, path]) => [path, id]),
) as Record<string, SectionId>;

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function SectionHeading({
  eyebrow,
  title,
  detail,
  action,
}: {
  eyebrow: string;
  title: string;
  detail: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="section-kicker !text-ink/45">{eyebrow}</p>
        <h2 className="mt-1 font-display text-3xl font-bold tracking-[-0.06em]">{title}</h2>
        <p className="mt-1 text-sm text-ink/55">{detail}</p>
      </div>
      {action}
    </div>
  );
}

function Metric({
  label,
  value,
  note,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string;
  note: string;
  icon: LucideIcon;
  trend?: string;
}) {
  return (
    <article className="border border-ink/10 bg-white p-5">
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold text-ink/55">{label}</span>
        <span className="flex size-9 items-center justify-center bg-secondary text-ink/70">
          <Icon size={17} />
        </span>
      </div>
      <p className="mt-5 font-display text-3xl font-bold tracking-[-0.06em]">{value}</p>
      <p className="mt-1 text-[11px] text-ink/45">
        {trend ? <span className="mr-1 font-bold text-emerald-700">{trend}</span> : null}
        {note}
      </p>
    </article>
  );
}

function AdminSidebar({
  activeSection,
  countNewLeads,
  onNavigate,
}: {
  activeSection: SectionId;
  countNewLeads: number;
  onNavigate: (section: SectionId) => void;
}) {
  return (
    <div className="flex h-full w-[260px] flex-col bg-ink text-white">
      <div className="flex h-[76px] items-center border-b border-white/10 px-6">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center bg-primary text-ink">
            <Dumbbell size={19} strokeWidth={2.5} />
          </span>
          <span className="font-display text-sm font-bold leading-[0.94] tracking-[-0.05em]">
            IRON
            <br />
            DISTRICT
          </span>
        </Link>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-7">
        <p className="px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-white/35">
          Workspace
        </p>
        <nav className="mt-3 space-y-1" aria-label="Admin sections">
          {sections.map(({ id, label, icon: Icon }) => {
            const selected = id === activeSection;
            return (
              <button
                type="button"
                key={id}
                aria-current={selected ? "page" : undefined}
                aria-label={label}
                onClick={() => onNavigate(id)}
                className={`flex min-h-11 w-full items-center gap-3 px-3 text-left text-xs font-semibold transition ${selected ? "bg-primary text-ink" : "text-white/65 hover:bg-white/10 hover:text-white"}`}
              >
                <Icon size={17} />
                <span>{label}</span>
                {id === "leads" && countNewLeads > 0 ? (
                  <span className="ml-auto bg-white/15 px-1.5 py-0.5 text-[10px]">
                    {countNewLeads}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto border-t border-white/10 p-4">
        <div className="flex items-center gap-3 px-2 py-2">
          <span className="flex size-9 items-center justify-center rounded-full bg-white/10 text-xs font-bold">
            ID
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-bold">Studio manager</p>
            <p className="mt-0.5 text-[10px] text-white/45">Demo workspace</p>
          </div>
          <span className="ml-auto size-2 rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
}

export function GymAdmin() {
  const navigateRouter = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { data, setData, loaded, storageError, resetData } = useGymDemoData();
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [toast, setToast] = useState("");
  const { content, updateContent, storageError: siteStorageError } = useSiteContent();
  const requestedPath = pathname.split("/")[2] ?? "";
  const activeSection = pathSections[requestedPath] ?? "overview";
  const activeSectionData =
    sections.find((section) => section.id === activeSection) ?? sections[0]!;
  const visibleStorageError = storageError || siteStorageError;

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  function resetDemo() {
    if (!window.confirm("Reset all demo records and website settings to their sample state?"))
      return;
    resetData();
    updateContent(defaultSiteContent);
    window.localStorage.removeItem("iron-district-site-content");
    notify("Demo data reset.");
  }

  function navigate(section: SectionId) {
    const path = sectionPaths[section];
    if (path) {
      void navigateRouter({ to: "/admin/$section", params: { section: path } });
    } else {
      void navigateRouter({ to: "/admin" });
    }
    setNavigationOpen(false);
  }

  const countNewLeads = data.leads.filter((lead) => lead.status === "New").length;

  return (
    <div className="flex min-h-screen bg-[#f2f3ef] text-ink">
      <aside className="hidden w-[260px] shrink-0 md:flex">
        <AdminSidebar
          activeSection={activeSection}
          countNewLeads={countNewLeads}
          onNavigate={navigate}
        />
      </aside>
      <Sheet open={navigationOpen} onOpenChange={setNavigationOpen}>
        <SheetContent
          side="left"
          aria-label="Admin navigation"
          className="w-[260px] border-0 bg-ink p-0 text-white sm:max-w-[260px]"
        >
          <AdminSidebar
            activeSection={activeSection}
            countNewLeads={countNewLeads}
            onNavigate={navigate}
          />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex min-h-[76px] items-center justify-between border-b border-ink/10 bg-paper/95 px-4 backdrop-blur sm:px-7 lg:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setNavigationOpen(true)}
              aria-label="Open navigation"
              aria-expanded={navigationOpen}
              className="flex size-10 items-center justify-center border border-ink/15 md:hidden"
            >
              <Menu size={19} />
            </button>
            <div className="min-w-0">
              <p className="hidden text-[9px] font-bold uppercase tracking-[0.17em] text-ink/40 sm:block">
                IRON DISTRICT / DEMO ADMIN
              </p>
              <h1 className="truncate font-display text-xl font-bold tracking-[-0.05em] sm:text-2xl">
                {activeSectionData.label}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 text-[10px] font-semibold text-ink/45 sm:flex">
              <span className="size-1.5 rounded-full bg-emerald-500" /> Demo data
            </span>
            <button
              type="button"
              onClick={resetDemo}
              className="flex size-10 items-center justify-center border border-ink/15 text-ink/65 transition hover:border-ink hover:text-ink"
              aria-label="Reset demo data"
              title="Reset demo data"
            >
              <RotateCcw size={16} />
            </button>
            <Link to="/" className="btn btn-ink !min-h-10 !px-3 !text-[11px] sm:!px-4">
              View Website <ArrowUpRight size={14} />
            </Link>
          </div>
        </header>

        <main className="w-full flex-1 px-4 py-6 sm:px-7 sm:py-8 lg:px-10">
          <div className="mx-auto max-w-[1280px]">
            {visibleStorageError ? (
              <div
                role="alert"
                className="mb-5 flex items-center justify-between gap-4 border border-red-300 bg-red-50 px-4 py-3 text-xs text-red-900"
              >
                {visibleStorageError}
                <button type="button" onClick={resetDemo} className="shrink-0 font-bold underline">
                  Reset data
                </button>
              </div>
            ) : null}
            {toast ? (
              <p
                role="status"
                className="fixed bottom-5 right-5 z-50 bg-ink px-5 py-3 text-xs font-semibold text-white shadow-xl"
              >
                {toast}
              </p>
            ) : null}
            {!loaded ? (
              <p role="status" className="text-sm text-ink/50">
                Loading demo workspace…
              </p>
            ) : null}
            {loaded ? (
              <>
                {activeSection === "overview" ? (
                  <Overview data={data} onNavigate={navigate} />
                ) : null}
                {activeSection === "members" ? (
                  <Members data={data} setData={setData} notify={notify} />
                ) : null}
                {activeSection === "classes" ? (
                  <Classes data={data} setData={setData} notify={notify} />
                ) : null}
                {activeSection === "programs" ? <GymCatalog kind="programs" /> : null}
                {activeSection === "schedule" ? (
                  <Schedule data={data} setData={setData} notify={notify} />
                ) : null}
                {activeSection === "trainers" ? <GymCatalog kind="trainers" /> : null}
                {activeSection === "plans" ? <GymCatalog kind="plans" /> : null}
                {activeSection === "offers" ? <GymCatalog kind="offers" /> : null}
                {activeSection === "facilities" ? <GymCatalog kind="facilities" /> : null}
                {activeSection === "gallery" ? <GymCatalog kind="gallery" /> : null}
                {activeSection === "leads" ? <VisitRequests data={data} setData={setData} /> : null}
                {activeSection === "website" ? (
                  <WebsiteContent content={content} updateContent={updateContent} notify={notify} />
                ) : null}
                {activeSection === "portfolio" ? <PortfolioTools /> : null}
                <Outlet />
              </>
            ) : null}
          </div>
        </main>
        <footer className="border-t border-ink/10 px-4 py-4 text-center text-[10px] text-ink/40 sm:px-7 lg:px-10">
          Demo data is stored in this browser only. No account or authentication is required.
        </footer>
      </div>
    </div>
  );
}

function Overview({ data, onNavigate }: { data: DemoData; onNavigate: (id: SectionId) => void }) {
  const nextSessions = data.sessions.slice(0, 4);
  return (
    <>
      <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="section-kicker !text-ink/45">Tuesday · Studio overview</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-[-0.065em] sm:text-4xl">
            Good morning, manager.
          </h2>
          <p className="mt-1 text-sm text-ink/55">
            Here’s what’s happening around the District today.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("schedule")}
          className="btn btn-primary w-fit !min-h-10 !text-xs"
        >
          View today’s schedule <ArrowUpRight size={15} />
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Metric
          label="Workout programs"
          value={String(data.programs.length)}
          note="Published demo programs"
          icon={Dumbbell}
        />
        <Metric
          label="Trainers"
          value={String(data.trainers.length)}
          note="Illustrative profiles"
          icon={UserRound}
        />
        <Metric
          label="Memberships"
          value={String(data.plans.length)}
          note="Demo plan options"
          icon={CreditCard}
        />
        <Metric
          label="Active offers"
          value={String(data.offers.filter((offer) => offer.active).length)}
          note="Promotions on the site"
          icon={Activity}
        />
        <Metric
          label="Demo enquiries"
          value={String(data.leads.length)}
          note="Fictional + submitted"
          icon={Inbox}
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
        <section className="border border-ink/10 bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="section-kicker">Floor activity</p>
              <h3 className="mt-1 font-display text-lg font-bold">Weekly check-ins</h3>
            </div>
            <span className="border border-ink/10 px-2.5 py-1 text-[10px] font-semibold text-ink/50">
              DEMO DATA
            </span>
          </div>
          <div className="mt-7 flex h-48 items-end justify-between gap-2 border-b border-ink/10 pb-2 sm:gap-4">
            {[
              { day: "MON", value: 58 },
              { day: "TUE", value: 75 },
              { day: "WED", value: 48 },
              { day: "THU", value: 88 },
              { day: "FRI", value: 63 },
              { day: "SAT", value: 100 },
              { day: "SUN", value: 42 },
            ].map((item) => (
              <div
                key={item.day}
                className="flex h-full flex-1 flex-col items-center justify-end gap-2"
              >
                <div className="flex w-full flex-1 items-end">
                  <span
                    className={`w-full ${item.day === "TUE" ? "bg-primary" : "bg-ink/10"}`}
                    style={{ height: `${item.value}%` }}
                  />
                </div>
                <span className="text-[9px] font-bold tracking-[0.1em] text-ink/45">
                  {item.day}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[10px] text-ink/40">
            Illustrative attendance chart — sample values only.
          </p>
        </section>

        <section className="border border-ink/10 bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="section-kicker">Up next</p>
              <h3 className="mt-1 font-display text-lg font-bold">Next demo sessions</h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("schedule")}
              className="text-[10px] font-bold"
            >
              All sessions <ArrowUpRight size={13} className="ml-1 inline" />
            </button>
          </div>
          <div className="mt-4 divide-y divide-ink/10">
            {nextSessions.map((session) => (
              <div key={session.id} className="flex items-center gap-3 py-3">
                <span className="font-display text-sm font-bold">{session.time}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold">{session.className}</p>
                  <p className="mt-0.5 text-[10px] text-ink/50">
                    {session.coach} · {session.day}
                  </p>
                </div>
                <span className="text-[10px] text-ink/45">{session.spots} spots</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-5 border border-ink/10 bg-white">
        <div className="flex items-center justify-between border-b border-ink/10 p-4">
          <div>
            <p className="section-kicker">Recent enquiries</p>
            <h3 className="mt-1 font-display text-lg font-bold">Latest demo requests</h3>
          </div>
          <button type="button" onClick={() => onNavigate("leads")} className="text-xs font-bold">
            Manage enquiries <ArrowUpRight size={14} className="ml-1 inline" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <Table className="min-w-[560px] text-xs">
            <TableHeader className="bg-secondary/60 text-[9px] uppercase tracking-[0.12em] text-ink/50">
              <TableRow>
                <TableHead className="px-4 py-3">Visitor</TableHead>
                <TableHead className="px-4 py-3">Interest</TableHead>
                <TableHead className="px-4 py-3">Received</TableHead>
                <TableHead className="px-4 py-3">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-ink/10">
              {data.leads.slice(0, 5).map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="px-4 py-3 font-semibold">
                    {lead.name}
                    <span className="block text-[10px] font-normal text-ink/50">{lead.email}</span>
                  </TableCell>
                  <TableCell className="px-4 py-3">{lead.interest}</TableCell>
                  <TableCell className="px-4 py-3 text-ink/55">{lead.received}</TableCell>
                  <TableCell className="px-4 py-3">{lead.status}</TableCell>
                </TableRow>
              ))}
              {data.leads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="px-4 py-8 text-center text-ink/50">
                    No demo enquiries yet.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            id: "members" as const,
            title: "Member directory",
            text: "Add and manage member records.",
            icon: UsersRound,
          },
          {
            id: "classes" as const,
            title: "Class lineup",
            text: "Edit what’s happening on the floor.",
            icon: Dumbbell,
          },
          {
            id: "leads" as const,
            title: "Visit requests",
            text: "Follow up with prospective members.",
            icon: Inbox,
          },
          {
            id: "website" as const,
            title: "Website details",
            text: "Update the info your visitors see.",
            icon: Settings2,
          },
        ].map(({ id, title, text, icon: Icon }) => (
          <button
            type="button"
            key={id}
            onClick={() => onNavigate(id)}
            className="group border border-ink/10 bg-white p-4 text-left transition hover:border-ink/35"
          >
            <Icon size={17} className="text-ink/55" />
            <p className="mt-4 text-xs font-bold">{title}</p>
            <p className="mt-1 text-[10px] text-ink/50">{text}</p>
          </button>
        ))}
      </section>
    </>
  );
}

function Members({
  data,
  setData,
  notify,
}: {
  data: DemoData;
  setData: React.Dispatch<React.SetStateAction<DemoData>>;
  notify: (message: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState(data.plans[0]?.name ?? "Open Gym");
  const filtered = data.members.filter((member) =>
    `${member.name} ${member.email} ${member.plan}`.toLowerCase().includes(search.toLowerCase()),
  );

  function addMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const newMember: Member = {
      id: createId("m"),
      name: name.trim(),
      email: email.trim(),
      plan,
      status: "Active",
      lastVisit: "Not visited yet",
    };
    setData((current) => ({ ...current, members: [newMember, ...current.members] }));
    setName("");
    setEmail("");
    setAdding(false);
    notify("Member added to the demo directory.");
  }

  return (
    <>
      <SectionHeading
        eyebrow="Your community"
        title="Member directory"
        detail={`${data.members.length} demo member records · Sample data only`}
        action={
          <button
            type="button"
            onClick={() => setAdding(!adding)}
            className="btn btn-primary !min-h-10 !text-xs"
          >
            <CirclePlus size={15} /> Add member
          </button>
        }
      />
      {adding ? (
        <form
          onSubmit={addMember}
          className="mb-5 grid gap-3 border border-ink/10 bg-white p-4 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end"
        >
          <label className="text-[11px] font-bold">
            Full name
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="field mt-1"
              placeholder="Member name"
            />
          </label>
          <label className="text-[11px] font-bold">
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="field mt-1"
              placeholder="name@example.com"
            />
          </label>
          <label className="text-[11px] font-bold">
            Membership
            <select
              value={plan}
              onChange={(event) => setPlan(event.target.value)}
              className="field mt-1"
            >
              {data.plans.map((item) => (
                <option key={item.name}>{item.name}</option>
              ))}
            </select>
          </label>
          <button type="submit" className="btn btn-ink !min-h-11 !text-xs">
            Add member
          </button>
        </form>
      ) : null}
      <div className="border border-ink/10 bg-white">
        <div className="flex items-center justify-between gap-3 border-b border-ink/10 p-4">
          <p className="text-xs font-bold">
            All members <span className="ml-1 text-ink/40">({filtered.length})</span>
          </p>
          <label className="relative w-full max-w-[230px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              aria-label="Search members"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="field !min-h-9 !pl-9 !text-xs"
              placeholder="Search members"
            />
          </label>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-xs">
            <thead className="bg-secondary/60 text-[9px] uppercase tracking-[0.12em] text-ink/50">
              <tr>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Membership</th>
                <th className="px-4 py-3">Last check-in</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {filtered.map((member) => (
                <tr key={member.id}>
                  <td className="px-4 py-3">
                    <p className="font-bold">{member.name}</p>
                    <p className="mt-1 text-[10px] text-ink/50">{member.email}</p>
                  </td>
                  <td className="px-4 py-3">{member.plan}</td>
                  <td className="px-4 py-3 text-ink/55">{member.lastVisit}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-[9px] font-bold ${member.status === "Active" ? "bg-emerald-50 text-emerald-800" : "bg-secondary text-ink/55"}`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="text-[10px] font-bold underline decoration-ink/25 underline-offset-2"
                      onClick={() =>
                        setData((current) => ({
                          ...current,
                          members: current.members.map((item) =>
                            item.id === member.id
                              ? { ...item, status: item.status === "Active" ? "Paused" : "Active" }
                              : item,
                          ),
                        }))
                      }
                    >
                      {member.status === "Active" ? "Pause" : "Reactivate"}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-ink/50">
                    No members match that search.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Classes({
  data,
  setData,
  notify,
}: {
  data: DemoData;
  setData: React.Dispatch<React.SetStateAction<DemoData>>;
  notify: (message: string) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Strength");
  const [coach, setCoach] = useState(data.trainers[0]?.name ?? "");
  const [duration, setDuration] = useState("45 min");

  function addClass(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const item: GymClass = {
      id: createId("class"),
      name: name.trim(),
      category,
      coach,
      duration,
      active: true,
    };
    setData((current) => ({ ...current, classes: [...current.classes, item] }));
    setName("");
    setAdding(false);
    notify("New class added.");
  }

  return (
    <>
      <SectionHeading
        eyebrow="On the floor"
        title="Classes & formats"
        detail={`${data.classes.filter((item) => item.active).length} active formats`}
        action={
          <button
            type="button"
            onClick={() => setAdding(!adding)}
            className="btn btn-primary !min-h-10 !text-xs"
          >
            <CirclePlus size={15} /> Add class
          </button>
        }
      />
      {adding ? (
        <form
          onSubmit={addClass}
          className="mb-5 grid gap-3 border border-ink/10 bg-white p-4 sm:grid-cols-2 lg:grid-cols-5 lg:items-end"
        >
          <label className="text-[11px] font-bold">
            Class name
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="field mt-1"
              placeholder="New class"
            />
          </label>
          <label className="text-[11px] font-bold">
            Category
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="field mt-1"
            >
              <option>Strength</option>
              <option>Conditioning</option>
              <option>Combat</option>
              <option>Recovery</option>
            </select>
          </label>
          <label className="text-[11px] font-bold">
            Coach
            <select
              value={coach}
              onChange={(event) => setCoach(event.target.value)}
              className="field mt-1"
            >
              {data.trainers.map((trainer) => (
                <option key={trainer.name}>{trainer.name}</option>
              ))}
            </select>
          </label>
          <label className="text-[11px] font-bold">
            Duration
            <input
              required
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
              className="field mt-1"
            />
          </label>
          <button type="submit" className="btn btn-ink !min-h-11 !text-xs">
            Save class
          </button>
        </form>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {data.classes.map((item, index) => (
          <article key={item.id} className="border border-ink/10 bg-white p-5">
            <div className="flex items-start justify-between">
              <span className="flex size-10 items-center justify-center bg-primary/50">
                <Dumbbell size={18} />
              </span>
              <span
                className={`px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em] ${item.active ? "bg-emerald-50 text-emerald-800" : "bg-secondary text-ink/45"}`}
              >
                {item.active ? "Active" : "Hidden"}
              </span>
            </div>
            <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.15em] text-ink/45">
              {item.category} · {item.duration}
            </p>
            <h3 className="mt-1 font-display text-xl font-bold tracking-[-0.05em]">{item.name}</h3>
            <p className="mt-2 text-xs text-ink/55">Coach {item.coach}</p>
            <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-4">
              <p className="text-[10px] text-ink/40">Format 0{index + 1}</p>
              <button
                type="button"
                onClick={() =>
                  setData((current) => ({
                    ...current,
                    classes: current.classes.map((entry) =>
                      entry.id === item.id ? { ...entry, active: !entry.active } : entry,
                    ),
                  }))
                }
                className="text-[10px] font-bold underline decoration-ink/25 underline-offset-2"
              >
                {item.active ? "Hide class" : "Make active"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function Schedule({
  data,
  setData,
  notify,
}: {
  data: DemoData;
  setData: React.Dispatch<React.SetStateAction<DemoData>>;
  notify: (message: string) => void;
}) {
  const [day, setDay] = useState("MON");
  const [adding, setAdding] = useState(false);
  const [className, setClassName] = useState(data.classes[0]?.name ?? "");
  const [time, setTime] = useState("08:00");
  const [coach, setCoach] = useState(data.trainers[0]?.name ?? "");
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const sessions = useMemo(
    () =>
      data.sessions
        .filter((session) => session.day === day)
        .sort((a, b) => a.time.localeCompare(b.time)),
    [data.sessions, day],
  );

  function addSession(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const selectedClass = data.classes.find((item) => item.name === className);
    if (!selectedClass) return;
    const session: Session = {
      id: createId("s"),
      day,
      time,
      className,
      coach,
      category: selectedClass.category,
      spots: 5,
    };
    setData((current) => ({ ...current, sessions: [...current.sessions, session] }));
    setAdding(false);
    notify(`${day} session added to the demo schedule.`);
  }

  return (
    <>
      <SectionHeading
        eyebrow="Plan the week"
        title="Class schedule"
        detail="Set up your weekly sessions and keep the floor moving."
        action={
          <button
            type="button"
            onClick={() => setAdding(!adding)}
            className="btn btn-primary !min-h-10 !text-xs"
          >
            <CirclePlus size={15} /> Add session
          </button>
        }
      />
      <div className="grid grid-cols-7 border-y border-ink/15 bg-white">
        {days.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={day === item}
            onClick={() => setDay(item)}
            className={`min-h-12 border-r border-ink/10 text-[10px] font-bold tracking-[0.1em] last:border-0 sm:min-h-14 sm:text-xs ${day === item ? "bg-ink text-white" : "hover:bg-secondary"}`}
          >
            {item}
          </button>
        ))}
      </div>
      {adding ? (
        <form
          onSubmit={addSession}
          className="mt-4 grid gap-3 border border-ink/10 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end"
        >
          <label className="text-[11px] font-bold">
            Class
            <select
              required
              value={className}
              onChange={(event) => setClassName(event.target.value)}
              className="field mt-1"
            >
              {data.classes
                .filter((item) => item.active)
                .map((item) => (
                  <option key={item.id}>{item.name}</option>
                ))}
            </select>
          </label>
          <label className="text-[11px] font-bold">
            Time
            <input
              required
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              className="field mt-1"
            />
          </label>
          <label className="text-[11px] font-bold">
            Coach
            <select
              value={coach}
              onChange={(event) => setCoach(event.target.value)}
              className="field mt-1"
            >
              {data.trainers.map((trainer) => (
                <option key={trainer.name}>{trainer.name}</option>
              ))}
            </select>
          </label>
          <button type="submit" className="btn btn-ink !min-h-11 !text-xs">
            Add {day} session
          </button>
        </form>
      ) : null}
      <div className="mt-5 border border-ink/10 bg-white">
        <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3">
          <p className="text-xs font-bold">{day} sessions</p>
          <span className="text-[10px] text-ink/45">{sessions.length} scheduled</span>
        </div>
        {sessions.map((session) => (
          <div
            key={session.id}
            className="grid grid-cols-[64px_1fr_auto] items-center gap-3 border-b border-ink/10 px-4 py-4 last:border-b-0 sm:grid-cols-[80px_1fr_120px_auto]"
          >
            <p className="font-display text-sm font-bold">{session.time}</p>
            <div>
              <p className="text-xs font-bold">{session.className}</p>
              <p className="mt-1 text-[10px] text-ink/50">
                {session.category} · Coach {session.coach}
              </p>
            </div>
            <p className="hidden text-[10px] text-ink/50 sm:block">
              {session.spots} spots available
            </p>
            <button
              type="button"
              aria-label={`Remove ${session.className} at ${session.time}`}
              onClick={() =>
                setData((current) => ({
                  ...current,
                  sessions: current.sessions.filter((item) => item.id !== session.id),
                }))
              }
              className="flex size-8 items-center justify-center text-ink/45 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        {sessions.length === 0 ? (
          <p className="px-4 py-10 text-center text-xs text-ink/45">
            No sessions scheduled. Add one to get started.
          </p>
        ) : null}
      </div>
    </>
  );
}

export function Coaches({
  data,
  setData,
  notify,
}: {
  data: DemoData;
  setData: React.Dispatch<React.SetStateAction<DemoData>>;
  notify: (message: string) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [specialties, setSpecialties] = useState("");

  function addCoach(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trainer: Trainer = {
      id: createId("trainer"),
      name: name.trim(),
      role: role.trim(),
      specialties: specialties
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      image: "",
      experience: "Experience not entered",
      initials: name
        .trim()
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    };
    setData((current) => ({ ...current, trainers: [...current.trainers, trainer] }));
    setName("");
    setRole("");
    setSpecialties("");
    setAdding(false);
    notify("Coach added to the team.");
  }

  return (
    <>
      <SectionHeading
        eyebrow="People who move us"
        title="Coaching team"
        detail={`${data.trainers.length} coaches in your demo team`}
        action={
          <button
            type="button"
            onClick={() => setAdding(!adding)}
            className="btn btn-primary !min-h-10 !text-xs"
          >
            <CirclePlus size={15} /> Add coach
          </button>
        }
      />
      {adding ? (
        <form
          onSubmit={addCoach}
          className="mb-5 grid gap-3 border border-ink/10 bg-white p-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end"
        >
          <label className="text-[11px] font-bold">
            Coach name
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="field mt-1"
            />
          </label>
          <label className="text-[11px] font-bold">
            Role
            <input
              required
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="field mt-1"
              placeholder="Strength coach"
            />
          </label>
          <label className="text-[11px] font-bold">
            Specialties
            <input
              value={specialties}
              onChange={(event) => setSpecialties(event.target.value)}
              className="field mt-1"
              placeholder="Strength, mobility"
            />
          </label>
          <button type="submit" className="btn btn-ink !min-h-11 !text-xs">
            Add coach
          </button>
        </form>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data.trainers.map((trainer, index) => (
          <article key={`${trainer.name}-${index}`} className="border border-ink/10 bg-white">
            <div className="flex items-center gap-4 p-5">
              {trainer.image ? (
                <img src={trainer.image} alt="" className="size-16 rounded-full object-cover" />
              ) : (
                <span className="flex size-16 items-center justify-center rounded-full bg-primary/55 font-display text-sm font-bold">
                  {trainer.initials}
                </span>
              )}
              <div>
                <h3 className="font-display text-lg font-bold">{trainer.name}</h3>
                <p className="mt-1 text-xs text-ink/55">{trainer.role}</p>
              </div>
            </div>
            <div className="border-t border-ink/10 px-5 py-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-ink/40">
                Specialties
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {trainer.specialties.map((item) => (
                  <span key={item} className="bg-secondary px-2 py-1 text-[10px] font-semibold">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

export function Memberships({
  data,
  setData,
  notify,
}: {
  data: DemoData;
  setData: React.Dispatch<React.SetStateAction<DemoData>>;
  notify: (message: string) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  function addPlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const plan: Plan = {
      id: createId("plan"),
      name: name.trim(),
      price: price.trim(),
      period: "/ month",
      description: description.trim(),
      features: ["Gym access"],
      featured: false,
      active: true,
    };
    setData((current) => ({ ...current, plans: [...current.plans, plan] }));
    setName("");
    setPrice("");
    setDescription("");
    setAdding(false);
    notify("Membership option added.");
  }

  return (
    <>
      <SectionHeading
        eyebrow="Membership options"
        title="Find your fit"
        detail="Manage plan visibility and demo pricing."
        action={
          <button
            type="button"
            onClick={() => setAdding(!adding)}
            className="btn btn-primary !min-h-10 !text-xs"
          >
            <CirclePlus size={15} /> Add plan
          </button>
        }
      />
      {adding ? (
        <form
          onSubmit={addPlan}
          className="mb-5 grid gap-3 border border-ink/10 bg-white p-4 sm:grid-cols-2 lg:grid-cols-[1fr_150px_1fr_auto] lg:items-end"
        >
          <label className="text-[11px] font-bold">
            Plan name
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="field mt-1"
            />
          </label>
          <label className="text-[11px] font-bold">
            Price
            <input
              required
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              className="field mt-1"
              placeholder="₹2,999"
            />
          </label>
          <label className="text-[11px] font-bold">
            Description
            <input
              required
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="field mt-1"
            />
          </label>
          <button type="submit" className="btn btn-ink !min-h-11 !text-xs">
            Add plan
          </button>
        </form>
      ) : null}
      <div className="grid gap-4 lg:grid-cols-3">
        {data.plans.map((plan, index) => (
          <article
            key={`${plan.name}-${index}`}
            className={`flex flex-col border bg-white p-5 ${plan.featured ? "border-ink" : "border-ink/10"} ${!plan.active ? "opacity-55" : ""}`}
          >
            <div className="flex items-center justify-between">
              <p className="section-kicker">{plan.name}</p>
              <span
                className={`text-[9px] font-bold uppercase ${plan.active ? "text-emerald-700" : "text-ink/40"}`}
              >
                {plan.active ? "Active" : "Hidden"}
              </span>
            </div>
            <div className="mt-6 flex items-end gap-1">
              <input
                aria-label={`${plan.name} price`}
                value={plan.price}
                onChange={(event) =>
                  setData((current) => ({
                    ...current,
                    plans: current.plans.map((item) =>
                      item.name === plan.name ? { ...item, price: event.target.value } : item,
                    ),
                  }))
                }
                className="w-36 border-b border-ink/20 bg-transparent font-display text-3xl font-bold tracking-[-0.06em] outline-none focus:border-primary"
              />
              <span className="pb-1 text-xs text-ink/45">{plan.period}</span>
            </div>
            <p className="mt-3 min-h-10 text-xs text-ink/55">{plan.description}</p>
            <ul className="mt-4 flex-1 space-y-2 border-t border-ink/10 pt-4">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-xs">
                  <Check size={14} className="text-emerald-700" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() =>
                setData((current) => ({
                  ...current,
                  plans: current.plans.map((item) =>
                    item.name === plan.name ? { ...item, active: !item.active } : item,
                  ),
                }))
              }
              className="mt-5 border border-ink/15 px-3 py-2 text-[10px] font-bold hover:bg-secondary"
            >
              {plan.active ? "Hide from website" : "Show on website"}
            </button>
          </article>
        ))}
      </div>
      <p className="mt-4 text-[10px] text-ink/45">
        Demo pricing is illustrative. Changes are saved in this browser and do not process payments.
      </p>
    </>
  );
}

function VisitRequests({
  data,
  setData,
}: {
  data: DemoData;
  setData: React.Dispatch<React.SetStateAction<DemoData>>;
}) {
  const [statusFilter, setStatusFilter] = useState("All requests");
  const [search, setSearch] = useState("");
  const leads = data.leads.filter((lead) => {
    const matchesStatus = statusFilter === "All requests" || lead.status === statusFilter;
    const matchesSearch = `${lead.name} ${lead.email} ${lead.phone} ${lead.interest}`
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });
  return (
    <>
      <SectionHeading
        eyebrow="Make a good first impression"
        title="Demo enquiries"
        detail={`${data.leads.length} enquiries · fictional samples and browser-only submissions`}
        action={
          <select
            aria-label="Filter enquiries"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="field !min-h-10 !w-auto !text-xs"
          >
            {["All requests", "New", "Contacted", "Visit booked"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        }
      />
      <div className="border border-ink/10 bg-white">
        <label className="relative block border-b border-ink/10 p-4">
          <Search size={14} className="absolute left-7 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            aria-label="Search enquiries"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, email, phone, or interest"
            className="field !min-h-9 !pl-9 !text-xs"
          />
        </label>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-xs">
            <thead className="bg-secondary/60 text-[9px] uppercase tracking-[0.12em] text-ink/50">
              <tr>
                <th className="px-4 py-3">Interested visitor</th>
                <th className="px-4 py-3">Interest</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Received</th>
                <th className="px-4 py-3">Follow-up</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="px-4 py-4">
                    <p className="font-bold">{lead.name}</p>
                    <p className="mt-1 text-[10px] text-ink/50">{lead.email}</p>
                    <p className="mt-1 text-[10px] text-ink/50">{lead.phone}</p>
                  </td>
                  <td className="px-4 py-4">{lead.interest}</td>
                  <td className="max-w-[240px] px-4 py-4 text-ink/55">{lead.message}</td>
                  <td className="px-4 py-4 text-ink/55">{lead.received}</td>
                  <td className="px-4 py-4">
                    <label className="sr-only" htmlFor={`lead-${lead.id}`}>
                      Follow-up status for {lead.name}
                    </label>
                    <select
                      id={`lead-${lead.id}`}
                      value={lead.status}
                      onChange={(event) =>
                        setData((current) => ({
                          ...current,
                          leads: current.leads.map((item) =>
                            item.id === lead.id
                              ? { ...item, status: event.target.value as Lead["status"] }
                              : item,
                          ),
                        }))
                      }
                      className="border border-ink/15 bg-white px-2 py-2 text-[10px] font-semibold"
                    >
                      {["New", "Contacted", "Visit booked"].map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-ink/50">
                    No enquiries match these filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
      <p className="mt-4 text-[10px] leading-5 text-ink/45">
        Sample enquiries are fictional. Public demo submissions are saved only in this browser,
        never sent to a real customer database.
      </p>
    </>
  );
}

function WebsiteContent({
  content,
  updateContent,
  notify,
}: {
  content: SiteContent;
  updateContent: (content: SiteContent) => void;
  notify: (message: string) => void;
}) {
  const [urlError, setUrlError] = useState("");

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const updatedContent: SiteContent = {
      name: String(values.get("name") ?? "").trim(),
      tagline: String(values.get("tagline") ?? "").trim(),
      phone: String(values.get("phone") ?? "").trim(),
      phoneDisplay: String(values.get("phoneDisplay") ?? "").trim(),
      email: String(values.get("email") ?? "").trim(),
      address: String(values.get("address") ?? "").trim(),
      hours: String(values.get("hours") ?? "").trim(),
      heroDescription: String(values.get("heroDescription") ?? "").trim(),
      ctaText: String(values.get("ctaText") ?? "").trim(),
      instagramUrl: String(values.get("instagramUrl") ?? "").trim(),
      facebookUrl: String(values.get("facebookUrl") ?? "").trim(),
    };
    const socialLinks: [string, string][] = [
      ["Instagram", updatedContent.instagramUrl],
      ["Facebook", updatedContent.facebookUrl],
    ];
    for (const [label, value] of socialLinks) {
      try {
        const protocol = new URL(value).protocol;
        if (protocol !== "https:" && protocol !== "http:") throw new Error("Unsupported protocol");
      } catch {
        setUrlError(`${label} URL must use a valid http or https address.`);
        return;
      }
    }
    setUrlError("");
    updateContent(updatedContent);
    notify("Website details saved on this device.");
  }

  const fields: { key: keyof SiteContent; label: string; type?: string }[] = [
    { key: "name", label: "Gym name" },
    { key: "tagline", label: "Short tagline" },
    { key: "phone", label: "Phone link", type: "tel" },
    { key: "phoneDisplay", label: "Phone display" },
    { key: "email", label: "Email address", type: "email" },
    { key: "address", label: "Studio address" },
    { key: "hours", label: "Opening hours" },
    { key: "heroDescription", label: "Hero text" },
    { key: "ctaText", label: "Primary CTA text" },
    { key: "instagramUrl", label: "Instagram URL", type: "url" },
    { key: "facebookUrl", label: "Facebook URL", type: "url" },
  ];

  return (
    <>
      <SectionHeading
        eyebrow="Your public front door"
        title="Website details"
        detail="Edit the contact details and brand copy shown on your site."
      />
      <form onSubmit={save} className="max-w-3xl border border-ink/10 bg-white p-5 sm:p-7">
        {urlError ? (
          <p role="alert" className="mb-4 text-sm text-destructive">
            {urlError}
          </p>
        ) : null}
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map(({ key, label, type }) => (
            <label
              key={key}
              className={`text-[11px] font-bold ${key === "tagline" || key === "address" || key === "hours" ? "sm:col-span-2" : ""}`}
            >
              {label}
              <input
                name={key}
                type={type ?? "text"}
                required
                defaultValue={content[key]}
                className="field mt-1"
              />
            </label>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-ink/10 pt-5">
          <button type="submit" className="btn btn-primary !min-h-11 !text-xs">
            Save website details
          </button>
          <span className="text-[10px] text-ink/45">
            Saved locally in your browser. Refresh to see the changes persist.
          </span>
        </div>
      </form>
    </>
  );
}

function PortfolioTools() {
  return (
    <>
      <SectionHeading
        eyebrow="Existing site integration"
        title="Portfolio tools"
        detail="The original Supabase project manager is retained here as a separate demo utility."
      />
      <div className="mb-5 border border-ink/10 bg-white px-4 py-3 text-xs leading-5 text-ink/60">
        This panel keeps the existing project and image-storage integration available. It is
        separate from IRON DISTRICT’s local demo content.
      </div>
      <ProjectManager />
    </>
  );
}
