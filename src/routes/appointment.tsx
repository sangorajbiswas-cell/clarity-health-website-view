import { createFileRoute } from "@tanstack/react-router";
import { AppointmentRequest } from "@/components/AppointmentRequest";

export const Route = createFileRoute("/appointment")({
  head: () => ({
    meta: [
      { title: "Request an appointment — CLARITY HEALTH demo" },
      {
        name: "description",
        content:
          "Send a fictional, browser-local appointment request. No booking or clinical consultation is made.",
      },
    ],
  }),
  component: AppointmentRequest,
});
