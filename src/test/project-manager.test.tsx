import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProjectManager } from "@/components/admin/ProjectManager";
import type { ProjectRecord } from "@/lib/projects";

const { listProjectsMock, uploadProjectImageMock, removeUnreferencedMock, clientMock } = vi.hoisted(
  () => ({
    listProjectsMock: vi.fn(),
    uploadProjectImageMock: vi.fn(),
    removeUnreferencedMock: vi.fn(),
    clientMock: {
      from: vi.fn(),
      storage: {
        from: vi.fn(() => ({
          getPublicUrl: vi.fn((path: string) => ({
            data: { publicUrl: `https://storage.test/${path}` },
          })),
        })),
      },
    },
  }),
);

vi.mock("@/lib/projects", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/lib/projects")>();
  return {
    ...original,
    listProjects: listProjectsMock,
    uploadProjectImage: uploadProjectImageMock,
    removeUnreferencedProjectImages: removeUnreferencedMock,
  };
});

vi.mock("@/lib/supabase", () => ({
  getSupabaseClient: () => clientMock,
}));

const record: ProjectRecord = {
  id: "project-1",
  slug: "sample-project",
  title: "Sample Project",
  status: "completed",
  category: "Residential",
  location: "Pune",
  summary: "Sample summary",
  description: "Sample project description",
  cover_path: "sample-cover.jpg",
  gallery_paths: [],
  published: false,
  sort_order: 0,
};

function setup(initialRecords: ProjectRecord[] = []) {
  let records = [...initialRecords];
  listProjectsMock.mockImplementation(async () =>
    records.map((item) => ({ record: item, project: {} })),
  );

  const insert = vi.fn(async (input: Omit<ProjectRecord, "id">) => {
    records = [...records, { ...input, id: `project-${records.length + 1}` }];
    return { error: null };
  });
  const update = vi.fn((input: Partial<ProjectRecord>) => ({
    eq: vi.fn(async (_column: string, id: string) => {
      records = records.map((item) => (item.id === id ? { ...item, ...input } : item));
      return { error: null };
    }),
  }));
  const remove = vi.fn(() => ({
    eq: vi.fn(async (_column: string, id: string) => {
      records = records.filter((item) => item.id !== id);
      return { error: null };
    }),
  }));

  clientMock.from.mockReturnValue({ insert, update, delete: remove });
  uploadProjectImageMock.mockResolvedValue("uploads/new-cover.jpg");
  removeUnreferencedMock.mockResolvedValue(undefined);

  render(<ProjectManager />);
  return { insert, update, remove };
}

describe("admin project manager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal(
      "confirm",
      vi.fn(() => true),
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("creates a project and stores uploaded object paths", async () => {
    const { insert } = setup();
    await screen.findByText("No database projects yet");
    fireEvent.click(screen.getByRole("button", { name: /add project/i }));

    fireEvent.change(screen.getByLabelText(/project title/i), {
      target: { value: "New Residence" },
    });
    fireEvent.change(screen.getByLabelText(/location/i), { target: { value: "Pune" } });
    fireEvent.change(screen.getByLabelText(/summary/i), { target: { value: "New home project" } });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "A new residential construction project." },
    });
    const coverInput = screen.getByLabelText(/cover image/i) as HTMLInputElement;
    Object.defineProperty(coverInput, "files", {
      configurable: true,
      value: [new File(["image"], "cover.jpg", { type: "image/jpeg" })],
    });
    fireEvent.change(coverInput);
    fireEvent.click(screen.getByRole("button", { name: /save project/i }));

    await waitFor(() => expect(insert).toHaveBeenCalledOnce());
    expect(uploadProjectImageMock).toHaveBeenCalledOnce();
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: "new-residence",
        cover_path: "uploads/new-cover.jpg",
        gallery_paths: [],
        published: false,
      }),
    );
    expect(await screen.findByRole("status")).toHaveTextContent(/created successfully/i);
  });

  it("updates project fields and publication state", async () => {
    const { update } = setup([record]);
    await screen.findByText("Sample Project");
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    fireEvent.change(screen.getByLabelText(/project title/i), {
      target: { value: "Updated Residence" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save project/i }));

    await waitFor(() =>
      expect(update).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Updated Residence",
          slug: "sample-project",
        }),
      ),
    );
    expect(await screen.findByRole("status")).toHaveTextContent(/updated successfully/i);

    fireEvent.click(screen.getByRole("button", { name: "Publish" }));
    await waitFor(() => expect(update).toHaveBeenLastCalledWith({ published: true }));
    expect(await screen.findByText("Published")).toBeInTheDocument();
  });

  it("deletes the project and attempts to remove unreferenced images", async () => {
    const { remove } = setup([record]);
    await screen.findByText("Sample Project");
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => expect(remove).toHaveBeenCalledOnce());
    expect(removeUnreferencedMock).toHaveBeenCalledWith(["sample-cover.jpg"]);
    expect(await screen.findByText("No database projects yet")).toBeInTheDocument();
  });
});
