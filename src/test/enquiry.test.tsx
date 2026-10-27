import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ClinicDemoDataProvider } from "@/components/ClinicDemoDataProvider";
import { AppointmentRequest } from "@/components/AppointmentRequest";
import { useClinicDemoData } from "@/hooks/use-clinic-demo-data";
import { clinicDemoStorageKey } from "@/lib/clinic-data";

function renderAppointment() {
  return render(
    <ClinicDemoDataProvider>
      <AppointmentRequest />
    </ClinicDemoDataProvider>,
  );
}

function StoredRequestProbe() {
  const { data } = useClinicDemoData();
  return <output>{data.appointments.map((request) => request.name).join(", ")}</output>;
}

describe("clinic demo appointment request", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it("requires a contact method and records a local demo request", async () => {
    renderAppointment();
    fireEvent.change(screen.getByLabelText("Your name"), { target: { value: "Sample Visitor" } });
    fireEvent.change(screen.getByLabelText("Sample department"), {
      target: { value: "Primary care" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save demo request" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Add a phone number or email");

    fireEvent.change(screen.getByLabelText("Phone (optional)"), {
      target: { value: "+1 555 010 7788" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save demo request" }));
    expect(await screen.findByText("This is not a confirmed appointment.")).toBeInTheDocument();
    await waitFor(() => {
      const saved = window.localStorage.getItem(clinicDemoStorageKey);
      expect(saved).toContain("Sample Visitor");
      expect(saved).toContain("New request");
    });
  });

  it("restores submitted demo requests from browser storage", async () => {
    window.localStorage.setItem(
      clinicDemoStorageKey,
      JSON.stringify({
        clinic: {
          name: "CLARITY HEALTH",
          tagline: "Sample",
          phone: "+1 202-555-0124",
          email: "hello@clarityhealth.example",
          address: "100 Example Lane",
          hours: "Weekdays",
          directionsUrl: "https://example.invalid",
        },
        home: {
          heroEyebrow: "Demo",
          heroTitle: "Sample",
          heroDescription: "Sample",
          aboutTitle: "Sample",
          aboutDescription: "Sample",
          appointmentCta: "Request",
          testimonialsNote: "Not a patient review",
        },
        doctors: [],
        services: [],
        departments: [],
        facilities: [],
        testimonials: [],
        appointments: [
          {
            id: "request-persisted",
            name: "Persistent Demo",
            email: "persistent@example.invalid",
            phone: "",
            department: "Primary care",
            preferredDoctor: "No preference",
            preferredDate: "Flexible",
            receivedAt: "Demo sample",
            status: "New request",
          },
        ],
      }),
    );

    render(
      <ClinicDemoDataProvider>
        <StoredRequestProbe />
      </ClinicDemoDataProvider>,
    );
    await waitFor(() =>
      expect(window.localStorage.getItem(clinicDemoStorageKey)).toContain("Persistent Demo"),
    );
    expect(await screen.findByText("Persistent Demo")).toBeInTheDocument();
  });
});
