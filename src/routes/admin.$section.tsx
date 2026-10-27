import { createFileRoute } from "@tanstack/react-router";
import { ClinicAdmin } from "@/components/admin/ClinicAdmin";

export const Route = createFileRoute("/admin/$section")({
  head: () => ({
    meta: [{ title: "Demo Admin — CLARITY HEALTH" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminSectionRoute,
});

function AdminSectionRoute() {
  const { section } = Route.useParams();
  return <ClinicAdmin section={section} />;
}
