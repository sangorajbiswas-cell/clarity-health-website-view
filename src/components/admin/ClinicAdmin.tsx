import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  ClipboardList,
  FileText,
  HeartPulse,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  Plus,
  Search,
  Settings2,
  Stethoscope,
  Trash2,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useClinicDemoData } from "@/hooks/use-clinic-demo-data";
import { ProjectManager } from "@/components/admin/ProjectManager";
import type {
  AppointmentStatus,
  ClinicAppointmentRequest,
  ClinicDepartment,
  ClinicDemoData,
  ClinicDoctor,
  ClinicFacility,
  ClinicService,
  ClinicTestimonial,
  ClinicInformation,
  ClinicHomeContent,
} from "@/lib/clinic-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type AdminSection =
  | "overview"
  | "doctors"
  | "services"
  | "departments"
  | "facilities"
  | "appointments"
  | "content"
  | "settings"
  | "portfolio";

type CatalogSection = Extract<AdminSection, "doctors" | "services" | "departments" | "facilities">;
type CatalogItem =
  ClinicDoctor | ClinicService | ClinicDepartment | ClinicFacility | ClinicTestimonial;
type FieldDefinition = { key: string; label: string; multiline?: boolean };

const navigation: { id: AdminSection; label: string; icon: LucideIcon; path: string }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, path: "/admin" },
  { id: "doctors", label: "Doctors", icon: Stethoscope, path: "/admin/doctors" },
  { id: "services", label: "Services", icon: HeartPulse, path: "/admin/services" },
  { id: "departments", label: "Departments", icon: Activity, path: "/admin/departments" },
  { id: "facilities", label: "Facilities", icon: ClipboardList, path: "/admin/facilities" },
  {
    id: "appointments",
    label: "Appointment requests",
    icon: CalendarDays,
    path: "/admin/appointments",
  },
  { id: "content", label: "Website content", icon: FileText, path: "/admin/content" },
  { id: "settings", label: "Clinic information", icon: Settings2, path: "/admin/settings" },
  {
    id: "portfolio",
    label: "Existing project tools",
    icon: BriefcaseBusiness,
    path: "/admin/portfolio",
  },
];

const catalogConfig: Record<
  CatalogSection,
  { title: string; singular: string; fields: FieldDefinition[] }
> = {
  doctors: {
    title: "Doctors",
    singular: "doctor",
    fields: [
      { key: "name", label: "Name" },
      { key: "specialty", label: "Specialty" },
      { key: "qualifications", label: "Qualifications (illustrative only)" },
      { key: "experience", label: "Experience (sample)" },
      { key: "bio", label: "Profile description", multiline: true },
      { key: "image", label: "Portrait image URL" },
    ],
  },
  services: {
    title: "Services",
    singular: "service",
    fields: [
      { key: "name", label: "Service name" },
      { key: "department", label: "Department" },
      { key: "description", label: "Description", multiline: true },
      { key: "visitLength", label: "Example visit length" },
      { key: "image", label: "Image URL" },
    ],
  },
  departments: {
    title: "Departments",
    singular: "department",
    fields: [
      { key: "name", label: "Department name" },
      { key: "description", label: "Description", multiline: true },
      { key: "leadDoctor", label: "Sample lead doctor" },
      { key: "image", label: "Image URL" },
    ],
  },
  facilities: {
    title: "Facilities",
    singular: "facility",
    fields: [
      { key: "name", label: "Facility name" },
      { key: "description", label: "Description", multiline: true },
      { key: "image", label: "Image URL" },
      { key: "alt", label: "Accessible image description" },
    ],
  },
};

const appointmentStatuses: AppointmentStatus[] = ["New request", "Contacted", "Closed"];

function isCatalogSection(section: AdminSection): section is CatalogSection {
  return (
    section === "doctors" ||
    section === "services" ||
    section === "departments" ||
    section === "facilities"
  );
}

function buildCatalogItem(
  section: CatalogSection,
  id: string,
  values: Record<string, string>,
): CatalogItem {
  switch (section) {
    case "doctors":
      return {
        id,
        name: values["name"] ?? "",
        specialty: values["specialty"] ?? "",
        qualifications: values["qualifications"] ?? "",
        experience: values["experience"] ?? "",
        bio: values["bio"] ?? "",
        image: values["image"] ?? "",
      };
    case "services":
      return {
        id,
        name: values["name"] ?? "",
        department: values["department"] ?? "",
        description: values["description"] ?? "",
        visitLength: values["visitLength"] ?? "",
        image: values["image"] ?? "",
      };
    case "departments":
      return {
        id,
        name: values["name"] ?? "",
        description: values["description"] ?? "",
        leadDoctor: values["leadDoctor"] ?? "",
        image: values["image"] ?? "",
      };
    case "facilities":
      return {
        id,
        name: values["name"] ?? "",
        description: values["description"] ?? "",
        image: values["image"] ?? "",
        alt: values["alt"] ?? "",
      };
  }
}

function getCatalogItems(data: ClinicDemoData, section: CatalogSection): CatalogItem[] {
  switch (section) {
    case "doctors":
      return data.doctors;
    case "services":
      return data.services;
    case "departments":
      return data.departments;
    case "facilities":
      return data.facilities;
  }
}

function updateCatalog(
  data: ClinicDemoData,
  section: CatalogSection,
  item: CatalogItem,
): ClinicDemoData {
  switch (section) {
    case "doctors":
      return { ...data, doctors: upsert(data.doctors, item as ClinicDoctor) };
    case "services":
      return { ...data, services: upsert(data.services, item as ClinicService) };
    case "departments":
      return { ...data, departments: upsert(data.departments, item as ClinicDepartment) };
    case "facilities":
      return { ...data, facilities: upsert(data.facilities, item as ClinicFacility) };
  }
}

function deleteCatalog(data: ClinicDemoData, section: CatalogSection, id: string): ClinicDemoData {
  switch (section) {
    case "doctors":
      return { ...data, doctors: data.doctors.filter((item) => item.id !== id) };
    case "services":
      return { ...data, services: data.services.filter((item) => item.id !== id) };
    case "departments":
      return { ...data, departments: data.departments.filter((item) => item.id !== id) };
    case "facilities":
      return { ...data, facilities: data.facilities.filter((item) => item.id !== id) };
  }
}

function upsert<T extends { id: string }>(items: T[], item: T): T[] {
  const found = items.some((entry) => entry.id === item.id);
  return found ? items.map((entry) => (entry.id === item.id ? item : entry)) : [item, ...items];
}

function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function displayName(item: CatalogItem) {
  return "name" in item ? item.name : item.attribution;
}

function displayDescription(item: CatalogItem) {
  if ("bio" in item) return item.specialty;
  if ("visitLength" in item) return `${item.department} · ${item.visitLength}`;
  if ("leadDoctor" in item) return `Sample lead: ${item.leadDoctor}`;
  if ("description" in item) return item.description;
  return item.context;
}

export function ClinicAdmin({ section: sectionParam = "overview" }: { section?: string }) {
  const { data, setData, loaded, storageError, resetData } = useClinicDemoData();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const section = navigation.find((item) => item.id === sectionParam)?.id ?? "overview";
  const title =
    section === "overview"
      ? "Dashboard overview"
      : section === "appointments"
        ? "Appointment requests"
        : section === "settings"
          ? "Clinic information"
          : section === "content"
            ? "Website content"
            : section === "portfolio"
              ? "Existing project tools"
              : catalogConfig[section].title;

  function confirmReset() {
    if (window.confirm("Reset this browser's clinic demo content to the original examples?")) {
      resetData();
      setResetMessage("Demo content has been reset to the original fictional examples.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <AdminBrand />
        <AdminNavigation section={section} />
        <div className="mt-auto border-t border-slate-200 p-4">
          <Link
            to="/"
            className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            View Website <ArrowUpRight size={16} aria-hidden />
          </Link>
          <p className="mt-3 px-3 text-[11px] leading-5 text-slate-500">
            Public demo · Browser-local content · No patient data
          </p>
        </div>
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="flex h-full w-[min(84vw,320px)] max-w-[320px] flex-col bg-white p-0 text-slate-900"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Admin navigation</SheetTitle>
            <SheetDescription>Choose a clinic demo administration section.</SheetDescription>
          </SheetHeader>
          <AdminBrand />
          <AdminNavigation section={section} onNavigate={() => setMobileOpen(false)} />
          <div className="mt-auto border-t p-4">
            <Link
              to="/"
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              onClick={() => setMobileOpen(false)}
            >
              View Website <ArrowUpRight size={16} aria-hidden />
            </Link>
          </div>
        </SheetContent>
      </Sheet>

      <div className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-20 flex min-h-[72px] items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-7">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg border border-slate-200 p-2 lg:hidden"
              aria-label="Open admin navigation"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={19} aria-hidden />
            </button>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-800">
                CLARITY HEALTH · DEMO ADMIN
              </p>
              <h1 className="mt-1 text-lg font-semibold tracking-tight">{title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="hidden border-amber-300 bg-amber-50 text-amber-800 sm:inline-flex"
            >
              Public demo
            </Badge>
            <Button asChild size="sm" variant="outline" className="hidden sm:inline-flex">
              <Link to="/">
                View Website <ArrowUpRight size={15} aria-hidden />
              </Link>
            </Button>
          </div>
        </header>

        <main id="main" className="mx-auto max-w-[1440px] px-4 py-6 sm:px-7 sm:py-8">
          <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-950">
            This admin is publicly accessible and stores fictional demo content in this browser
            only. Never enter real patient information.
          </div>
          {storageError ? (
            <p
              role="alert"
              className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              {storageError}
            </p>
          ) : null}
          {resetMessage ? (
            <p
              role="status"
              className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
            >
              {resetMessage}
            </p>
          ) : null}
          {!loaded ? (
            <p role="status" className="rounded-xl border bg-white p-8 text-sm text-slate-600">
              Loading browser-local demo content…
            </p>
          ) : section === "overview" ? (
            <Overview data={data} />
          ) : isCatalogSection(section) ? (
            <CatalogManager section={section} data={data} setData={setData} />
          ) : section === "appointments" ? (
            <AppointmentsManager data={data} setData={setData} />
          ) : section === "content" ? (
            <WebsiteContent data={data} setData={setData} />
          ) : section === "portfolio" ? (
            <ProjectTools />
          ) : (
            <ClinicSettings data={data} setData={setData} onReset={confirmReset} />
          )}
        </main>
      </div>
    </div>
  );
}

function AdminBrand() {
  return (
    <div className="flex min-h-[76px] items-center gap-3 border-b border-slate-200 px-5">
      <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-800 text-white">
        <HeartPulse size={22} aria-hidden />
      </span>
      <div>
        <p className="text-sm font-bold tracking-wide text-slate-900">CLARITY HEALTH</p>
        <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500">
          Demo workspace
        </p>
      </div>
    </div>
  );
}

function AdminNavigation({
  section,
  onNavigate,
}: {
  section: AdminSection;
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-1 px-3 py-5" aria-label="Admin sections">
      {navigation.map(({ id, label, icon: Icon, path }) => (
        <a
          key={id}
          href={path}
          onClick={onNavigate}
          aria-current={section === id ? "page" : undefined}
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition ${section === id ? "bg-emerald-50 text-emerald-900" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
        >
          <Icon size={17} aria-hidden />
          {label}
          {id === "appointments" ? (
            <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
              Requests
            </span>
          ) : null}
        </a>
      ))}
    </nav>
  );
}

function Overview({ data }: { data: ClinicDemoData }) {
  const metrics = [
    { label: "Sample doctors", value: data.doctors.length, icon: Stethoscope },
    { label: "Services", value: data.services.length, icon: HeartPulse },
    { label: "Departments", value: data.departments.length, icon: Activity },
    { label: "Demo requests", value: data.appointments.length, icon: CalendarDays },
  ];
  const recent = data.appointments.slice(0, 5);
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-slate-500">
            A quick view of your illustrative clinic content.
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">
            Welcome to the demo workspace
          </h2>
        </div>
        <Link
          to="/appointment"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:underline"
        >
          Preview appointment form <ArrowUpRight size={15} aria-hidden />
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="border-slate-200 bg-white shadow-sm">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-2 text-3xl font-semibold">{value}</p>
              </div>
              <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
                <Icon size={21} aria-hidden />
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Recent appointment requests</CardTitle>
            <CardDescription className="mt-1">
              Requests only — none are bookings or confirmed appointments.
            </CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <a href="/admin/appointments">
              View all <ArrowUpRight size={14} aria-hidden />
            </a>
          </Button>
        </CardHeader>
        <CardContent>
          <AppointmentTable requests={recent} onStatusChange={() => {}} compact />
        </CardContent>
      </Card>
    </div>
  );
}

function CatalogManager({
  section,
  data,
  setData,
}: {
  section: CatalogSection;
  data: ClinicDemoData;
  setData: React.Dispatch<React.SetStateAction<ClinicDemoData>>;
}) {
  const config = catalogConfig[section];
  const [editing, setEditing] = useState<CatalogItem | null>(null);
  const [creating, setCreating] = useState(false);
  const items = getCatalogItems(data, section);

  function save(values: Record<string, string>) {
    const id = editing?.id ?? newId(section.slice(0, -1));
    const item = buildCatalogItem(section, id, values);
    setData((current) => updateCatalog(current, section, item));
    setEditing(null);
    setCreating(false);
  }

  function remove(item: CatalogItem) {
    if (window.confirm(`Delete “${displayName(item)}” from this browser's clinic demo content?`)) {
      setData((current) => deleteCatalog(current, section, item.id));
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-slate-500">
            Manage illustrative content shared with the public website.
          </p>
          <h2 className="mt-1 text-xl font-semibold">
            {items.length} {config.title.toLowerCase()}
          </h2>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setCreating(true);
          }}
        >
          <Plus size={16} aria-hidden /> Add {config.singular}
        </Button>
      </div>
      {items.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id} className="min-w-0 border-slate-200 bg-white shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold">{displayName(item)}</h3>
                    <p className="mt-1 line-clamp-3 text-sm leading-6 text-slate-500">
                      {displayDescription(item)}
                    </p>
                  </div>
                  <Badge variant="outline" className="shrink-0 border-slate-200 text-slate-600">
                    Demo content
                  </Badge>
                </div>
                {"image" in item ? (
                  <p className="mt-4 truncate text-xs text-slate-400">{item.image}</p>
                ) : null}
                <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditing(item);
                      setCreating(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-700 hover:bg-red-50 hover:text-red-800"
                    onClick={() => remove(item)}
                  >
                    <Trash2 size={15} aria-hidden /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-slate-300 bg-white shadow-none">
          <CardContent className="py-14 text-center">
            <UsersRound className="mx-auto text-slate-400" size={30} aria-hidden />
            <h3 className="mt-4 font-semibold">No {config.title.toLowerCase()} yet</h3>
            <p className="mt-1 text-sm text-slate-500">
              Add an illustrative {config.singular} to show it on the public website.
            </p>
            <Button
              className="mt-5"
              onClick={() => {
                setEditing(null);
                setCreating(true);
              }}
            >
              <Plus size={16} aria-hidden /> Add {config.singular}
            </Button>
          </CardContent>
        </Card>
      )}
      <CatalogDialog
        key={editing?.id ?? "new-item"}
        section={section}
        fields={config.fields}
        item={editing}
        open={creating}
        onOpenChange={setCreating}
        onSave={save}
      />
    </div>
  );
}

function CatalogDialog({
  section,
  fields,
  item,
  open,
  onOpenChange,
  onSave,
  title,
  submitLabel,
}: {
  section: CatalogSection;
  fields: FieldDefinition[];
  item: CatalogItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (values: Record<string, string>) => void;
  title?: string;
  submitLabel?: string;
}) {
  const [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(
      fields.map(({ key }) => [key, String(formData.get(key) ?? "").trim()]),
    );
    const missing = fields.find(({ key }) => !values[key]);
    if (missing) {
      setError(`${missing.label} is required.`);
      return;
    }
    if ("image" in values && !/^https?:\/\/\S+$/i.test(values["image"])) {
      setError("Enter a valid image URL beginning with http:// or https://.");
      return;
    }
    setError("");
    onSave(values);
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {item ? "Edit" : "Add"} {title ?? catalogConfig[section].singular}
          </DialogTitle>
          <DialogDescription>
            Use fictional, illustrative content only. Changes appear on the public demo website.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <label
                key={field.key}
                className={`block text-sm font-medium ${field.multiline ? "sm:col-span-2" : ""}`}
              >
                {field.label}
                {field.multiline ? (
                  <textarea
                    name={field.key}
                    required
                    maxLength={1200}
                    defaultValue={
                      item ? ((item as unknown as Record<string, string>)[field.key] ?? "") : ""
                    }
                    rows={3}
                    className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
                  />
                ) : (
                  <input
                    name={field.key}
                    required
                    maxLength={field.key === "image" ? 1000 : 300}
                    defaultValue={
                      item ? ((item as unknown as Record<string, string>)[field.key] ?? "") : ""
                    }
                    className="mt-1.5 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
                  />
                )}
              </label>
            ))}
          </div>
          {error ? (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          ) : null}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {submitLabel ?? (item ? "Save changes" : `Create ${catalogConfig[section].singular}`)}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AppointmentsManager({
  data,
  setData,
}: {
  data: ClinicDemoData;
  setData: React.Dispatch<React.SetStateAction<ClinicDemoData>>;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All requests");
  const [selected, setSelected] = useState<ClinicAppointmentRequest | null>(null);
  const requests = useMemo(() => {
    const term = query.trim().toLowerCase();
    return data.appointments.filter((request) => {
      const matchesTerm =
        !term ||
        [
          request.name,
          request.email,
          request.phone,
          request.department,
          request.preferredDoctor,
        ].some((value) => value.toLowerCase().includes(term));
      const matchesStatus = filter === "All requests" || request.status === filter;
      return matchesTerm && matchesStatus;
    });
  }, [data.appointments, filter, query]);

  function updateStatus(request: ClinicAppointmentRequest, status: AppointmentStatus) {
    setData((current) => ({
      ...current,
      appointments: current.appointments.map((item) =>
        item.id === request.id ? { ...item, status } : item,
      ),
    }));
    setSelected((current) => (current?.id === request.id ? { ...current, status } : current));
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-slate-500">
          Fictional requests saved by the public demo form in this browser.
        </p>
        <h2 className="mt-1 text-xl font-semibold">{data.appointments.length} demo requests</h2>
      </div>
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search requests</span>
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, contact, department…"
            className="h-10 w-full border-slate-300 pl-9 pr-3 text-sm outline-none focus-visible:border-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-700/15"
          />
        </label>
        <label className="relative sm:w-52">
          <span className="sr-only">Filter by request status</span>
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="h-10 w-full appearance-none rounded-md border border-slate-300 bg-white px-3 pr-9 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
          >
            <option>All requests</option>
            {appointmentStatuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
          <ChevronDown
            size={15}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
            aria-hidden
          />
        </label>
      </div>
      {requests.length ? (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <AppointmentTable
            requests={requests}
            onStatusChange={updateStatus}
            onView={setSelected}
          />
        </div>
      ) : (
        <Card className="border-dashed border-slate-300 bg-white shadow-none">
          <CardContent className="py-14 text-center">
            <MessageSquareText className="mx-auto text-slate-400" size={30} aria-hidden />
            <h3 className="mt-4 font-semibold">
              {data.appointments.length ? "No requests match your search" : "No demo requests yet"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {data.appointments.length
                ? "Try another search or status filter."
                : "Requests submitted on the public demo form will appear here."}
            </p>
          </CardContent>
        </Card>
      )}
      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Demo appointment request</DialogTitle>
            <DialogDescription>
              This is not a confirmed appointment and no clinic received it.
            </DialogDescription>
          </DialogHeader>
          {selected ? (
            <div className="space-y-3 text-sm">
              <Detail label="Name" value={selected.name} />
              <Detail label="Email" value={selected.email || "Not provided"} />
              <Detail label="Phone" value={selected.phone || "Not provided"} />
              <Detail label="Department" value={selected.department} />
              <Detail label="Preferred sample doctor" value={selected.preferredDoctor} />
              <Detail label="Preferred date" value={selected.preferredDate} />
              <Detail label="Received" value={selected.receivedAt} />
              <label className="block pt-2 font-medium">
                Request status
                <select
                  value={selected.status}
                  onChange={(event) =>
                    updateStatus(selected, event.target.value as AppointmentStatus)
                  }
                  className="mt-1.5 h-10 w-full rounded-md border border-slate-300 px-3"
                >
                  {appointmentStatuses.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </label>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[150px_1fr] gap-3 border-b border-slate-100 pb-2">
      <span className="text-slate-500">{label}</span>
      <span className="break-words font-medium">{value || "—"}</span>
    </div>
  );
}

function AppointmentTable({
  requests,
  onStatusChange,
  onView,
  compact = false,
}: {
  requests: ClinicAppointmentRequest[];
  onStatusChange: (request: ClinicAppointmentRequest, status: AppointmentStatus) => void;
  onView?: (request: ClinicAppointmentRequest) => void;
  compact?: boolean;
}) {
  return (
    <Table className="min-w-[720px] border-collapse text-left text-sm">
      <TableHeader>
        <TableRow className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <TableHead className="px-4 py-3">Request</TableHead>
          <TableHead className="px-4 py-3">Department</TableHead>
          <TableHead className="px-4 py-3">Preferred date</TableHead>
          <TableHead className="px-4 py-3">Received</TableHead>
          <TableHead className="px-4 py-3">Status</TableHead>
          {onView ? <TableHead className="px-4 py-3">Details</TableHead> : null}
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id} className="border-b border-slate-100 last:border-0">
            <TableCell className="px-4 py-3">
              <p className="font-medium text-slate-900">{request.name}</p>
              <p className="mt-0.5 text-xs text-slate-500">
                {request.email || request.phone || "No contact provided"}
              </p>
            </TableCell>
            <TableCell className="px-4 py-3 text-slate-600">{request.department}</TableCell>
            <TableCell className="px-4 py-3 text-slate-600">{request.preferredDate}</TableCell>
            <TableCell className="px-4 py-3 text-slate-600">{request.receivedAt}</TableCell>
            <TableCell className="px-4 py-3">
              {compact ? (
                <Badge
                  variant="outline"
                  className={
                    request.status === "New request"
                      ? "border-amber-300 bg-amber-50 text-amber-900"
                      : request.status === "Contacted"
                        ? "border-blue-300 bg-blue-50 text-blue-900"
                        : "border-slate-300 bg-slate-50 text-slate-700"
                  }
                >
                  {request.status}
                </Badge>
              ) : (
                <label>
                  <span className="sr-only">Update status for {request.name}</span>
                  <select
                    value={request.status}
                    onChange={(event) =>
                      onStatusChange(request, event.target.value as AppointmentStatus)
                    }
                    className={`rounded-full border-0 px-2.5 py-1 text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-700/30 ${request.status === "New request" ? "bg-amber-100 text-amber-900" : request.status === "Contacted" ? "bg-blue-100 text-blue-900" : "bg-slate-100 text-slate-700"}`}
                  >
                    <option>New request</option>
                    <option>Contacted</option>
                    <option>Closed</option>
                  </select>
                </label>
              )}
            </TableCell>
            {onView ? (
              <TableCell className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => onView(request)}
                  className="font-medium text-emerald-800 hover:underline"
                >
                  View
                </button>
              </TableCell>
            ) : null}
          </TableRow>
        ))}
      </TableBody>
      {compact && !requests.length ? (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">
              No demo requests yet.
            </TableCell>
          </TableRow>
        </TableFooter>
      ) : null}
    </Table>
  );
}

const clinicFields: FieldDefinition[] = [
  { key: "name", label: "Clinic name" },
  { key: "tagline", label: "Tagline" },
  { key: "phone", label: "Sample phone" },
  { key: "email", label: "Sample email" },
  { key: "address", label: "Example address" },
  { key: "hours", label: "Opening hours", multiline: true },
  { key: "directionsUrl", label: "Directions link" },
];
const homeFields: FieldDefinition[] = [
  { key: "heroEyebrow", label: "Hero eyebrow" },
  { key: "heroTitle", label: "Hero headline" },
  { key: "heroDescription", label: "Hero description", multiline: true },
  { key: "aboutTitle", label: "About section title" },
  { key: "aboutDescription", label: "About section description", multiline: true },
  { key: "appointmentCta", label: "Appointment call-to-action" },
  { key: "testimonialsNote", label: "Sample quotes disclaimer", multiline: true },
];

function SettingsForm({
  title,
  description,
  fields,
  values,
  onSave,
}: {
  title: string;
  description: string;
  fields: FieldDefinition[];
  values: Record<string, string> | ClinicInformation | ClinicHomeContent;
  onSave: (values: Record<string, string>) => void;
}) {
  const [fieldValues, setFieldValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      fields.map(({ key }) => [key, (values as Record<string, string>)[key] ?? ""]),
    ),
  );
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setFieldValues(
      Object.fromEntries(
        fields.map(({ key }) => [key, (values as Record<string, string>)[key] ?? ""]),
      ),
    );
  }, [fields, values]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = Object.fromEntries(
      fields.map(({ key }) => [key, (fieldValues[key] ?? "").trim()]),
    );
    const missing = fields.find(({ key }) => !next[key]);
    if (missing) {
      setError(`${missing.label} is required.`);
      setSaved(false);
      return;
    }
    const email = next["email"];
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      setSaved(false);
      return;
    }
    if (next["phone"] && !/^\+?[\d ()-]{7,20}$/.test(next["phone"])) {
      setError("Enter a valid sample phone number.");
      setSaved(false);
      return;
    }
    if (next["directionsUrl"] && !/^https?:\/\/\S+$/i.test(next["directionsUrl"])) {
      setError("Enter a valid link beginning with http:// or https://.");
      setSaved(false);
      return;
    }
    onSave(next);
    setError("");
    setSaved(true);
  }
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <label
                key={field.key}
                className={`block text-sm font-medium ${field.multiline ? "sm:col-span-2" : ""}`}
              >
                {field.label}
                {field.multiline ? (
                  <textarea
                    name={field.key}
                    required
                    maxLength={1200}
                    value={fieldValues[field.key] ?? ""}
                    onChange={(event) =>
                      setFieldValues((current) => ({ ...current, [field.key]: event.target.value }))
                    }
                    rows={3}
                    className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
                  />
                ) : (
                  <input
                    name={field.key}
                    required
                    maxLength={field.key === "email" ? 254 : 500}
                    value={fieldValues[field.key] ?? ""}
                    onChange={(event) =>
                      setFieldValues((current) => ({ ...current, [field.key]: event.target.value }))
                    }
                    className="mt-1.5 h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
                  />
                )}
              </label>
            ))}
          </div>
          {error ? (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          ) : null}
          {saved ? (
            <p role="status" className="flex items-center gap-1 text-sm text-emerald-800">
              <Check size={15} aria-hidden /> Changes saved in this browser.
            </p>
          ) : null}
          <Button type="submit">Save changes</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ClinicSettings({
  data,
  setData,
  onReset,
}: {
  data: ClinicDemoData;
  setData: React.Dispatch<React.SetStateAction<ClinicDemoData>>;
  onReset: () => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-slate-500">
          Sample contact information displayed around the public website.
        </p>
        <h2 className="mt-1 text-xl font-semibold">Keep the clinic details illustrative</h2>
      </div>
      <SettingsForm
        title="Clinic information"
        description="These details are examples, not contact information for an operating provider."
        fields={clinicFields}
        values={data.clinic}
        onSave={(values) =>
          setData((current) => ({ ...current, clinic: { ...current.clinic, ...values } }))
        }
      />
      <Card className="border-red-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Reset demo data</CardTitle>
          <CardDescription>
            Restore all clinic details and sample records to their initial fictional values.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="border-red-300 text-red-800 hover:bg-red-50"
            onClick={onReset}
          >
            Reset all demo content
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function ProjectTools() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-slate-500">
          This is the existing Supabase-backed project manager, retained separately from fictional
          clinic content.
        </p>
        <h2 className="mt-1 text-xl font-semibold">Project portfolio integration</h2>
      </div>
      <ProjectManager />
    </div>
  );
}

function WebsiteContent({
  data,
  setData,
}: {
  data: ClinicDemoData;
  setData: React.Dispatch<React.SetStateAction<ClinicDemoData>>;
}) {
  const [quote, setQuote] = useState<ClinicTestimonial | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const quoteFields: FieldDefinition[] = [
    { key: "quote", label: "Illustrative quote", multiline: true },
    { key: "attribution", label: "Attribution" },
    {
      key: "context",
      label: "Required context label (e.g. illustrative sample — not a patient review)",
    },
  ];
  function saveQuote(values: Record<string, string>) {
    const entry: ClinicTestimonial = {
      id: quote?.id ?? newId("quote"),
      quote: values["quote"] ?? "",
      attribution: values["attribution"] ?? "",
      context: values["context"] ?? "",
    };
    setData((current) => ({ ...current, testimonials: upsert(current.testimonials, entry) }));
    setQuote(null);
    setDialogOpen(false);
  }
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-slate-500">
          Edit the home page’s sample messaging and illustrative quotes.
        </p>
        <h2 className="mt-1 text-xl font-semibold">Home page content</h2>
      </div>
      <SettingsForm
        title="Hero and home page sections"
        description="Changes appear immediately on the public homepage."
        fields={homeFields}
        values={data.home}
        onSave={(values) =>
          setData((current) => ({ ...current, home: { ...current.home, ...values } }))
        }
      />
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Illustrative sample quotes</CardTitle>
            <CardDescription>
              Never present these as real patient feedback or endorsements.
            </CardDescription>
          </div>
          <Button
            onClick={() => {
              setQuote(null);
              setDialogOpen(true);
            }}
          >
            <Plus size={15} aria-hidden /> Add quote
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.testimonials.length ? (
            data.testimonials.map((entry) => (
              <div key={entry.id} className="rounded-lg border border-slate-200 p-4">
                <p className="text-sm font-medium">“{entry.quote}”</p>
                <p className="mt-2 text-xs text-slate-500">
                  {entry.attribution} · {entry.context}
                </p>
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setQuote(entry);
                      setDialogOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-700"
                    onClick={() => {
                      if (window.confirm("Delete this illustrative quote?"))
                        setData((current) => ({
                          ...current,
                          testimonials: current.testimonials.filter((item) => item.id !== entry.id),
                        }));
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="rounded-lg border border-dashed p-6 text-center text-sm text-slate-500">
              No illustrative quotes. You can add sample copy for layout purposes.
            </p>
          )}
        </CardContent>
      </Card>
      <CatalogDialog
        key={quote?.id ?? "new-quote"}
        section="facilities"
        fields={quoteFields}
        item={quote}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={saveQuote}
        title="Illustrative quote"
        submitLabel="Save quote"
      />
    </div>
  );
}
