import { createFileRoute } from "@tanstack/react-router";
import { GymAdmin } from "@/components/admin/GymAdmin";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Demo Admin — IRON DISTRICT" }, { name: "robots", content: "noindex" }],
  }),
  component: GymAdmin,
});
