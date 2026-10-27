import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/memberships")({
  beforeLoad: () => {
    throw redirect({ to: "/services" });
  },
});
