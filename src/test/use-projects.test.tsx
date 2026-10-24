import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { projects as fallbackProjects } from "@/content/site";

const { listProjectsMock } = vi.hoisted(() => ({
  listProjectsMock: vi.fn(),
}));

vi.mock("@/lib/projects", () => ({
  listProjects: listProjectsMock,
}));

import { usePublishedProjects } from "@/hooks/use-projects";

function ProjectList() {
  const projects = usePublishedProjects();
  return (
    <ul>
      {projects.map((project) => (
        <li key={project.slug}>{project.title}</li>
      ))}
    </ul>
  );
}

describe("public project fallback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("uses published database projects when available", async () => {
    listProjectsMock.mockResolvedValue([
      { project: { ...fallbackProjects[0]!, slug: "published", title: "Published project" } },
    ]);

    render(<ProjectList />);

    expect(await screen.findByText("Published project")).toBeInTheDocument();
    expect(screen.queryByText(fallbackProjects[0]!.title)).not.toBeInTheDocument();
  });

  it("keeps hardcoded projects when the database has no published projects", async () => {
    listProjectsMock.mockResolvedValue([]);

    render(<ProjectList />);

    await waitFor(() => expect(listProjectsMock).toHaveBeenCalledWith({ publishedOnly: true }));
    expect(screen.getByText(fallbackProjects[0]!.title)).toBeInTheDocument();
  });

  it("keeps hardcoded projects and reports a database read failure", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    listProjectsMock.mockRejectedValue(new Error("Database unavailable"));

    render(<ProjectList />);

    await waitFor(() =>
      expect(console.error).toHaveBeenCalledWith(
        "Unable to load published projects; using local content.",
        expect.any(Error),
      ),
    );
    expect(screen.getByText(fallbackProjects[0]!.title)).toBeInTheDocument();
  });
});
