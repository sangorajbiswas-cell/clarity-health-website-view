import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { ClinicAdmin } from "@/components/admin/ClinicAdmin";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Demo Admin — CLARITY HEALTH" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminRoute,
});

function AdminRoute() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return pathname === "/admin" ? <ClinicAdmin /> : <Outlet />;
}
