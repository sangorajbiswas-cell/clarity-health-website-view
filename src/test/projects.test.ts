import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  listProjects,
  maxProjectImageSize,
  projectFromRecord,
  validateProjectImage,
  type ProjectRecord,
} from "@/lib/projects";

const { getSupabaseClientMock } = vi.hoisted(() => ({
  getSupabaseClientMock: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  getSupabaseClient: getSupabaseClientMock,
}));

const record: ProjectRecord = {
  id: "project-1",
  slug: "sample-project",
  title: "Sample Project",
  status: "completed",
  category: "Residential",
  location: "Pune",
  summary: "A sample summary",
  description: "A sample project description",
  cover_path: "cover.webp",
  gallery_paths: ["gallery.webp"],
  published: true,
  sort_order: 0,
};

function mockClient(data: ProjectRecord[] | null, error: Error | null = null) {
  const query = {
    select: vi.fn(),
    eq: vi.fn(),
    order: vi.fn(),
  };
  query.select.mockReturnValue(query);
  query.eq.mockReturnValue(query);
  query.order.mockResolvedValue({ data, error });

  getSupabaseClientMock.mockReturnValue({
    from: vi.fn().mockReturnValue(query),
    storage: {
      from: vi.fn().mockReturnValue({
        getPublicUrl: vi.fn((path: string) => ({
          data: { publicUrl: `https://storage.example.test/${path}` },
        })),
      }),
    },
  });
  return query;
}

describe("project data integration", () => {
  beforeEach(() => vi.clearAllMocks());

  it("maps database storage paths to public URLs for the existing Project shape", () => {
    mockClient([]);
    expect(projectFromRecord(record)).toEqual({
      slug: "sample-project",
      title: "Sample Project",
      status: "completed",
      category: "Residential",
      location: "Pune",
      summary: "A sample summary",
      description: "A sample project description",
      cover: "https://storage.example.test/cover.webp",
      gallery: [
        "https://storage.example.test/cover.webp",
        "https://storage.example.test/gallery.webp",
      ],
    });
  });

  it("loads published projects ordered by sort_order", async () => {
    const query = mockClient([record]);

    const result = await listProjects({ publishedOnly: true });

    expect(query.eq).toHaveBeenCalledWith("published", true);
    expect(query.order).toHaveBeenCalledWith("sort_order", { ascending: true });
    expect(result[0]?.record).toEqual(record);
  });

  it("propagates Supabase read errors instead of presenting a false empty result", async () => {
    const error = new Error("Permission denied");
    mockClient(null, error);

    await expect(listProjects()).rejects.toBe(error);
  });

  it("accepts only JPEG, PNG, and WebP images up to five megabytes", () => {
    expect(
      validateProjectImage(new File(["image"], "cover.jpg", { type: "image/jpeg" })),
    ).toBeNull();
    expect(
      validateProjectImage(
        new File([new Uint8Array(maxProjectImageSize)], "cover.webp", { type: "image/webp" }),
      ),
    ).toBeNull();
    expect(validateProjectImage(new File(["image"], "cover.gif", { type: "image/gif" }))).toMatch(
      /jpeg, png, or webp/i,
    );
    expect(
      validateProjectImage(
        new File([new Uint8Array(maxProjectImageSize + 1)], "large.png", { type: "image/png" }),
      ),
    ).toMatch(/5 mb or smaller/i);
  });
});
