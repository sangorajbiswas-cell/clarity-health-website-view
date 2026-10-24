import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import {
  BriefcaseBusiness,
  FileText,
  Hammer,
  Inbox,
  LayoutDashboard,
  Menu,
  ShieldCheck,
  Star,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import { site } from "@/content/site";
import { getSupabaseClient, SupabaseConfigurationError } from "@/lib/supabase";
import { ProjectManager } from "@/components/admin/ProjectManager";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin — BuildTrust" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminPage,
});

type AdminState =
  | { status: "loading" | "signed-out" | "checking" | "authorized" | "unauthorized" }
  | { status: "configuration-error" | "error"; message: string };

const adminSections = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "projects", label: "Projects", icon: BriefcaseBusiness },
  { id: "services", label: "Services", icon: Wrench },
  { id: "testimonials", label: "Testimonials", icon: Star },
  { id: "content", label: "Website content", icon: FileText },
  { id: "enquiries", label: "Enquiries", icon: Inbox },
] as const;

type AdminSection = (typeof adminSections)[number]["id"];

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "An unexpected error occurred.";
}

function SectionUnavailable({
  icon: Icon,
  title,
  detail,
}: {
  icon: LucideIcon;
  title: string;
  detail: string;
}) {
  return (
    <section
      className="mt-8 rounded-lg border bg-card p-6 sm:p-8"
      aria-labelledby="section-unavailable-title"
    >
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
          <Icon size={25} aria-hidden />
        </span>
        <p className="eyebrow mt-5">Not implemented yet</p>
        <h3 id="section-unavailable-title" className="mt-2 text-xl font-bold">
          {title}
        </h3>
        <p className="mt-2 text-muted-foreground">{detail}</p>
      </div>
    </section>
  );
}

function AdminDashboard({ onSignOut, signingOut }: { onSignOut: () => void; signingOut: boolean }) {
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");
  const [navigationOpen, setNavigationOpen] = useState(false);
  const activeItem = adminSections.find((section) => section.id === activeSection)!;
  const ActiveIcon = activeItem.icon;

  return (
    <div className="flex min-h-screen bg-background">
      {navigationOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-ink/50 md:hidden"
          aria-label="Close navigation"
          onClick={() => setNavigationOpen(false)}
        />
      ) : null}

      <aside
        id="admin-navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-ink text-ink-foreground transition-transform md:static md:z-auto md:w-64 md:translate-x-0 ${
          navigationOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex min-h-20 items-center justify-between border-b border-ink-foreground/15 px-6">
          <div>
            <p className="font-display text-xl font-extrabold">
              Build<span className="text-primary">Trust</span>
            </p>
            <p className="mt-0.5 text-xs tracking-[0.16em] text-ink-foreground/65">CONSTRUCTIONS</p>
          </div>
          <button
            type="button"
            className="rounded-md p-2 hover:bg-ink-foreground/10 md:hidden"
            aria-label="Close navigation"
            onClick={() => setNavigationOpen(false)}
          >
            <X size={20} aria-hidden />
          </button>
        </div>

        <div className="px-4 pt-7">
          <p className="px-3 text-xs font-bold uppercase tracking-[0.16em] text-ink-foreground/50">
            Workspace
          </p>
          <nav className="mt-3 space-y-1" aria-label="Admin sections">
            {adminSections.map(({ id, label, icon: Icon }) => {
              const selected = activeSection === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-current={selected ? "page" : undefined}
                  onClick={() => {
                    setActiveSection(id);
                    setNavigationOpen(false);
                  }}
                  className={`flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-left text-sm font-semibold transition-colors ${
                    selected
                      ? "bg-primary text-primary-foreground"
                      : "text-ink-foreground/80 hover:bg-ink-foreground/10 hover:text-ink-foreground"
                  }`}
                >
                  <Icon size={18} aria-hidden />
                  {label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-ink-foreground/15 p-5">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <ShieldCheck size={18} aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold">Administrator</p>
              <p className="text-xs text-ink-foreground/60">Membership verified</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex min-h-20 items-center justify-between border-b bg-card/95 px-4 backdrop-blur sm:px-6 lg:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="rounded-md border bg-background p-2 md:hidden"
              aria-label="Open navigation"
              aria-expanded={navigationOpen}
              aria-controls="admin-navigation"
              onClick={() => setNavigationOpen(true)}
            >
              <Menu size={20} aria-hidden />
            </button>
            <div className="min-w-0">
              <p className="hidden text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:block">
                {site.name}
              </p>
              <h1 className="truncate text-xl font-bold sm:text-2xl">{activeItem.label}</h1>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-outline !min-h-10 !px-3 sm:!px-4"
            onClick={onSignOut}
            disabled={signingOut}
          >
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </header>

        <main className="w-full flex-1 px-4 py-7 sm:px-6 sm:py-9 lg:px-10">
          <div className="mx-auto max-w-6xl">
            {activeSection === "overview" ? (
              <>
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                  <div>
                    <p className="eyebrow">Admin workspace</p>
                    <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Welcome back</h2>
                    <p className="mt-2 max-w-2xl text-muted-foreground">
                      Manage your website content and enquiries from one place.
                    </p>
                  </div>
                  <div className="inline-flex w-fit items-center gap-2 rounded-full border bg-card px-3 py-2 text-sm font-semibold">
                    <span className="size-2 rounded-full bg-primary" aria-hidden />
                    Administrator access verified
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {adminSections.slice(1).map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setActiveSection(id)}
                      className="group rounded-lg border bg-card p-5 text-left transition-colors hover:border-primary/60 hover:bg-accent/40"
                    >
                      <span className="flex size-10 items-center justify-center rounded-md bg-secondary text-primary transition-colors group-hover:bg-accent">
                        <Icon size={20} aria-hidden />
                      </span>
                      <span className="mt-4 block font-display text-lg font-bold">{label}</span>
                      <span className="mt-1 block text-sm text-muted-foreground">
                        {id === "projects" ? "Manage portfolio" : "Not implemented yet"}
                      </span>
                    </button>
                  ))}
                </div>

                <section className="mt-8 rounded-lg border bg-card p-5 sm:p-7">
                  <div className="flex items-start gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-accent text-primary">
                      <Hammer size={20} aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold">Your content source</h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        Public website content is currently maintained in{" "}
                        <code className="rounded bg-secondary px-1.5 py-0.5 text-foreground">
                          src/content/site.ts
                        </code>
                        . Project records can now be managed from this workspace. Other website
                        content remains source-managed, and enquiries are not stored in the
                        database.
                      </p>
                    </div>
                  </div>
                </section>
              </>
            ) : activeSection === "projects" ? (
              <>
                <div className="flex items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-accent text-primary">
                    <ActiveIcon size={22} aria-hidden />
                  </span>
                  <div>
                    <p className="eyebrow">Workspace section</p>
                    <h2 className="mt-1 text-3xl font-extrabold">{activeItem.label}</h2>
                    <p className="mt-2 max-w-2xl text-muted-foreground">
                      Create, update, and publish the projects shown on your public website.
                    </p>
                  </div>
                </div>
                <ProjectManager />
              </>
            ) : (
              <>
                <div className="flex items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-accent text-primary">
                    <ActiveIcon size={22} aria-hidden />
                  </span>
                  <div>
                    <p className="eyebrow">Workspace section</p>
                    <h2 className="mt-1 text-3xl font-extrabold">{activeItem.label}</h2>
                    <p className="mt-2 max-w-2xl text-muted-foreground">
                      {sectionDescription(activeSection)}
                    </p>
                  </div>
                </div>
                <SectionUnavailable
                  icon={ActiveIcon}
                  title={`${activeItem.label} management is not connected yet`}
                  detail={sectionLimitation(activeSection)}
                />
              </>
            )}
          </div>
        </main>
        <footer className="border-t px-4 py-4 text-center text-xs text-muted-foreground sm:px-6 lg:px-10">
          {site.name} · Admin workspace
        </footer>
      </div>
    </div>
  );
}

function sectionDescription(section: Exclude<AdminSection, "overview">): string {
  switch (section) {
    case "projects":
      return "Review and manage the construction projects shown on your public website.";
    case "services":
      return "Maintain the services and guidance presented to prospective clients.";
    case "testimonials":
      return "Manage client feedback displayed on the public website.";
    case "content":
      return "Update the public website's business details and page content.";
    case "enquiries":
      return "Review and follow up on prospective client enquiries.";
  }
}

function sectionLimitation(section: Exclude<AdminSection, "overview">): string {
  switch (section) {
    case "projects":
      return "Project management is available in this workspace.";
    case "services":
      return "The current database has no services table or admin API. Service content remains in the website source and cannot be changed here.";
    case "testimonials":
      return "The current database has no testimonials table or admin API. No testimonial records can be managed here.";
    case "content":
      return "Website content is maintained in src/content/site.ts. Database-backed content editing has not been implemented.";
    case "enquiries":
      return "The contact form currently hands off to WhatsApp and does not store enquiries in the database.";
  }
}

export function AdminPage() {
  const [adminState, setAdminState] = useState<AdminState>({ status: "loading" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const [signInError, setSignInError] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let active = true;
    let checkId = 0;
    let unsubscribe: (() => void) | undefined;

    const setFailure = (error: unknown, context: string) => {
      if (!active) return;
      if (error instanceof SupabaseConfigurationError) {
        setAdminState({ status: "configuration-error", message: error.message });
      } else {
        setAdminState({ status: "error", message: `${context}: ${errorMessage(error)}` });
      }
    };

    const verifyMembership = async (
      client: ReturnType<typeof getSupabaseClient>,
      session: Session | null,
    ) => {
      const currentCheck = ++checkId;
      if (!session) {
        setAdminState({ status: "signed-out" });
        return;
      }

      setAdminState({ status: "checking" });
      try {
        const { data, error } = await client
          .from("admins")
          .select("user_id")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (!active || currentCheck !== checkId) return;
        if (error) throw error;
        setAdminState({ status: data ? "authorized" : "unauthorized" });
      } catch (error) {
        if (active && currentCheck === checkId) {
          setFailure(error, "Unable to verify administrator membership");
        }
      }
    };

    try {
      const client = getSupabaseClient();
      const { data } = client.auth.onAuthStateChange((_event, session) => {
        window.setTimeout(() => {
          if (active) void verifyMembership(client, session);
        }, 0);
      });
      unsubscribe = () => data.subscription.unsubscribe();

      void client.auth
        .getSession()
        .then(({ data: sessionData, error }) => {
          if (!active) return;
          if (error) {
            setFailure(error, "Unable to check the current sign-in");
            return;
          }
          void verifyMembership(client, sessionData.session);
        })
        .catch((error: unknown) => setFailure(error, "Unable to check the current sign-in"));
    } catch (error) {
      setFailure(error, "Unable to initialize Supabase");
    }

    return () => {
      active = false;
      checkId += 1;
      unsubscribe?.();
    };
  }, []);

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSigningIn(true);
    setSignInError("");

    try {
      const { error } = await getSupabaseClient().auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) setSignInError(error.message);
    } catch (error) {
      setSignInError(errorMessage(error));
      if (error instanceof SupabaseConfigurationError) {
        setAdminState({ status: "configuration-error", message: error.message });
      }
    } finally {
      setSigningIn(false);
    }
  }

  async function handleSignOut() {
    setSigningOut(true);
    try {
      const { error } = await getSupabaseClient().auth.signOut();
      if (error)
        setAdminState({ status: "error", message: `Unable to sign out: ${error.message}` });
    } catch (error) {
      setAdminState({ status: "error", message: `Unable to sign out: ${errorMessage(error)}` });
    } finally {
      setSigningOut(false);
    }
  }

  if (adminState.status === "authorized") {
    return <AdminDashboard onSignOut={handleSignOut} signingOut={signingOut} />;
  }

  return (
    <section className="mx-auto max-w-xl px-4 py-20">
      <h1 className="text-3xl font-extrabold">BuildTrust admin</h1>

      {adminState.status === "loading" || adminState.status === "checking" ? (
        <p className="mt-3 text-muted-foreground" role="status">
          {adminState.status === "loading"
            ? "Checking sign-in…"
            : "Verifying administrator access…"}
        </p>
      ) : null}

      {adminState.status === "signed-out" ? (
        <>
          <p className="mt-3 text-muted-foreground">
            Sign in with your existing administrator account.
          </p>
          <form onSubmit={handleSignIn} className="mt-6 grid gap-4">
            <div>
              <label htmlFor="admin-email" className="mb-1 block font-semibold">
                Email
              </label>
              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="field"
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="mb-1 block font-semibold">
                Password
              </label>
              <input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="field"
              />
            </div>
            {signInError ? (
              <p className="text-sm text-destructive" role="alert">
                {signInError}
              </p>
            ) : null}
            <button type="submit" className="btn btn-primary" disabled={signingIn}>
              {signingIn ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </>
      ) : null}

      {adminState.status === "unauthorized" ? (
        <div className="mt-4" role="alert">
          <p className="text-destructive">
            This account is signed in but is not an authorized administrator.
          </p>
          <button
            type="button"
            className="btn btn-outline mt-4"
            onClick={handleSignOut}
            disabled={signingOut}
          >
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      ) : null}

      {adminState.status === "configuration-error" || adminState.status === "error" ? (
        <p className="mt-4 text-destructive" role="alert">
          {adminState.message}
        </p>
      ) : null}

      <a href="/" className="btn btn-primary mt-6">
        Back to site
      </a>
    </section>
  );
}
