import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — BuildTrust" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <section className="mx-auto max-w-xl px-4 py-20">
      <h1 className="text-3xl font-extrabold">Admin dashboard</h1>
      <p className="mt-3 text-muted-foreground">The admin panel will be switched on once the BuildTrust database is connected to this website. No sign-in is possible yet.</p>
      <Link to="/" className="btn btn-primary mt-6">Back to site</Link>
    </section>
  ),
});
