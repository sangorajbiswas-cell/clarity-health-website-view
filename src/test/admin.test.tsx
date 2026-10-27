import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GymDemoDataProvider } from "@/components/GymDemoDataProvider";
import { GymCatalog } from "@/components/admin/GymCatalog";
import { useGymDemoData } from "@/hooks/use-gym-demo-data";
import { gymDemoStorageKey } from "@/lib/gym-data";

function PublicCatalogProbe() {
  const { data } = useGymDemoData();
  return (
    <output aria-label="Public program list">
      {data.programs.map((program) => program.title).join(", ")}
    </output>
  );
}

function renderCatalog(
  kind: "programs" | "trainers" | "plans" | "offers" | "facilities" | "gallery",
) {
  return render(
    <GymDemoDataProvider>
      <GymCatalog kind={kind} />
      <PublicCatalogProbe />
    </GymDemoDataProvider>,
  );
}

describe("shared gym demo catalog", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.stubGlobal(
      "confirm",
      vi.fn(() => true),
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("creates and immediately publishes a program, then persists it across refresh", async () => {
    const firstRender = renderCatalog("programs");
    fireEvent.click(await screen.findByRole("button", { name: "Add program" }));
    fireEvent.change(screen.getByLabelText("Program name"), { target: { value: "Demo Mobility" } });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "An illustrative movement session." },
    });
    fireEvent.change(screen.getByLabelText("Program type"), { target: { value: "Mobility" } });
    fireEvent.change(screen.getByLabelText("Session length"), { target: { value: "40 min" } });
    fireEvent.change(screen.getByLabelText("Lead trainer"), { target: { value: "Demo Coach" } });
    fireEvent.change(screen.getByLabelText("Experience level"), {
      target: { value: "All levels" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create program" }));

    expect(await screen.findByText("Demo Mobility")).toBeInTheDocument();
    expect(screen.getByLabelText("Public program list")).toHaveTextContent("Demo Mobility");
    await waitFor(() => {
      expect(window.localStorage.getItem(gymDemoStorageKey)).toContain("Demo Mobility");
    });

    firstRender.unmount();
    renderCatalog("programs");
    expect(await screen.findByText("Demo Mobility")).toBeInTheDocument();
  });

  it("edits and deletes an offer with confirmation", async () => {
    renderCatalog("offers");
    await screen.findByText("First visit is on us");
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    fireEvent.change(screen.getByLabelText("Offer title"), {
      target: { value: "Updated demo offer" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
    expect(await screen.findByText("Updated demo offer")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(await screen.findByText("No offers & promotions yet")).toBeInTheDocument();
    expect(window.confirm).toHaveBeenCalled();
  });

  it("creates trainer records in the persisted shared catalog", async () => {
    renderCatalog("trainers");
    fireEvent.click(await screen.findByRole("button", { name: "Add trainer" }));
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Demo Trainer" } });
    fireEvent.change(screen.getByLabelText("Specialty / role"), { target: { value: "Strength" } });
    fireEvent.change(screen.getByLabelText("Experience"), { target: { value: "3 years" } });
    fireEvent.change(screen.getByLabelText("Specialties (comma separated)"), {
      target: { value: "Strength, mobility" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create trainer" }));
    expect(await screen.findByText("Demo Trainer")).toBeInTheDocument();
    expect(window.localStorage.getItem(gymDemoStorageKey)).toContain("Demo Trainer");
  });

  it("creates a membership with sample pricing and billing period", async () => {
    renderCatalog("plans");
    fireEvent.click(await screen.findByRole("button", { name: "Add membership" }));
    fireEvent.change(screen.getByLabelText("Plan name"), { target: { value: "Sample Monthly" } });
    fireEvent.change(screen.getByLabelText("Price"), { target: { value: "₹1,999" } });
    fireEvent.change(screen.getByLabelText("Billing period"), { target: { value: "/ month" } });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Illustrative plan." },
    });
    fireEvent.change(screen.getByLabelText("Features (comma separated)"), {
      target: { value: "Open gym, locker" },
    });
    fireEvent.click(screen.getByRole("combobox", { name: "Recommended? (yes/no)" }));
    fireEvent.click(await screen.findByRole("option", { name: "No" }));
    fireEvent.click(screen.getByRole("button", { name: "Create membership" }));
    expect(await screen.findByText("Sample Monthly")).toBeInTheDocument();
  });
});
