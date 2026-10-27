import { useMemo, useState, type FormEvent } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useGymDemoData } from "@/hooks/use-gym-demo-data";
import type {
  GymDemoData,
  GymFacility,
  GymGalleryItem,
  GymOffer,
  GymPlan,
  GymProgram,
  GymTrainer,
} from "@/lib/gym-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CatalogKind = "programs" | "trainers" | "plans" | "offers" | "facilities" | "gallery";
type CatalogItem = GymProgram | GymTrainer | GymPlan | GymOffer | GymFacility | GymGalleryItem;
type Field = { key: string; label: string; required?: boolean; type?: string };

const configs: Record<CatalogKind, { label: string; singular: string; fields: Field[] }> = {
  programs: {
    label: "Workout programs",
    singular: "program",
    fields: [
      { key: "title", label: "Program name", required: true },
      { key: "summary", label: "Description", required: true },
      { key: "category", label: "Program type", required: true },
      { key: "duration", label: "Session length", required: true },
      { key: "coach", label: "Lead trainer", required: true },
      { key: "level", label: "Experience level", required: true },
      { key: "image", label: "Image URL", type: "url" },
      { key: "includes", label: "Features (comma separated)" },
    ],
  },
  trainers: {
    label: "Trainer profiles",
    singular: "trainer",
    fields: [
      { key: "name", label: "Name", required: true },
      { key: "role", label: "Specialty / role", required: true },
      { key: "experience", label: "Experience", required: true },
      { key: "specialties", label: "Specialties (comma separated)", required: true },
      { key: "image", label: "Portrait URL", type: "url" },
    ],
  },
  plans: {
    label: "Membership plans",
    singular: "membership",
    fields: [
      { key: "name", label: "Plan name", required: true },
      { key: "price", label: "Price", required: true },
      { key: "period", label: "Billing period", required: true },
      { key: "description", label: "Description", required: true },
      { key: "features", label: "Features (comma separated)", required: true },
      { key: "featured", label: "Recommended? (yes/no)", required: true },
    ],
  },
  offers: {
    label: "Offers & promotions",
    singular: "offer",
    fields: [
      { key: "title", label: "Offer title", required: true },
      { key: "description", label: "Description", required: true },
      { key: "code", label: "Offer code" },
      { key: "endDate", label: "End date / note", required: true },
    ],
  },
  facilities: {
    label: "Facilities",
    singular: "facility",
    fields: [
      { key: "name", label: "Facility name", required: true },
      { key: "description", label: "Description", required: true },
      { key: "image", label: "Image URL", type: "url", required: true },
      { key: "alt", label: "Accessible image description", required: true },
    ],
  },
  gallery: {
    label: "Photo gallery",
    singular: "gallery image",
    fields: [
      { key: "image", label: "Image URL", type: "url", required: true },
      { key: "alt", label: "Accessible image description", required: true },
      { key: "caption", label: "Caption", required: true },
    ],
  },
};

const id = () => `demo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const parseList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

function getFields(kind: CatalogKind, item?: CatalogItem): Record<string, string> {
  if (!item) {
    return Object.fromEntries(configs[kind].fields.map((field) => [field.key, ""]));
  }
  switch (kind) {
    case "programs": {
      const value = item as GymProgram;
      return {
        title: value.title,
        summary: value.summary,
        category: value.category,
        duration: value.duration,
        coach: value.coach,
        level: value.level,
        image: value.image,
        includes: value.includes.join(", "),
      };
    }
    case "trainers": {
      const value = item as GymTrainer;
      return {
        name: value.name,
        role: value.role,
        experience: value.experience,
        specialties: value.specialties.join(", "),
        image: value.image,
      };
    }
    case "plans": {
      const value = item as GymPlan;
      return {
        name: value.name,
        price: value.price,
        period: value.period,
        description: value.description,
        features: value.features.join(", "),
        featured: value.featured ? "yes" : "no",
      };
    }
    case "offers": {
      const value = item as GymOffer;
      return {
        title: value.title,
        description: value.description,
        code: value.code,
        endDate: value.endDate,
      };
    }
    case "facilities": {
      const value = item as GymFacility;
      return {
        name: value.name,
        description: value.description,
        image: value.image,
        alt: value.alt,
      };
    }
    case "gallery": {
      const value = item as GymGalleryItem;
      return { image: value.image, alt: value.alt, caption: value.caption };
    }
  }
}

function listItems(
  kind: CatalogKind,
  data: GymDemoData,
): { item: CatalogItem; title: string; description: string; image?: string; active?: boolean }[] {
  switch (kind) {
    case "programs":
      return data.programs.map((item) => ({
        item,
        title: item.title,
        description: `${item.category} · ${item.duration} · ${item.level}`,
        image: item.image,
      }));
    case "trainers":
      return data.trainers.map((item) => ({
        item,
        title: item.name,
        description: `${item.role} · ${item.experience}`,
        image: item.image,
      }));
    case "plans":
      return data.plans.map((item) => ({
        item,
        title: item.name,
        description: `${item.price} ${item.period} · ${item.description}`,
        active: item.active,
      }));
    case "offers":
      return data.offers.map((item) => ({
        item,
        title: item.title,
        description: `${item.code || "No code"} · ${item.endDate}`,
        active: item.active,
      }));
    case "facilities":
      return data.facilities.map((item) => ({
        item,
        title: item.name,
        description: item.description,
        image: item.image,
      }));
    case "gallery":
      return data.gallery.map((item) => ({
        item,
        title: item.caption,
        description: item.alt,
        image: item.image,
      }));
  }
}

function saveItem(
  kind: CatalogKind,
  fields: Record<string, string>,
  editingId: string | null,
  data: GymDemoData,
): GymDemoData {
  const recordId = editingId ?? id();
  const current = listItems(kind, data);
  const existing = current.find((entry) => entry.item.id === editingId)?.item;
  const next = (() => {
    switch (kind) {
      case "programs": {
        const title = fields["title"]!.trim();
        return {
          id: recordId,
          slug: title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, ""),
          title,
          summary: fields["summary"]!.trim(),
          category: fields["category"]!.trim(),
          duration: fields["duration"]!.trim(),
          coach: fields["coach"]!.trim(),
          level: fields["level"]!.trim(),
          image: fields["image"]!.trim(),
          includes: parseList(fields["includes"] ?? ""),
          rateGuide: "Illustrative demo program",
        } satisfies GymProgram;
      }
      case "trainers": {
        const name = fields["name"]!.trim();
        return {
          id: recordId,
          name,
          role: fields["role"]!.trim(),
          experience: fields["experience"]!.trim(),
          specialties: parseList(fields["specialties"]!),
          image: fields["image"]!.trim(),
          initials: name
            .split(/\s+/)
            .map((part) => part[0] ?? "")
            .join("")
            .slice(0, 2)
            .toUpperCase(),
        } satisfies GymTrainer;
      }
      case "plans":
        return {
          id: recordId,
          name: fields["name"]!.trim(),
          price: fields["price"]!.trim(),
          period: fields["period"]!.trim(),
          description: fields["description"]!.trim(),
          features: parseList(fields["features"]!),
          featured: fields["featured"]!.toLowerCase() === "yes",
          active: (existing as GymPlan | undefined)?.active ?? true,
        } satisfies GymPlan;
      case "offers":
        return {
          id: recordId,
          title: fields["title"]!.trim(),
          description: fields["description"]!.trim(),
          code: fields["code"]!.trim(),
          endDate: fields["endDate"]!.trim(),
          active: (existing as GymOffer | undefined)?.active ?? true,
        } satisfies GymOffer;
      case "facilities":
        return {
          id: recordId,
          name: fields["name"]!.trim(),
          description: fields["description"]!.trim(),
          image: fields["image"]!.trim(),
          alt: fields["alt"]!.trim(),
        } satisfies GymFacility;
      case "gallery":
        return {
          id: recordId,
          image: fields["image"]!.trim(),
          alt: fields["alt"]!.trim(),
          caption: fields["caption"]!.trim(),
        } satisfies GymGalleryItem;
    }
  })();
  const collection = kind === "programs" ? "programs" : kind;
  const prior = data[collection] as CatalogItem[];
  let updated = editingId
    ? prior.map((item) => (item.id === editingId ? next : item))
    : [next, ...prior];
  if (kind === "plans" && (next as GymPlan).featured) {
    updated = updated.map((item) => ({ ...item, featured: item.id === recordId }));
  }
  return { ...data, [collection]: updated } as GymDemoData;
}

export function GymCatalog({ kind }: { kind: CatalogKind }) {
  const { data, setData } = useGymDemoData();
  const config = configs[kind];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [formError, setFormError] = useState("");
  const items = useMemo(() => listItems(kind, data), [data, kind]);
  const filtered = items.filter(({ title, description }) =>
    `${title} ${description}`.toLowerCase().includes(search.toLowerCase()),
  );

  function openEditor(item?: CatalogItem) {
    setEditingId(item?.id ?? null);
    setFields(getFields(kind, item));
    setFormError("");
    setDialogOpen(true);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const missing = config.fields.find((field) => field.required && !fields[field.key]?.trim());
    if (missing) {
      setFormError(`${missing.label} is required.`);
      return;
    }
    const urlFields =
      kind === "programs" || kind === "trainers"
        ? ["image"]
        : kind === "facilities" || kind === "gallery"
          ? ["image"]
          : [];
    for (const key of urlFields) {
      const value = fields[key]?.trim();
      if (!value) continue;
      try {
        const protocol = new URL(value).protocol;
        if (protocol !== "https:" && protocol !== "http:") throw new Error("Unsupported protocol");
      } catch {
        setFormError("Image URLs must use a valid http or https address.");
        return;
      }
    }
    setFormError("");
    setData((current) => saveItem(kind, fields, editingId, current));
    setDialogOpen(false);
    setNotice(
      `${config.singular[0]!.toUpperCase()}${config.singular.slice(1)} ${editingId ? "updated" : "created"} in the demo website.`,
    );
  }

  function removeItem(item: CatalogItem) {
    if (
      !window.confirm(
        `Delete this ${config.singular}? This will also remove it from the public demo site.`,
      )
    )
      return;
    const collection = kind === "programs" ? "programs" : kind;
    setData(
      (current) =>
        ({
          ...current,
          [collection]: (current[collection] as CatalogItem[]).filter(
            (entry) => entry.id !== item.id,
          ),
        }) as GymDemoData,
    );
    setNotice(`${config.singular[0]!.toUpperCase()}${config.singular.slice(1)} deleted.`);
  }

  function toggleActive(item: CatalogItem) {
    if (kind !== "plans" && kind !== "offers") return;
    const collection = kind;
    setData((current) => ({
      ...current,
      [collection]: current[collection].map((entry) =>
        entry.id === item.id ? { ...entry, active: !entry.active } : entry,
      ),
    }));
  }

  return (
    <section>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="section-kicker !text-ink/45">Shared demo catalog</p>
          <h2 className="mt-1 font-display text-3xl font-bold tracking-[-0.06em]">
            {config.label}
          </h2>
          <p className="mt-1 text-sm text-ink/55">
            Changes appear immediately on the public demo website.
          </p>
        </div>
        <Button
          onClick={() => openEditor()}
          className="rounded-none bg-primary text-ink hover:bg-primary/85"
        >
          <Plus /> Add {config.singular}
        </Button>
      </div>
      {notice ? (
        <p
          role="status"
          className="mb-4 border border-emerald-300 bg-emerald-50 px-4 py-3 text-xs text-emerald-900"
        >
          {notice}
        </p>
      ) : null}
      <label className="relative mb-4 block max-w-sm">
        <Search
          size={16}
          aria-hidden
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"
        />
        <Input
          aria-label={`Search ${config.label}`}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={`Search ${config.label.toLowerCase()}`}
          className="rounded-none pl-9"
        />
      </label>
      {filtered.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map(({ item, title, description, image, active }) => (
            <Card
              key={item.id}
              className="overflow-hidden rounded-none border-ink/10 bg-white shadow-none"
            >
              {image ? (
                <ImageWithFallback
                  src={image}
                  alt={kind === "gallery" ? (item as GymGalleryItem).alt : ""}
                  loading="lazy"
                  className="h-48 w-full object-cover"
                />
              ) : null}
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="font-display text-xl">{title}</CardTitle>
                  {active !== undefined ? (
                    <Badge variant={active ? "default" : "secondary"}>
                      {active ? "Active" : "Hidden"}
                    </Badge>
                  ) : null}
                </div>
              </CardHeader>
              <CardContent>
                <p className="min-h-10 text-sm text-muted-foreground">{description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditor(item)}>
                    <Pencil /> Edit
                  </Button>
                  {kind === "plans" || kind === "offers" ? (
                    <Button variant="outline" size="sm" onClick={() => toggleActive(item)}>
                      {active ? "Hide" : "Publish"}
                    </Button>
                  ) : null}
                  <Button variant="destructive" size="sm" onClick={() => removeItem(item)}>
                    <Trash2 /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="rounded-none border-dashed border-ink/20 bg-white shadow-none">
          <CardContent className="py-12 text-center">
            <p className="font-display text-xl font-bold">
              {items.length ? "No matching items" : `No ${config.label.toLowerCase()} yet`}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {items.length
                ? "Try a different search."
                : "Create a demo entry to populate this section on the public site."}
            </p>
          </CardContent>
        </Card>
      )}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-none">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit" : "Add"} {config.singular}
            </DialogTitle>
            <DialogDescription>
              Demo content is saved in this browser and reflected on the public website.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            {formError ? (
              <p role="alert" className="text-sm text-destructive">
                {formError}
              </p>
            ) : null}
            {config.fields.map((field) => (
              <label key={field.key} className="block text-sm font-medium">
                {field.label}
                {field.key === "featured" ? (
                  <Select
                    value={fields[field.key] ?? ""}
                    onValueChange={(value) =>
                      setFields((current) => ({ ...current, [field.key]: value }))
                    }
                  >
                    <SelectTrigger
                      aria-label={field.label}
                      aria-required={field.required}
                      className="mt-1 rounded-none"
                    >
                      <SelectValue placeholder="Choose yes or no" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type={field.type ?? "text"}
                    required={field.required}
                    value={fields[field.key] ?? ""}
                    onChange={(event) =>
                      setFields((current) => ({ ...current, [field.key]: event.target.value }))
                    }
                    className="mt-1 rounded-none"
                  />
                )}
              </label>
            ))}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-ink hover:bg-primary/85">
                {editingId ? "Save changes" : `Create ${config.singular}`}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
