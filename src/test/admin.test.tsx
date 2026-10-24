import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { getSupabaseClientMock } = vi.hoisted(() => ({
  getSupabaseClientMock: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  getSupabaseClient: getSupabaseClientMock,
  SupabaseConfigurationError: class SupabaseConfigurationError extends Error {},
}));

import { AdminPage } from "@/routes/admin";

const session: Session = {
  access_token: "test-access-token",
  refresh_token: "test-refresh-token",
  token_type: "bearer",
  expires_in: 3600,
  expires_at: 1792861200,
  user: {
    id: "test-admin-user",
    aud: "authenticated",
    role: "authenticated",
    email: "admin@example.test",
    app_metadata: { provider: "email", providers: ["email"] },
    user_metadata: {},
    created_at: "2026-10-24T00:00:00.000Z",
    updated_at: "2026-10-24T00:00:00.000Z",
  },
};

function createClientMock(
  currentSession: Session | null,
  membership: { user_id: string } | null,
  membershipError: Error | null = null,
  signInSession: Session | null = currentSession,
) {
  let authListener: ((event: AuthChangeEvent, session: Session | null) => void) | undefined;
  const maybeSingle = vi.fn().mockResolvedValue({ data: membership, error: membershipError });
  const eq = vi.fn().mockReturnValue({ maybeSingle });
  const select = vi.fn().mockReturnValue({ eq });
  const projectQuery = {
    select: vi.fn(),
    order: vi.fn().mockResolvedValue({ data: [], error: null }),
  };
  projectQuery.select.mockReturnValue(projectQuery);
  const client = {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: currentSession }, error: null }),
      onAuthStateChange: vi.fn((callback: typeof authListener) => {
        authListener = callback;
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      }),
      signInWithPassword: vi.fn(async () => {
        authListener?.("SIGNED_IN", signInSession);
        return {
          data: { session: signInSession, user: signInSession?.user ?? null },
          error: null,
        };
      }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
    from: vi.fn((table: string) => (table === "admins" ? { select } : projectQuery)),
  };

  return { client, maybeSingle };
}

describe("admin authentication and authorization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("shows protected admin state only after membership is verified", async () => {
    const { client, maybeSingle } = createClientMock(session, { user_id: session.user.id });
    getSupabaseClientMock.mockReturnValue(client);

    render(<AdminPage />);

    expect(await screen.findByText(/administrator access verified/i)).toBeInTheDocument();
    expect(client.from).toHaveBeenCalledWith("admins");
    expect(maybeSingle).toHaveBeenCalled();
  });

  it("denies an authenticated user without an admins membership row", async () => {
    const { client } = createClientMock(session, null);
    getSupabaseClientMock.mockReturnValue(client);

    render(<AdminPage />);

    expect(await screen.findByText(/not an authorized administrator/i)).toBeInTheDocument();
    expect(screen.queryByText(/administrator access verified/i)).not.toBeInTheDocument();
  });

  it("signs in with email and password and then checks membership", async () => {
    const { client } = createClientMock(null, { user_id: session.user.id }, null, session);
    getSupabaseClientMock.mockReturnValue(client);

    render(<AdminPage />);
    fireEvent.change(await screen.findByLabelText("Email"), {
      target: { value: "admin@example.test" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "test-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByText(/administrator access verified/i)).toBeInTheDocument();
    expect(client.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "admin@example.test",
      password: "test-password",
    });
  });

  it("fails closed when membership verification returns an error", async () => {
    const { client } = createClientMock(session, null, new Error("Membership query denied"));
    getSupabaseClientMock.mockReturnValue(client);

    render(<AdminPage />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /unable to verify administrator membership/i,
    );
    expect(screen.queryByText(/administrator access verified/i)).not.toBeInTheDocument();
  });

  it("shows the dashboard sections without claiming unsupported backend features", async () => {
    const { client } = createClientMock(session, { user_id: session.user.id });
    getSupabaseClientMock.mockReturnValue(client);

    render(<AdminPage />);

    expect(await screen.findByRole("heading", { name: "Welcome back" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Admin sections" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Enquiries" }));
    expect(await screen.findByRole("heading", { name: "Enquiries", level: 2 })).toBeInTheDocument();
    expect(screen.getByText("Not implemented yet")).toBeInTheDocument();
    expect(screen.getByText(/does not store enquiries in the database/i)).toBeInTheDocument();
  });

  it("opens project management and shows an empty database state", async () => {
    const { client } = createClientMock(session, { user_id: session.user.id });
    getSupabaseClientMock.mockReturnValue(client);

    render(<AdminPage />);

    expect(await screen.findByRole("heading", { name: "Welcome back" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Projects" }));

    expect(
      await screen.findByText(
        "Create, update, and publish the projects shown on your public website.",
      ),
    ).toBeInTheDocument();
    expect(await screen.findByText("No database projects yet")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add project/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /add project/i }));
    const saveButton = screen.getByRole("button", { name: /save project/i });
    fireEvent.submit(saveButton.closest("form")!);
    expect(await screen.findByRole("alert")).toHaveTextContent(/enter a project title/i);
  });
});
