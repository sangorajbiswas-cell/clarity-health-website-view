import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/$section")({
  head: () => ({
    meta: [{ title: "Demo Admin — IRON DISTRICT" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminSectionRoute,
});

function AdminSectionRoute() {
  return null;
}
