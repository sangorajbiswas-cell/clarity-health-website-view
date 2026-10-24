import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Check, ImagePlus, LoaderCircle, Pencil, Plus, Trash2, X } from "lucide-react";
import {
  listProjects,
  maxProjectImageSize,
  projectCategories,
  projectStatuses,
  projectImageBucket,
  removeProjectImages,
  removeUnreferencedProjectImages,
  uploadProjectImage,
  validateProjectImage,
  type ProjectCategory,
  type ProjectInput,
  type ProjectRecord,
  type ProjectStatus,
} from "@/lib/projects";
import { getSupabaseClient } from "@/lib/supabase";

type EditorValues = {
  slug: string;
  title: string;
  status: ProjectStatus;
  category: ProjectCategory;
  location: string;
  summary: string;
  description: string;
  published: boolean;
  coverPath: string | null;
  galleryPaths: string[];
};

const emptyValues: EditorValues = {
  slug: "",
  title: "",
  status: "ongoing",
  category: "Residential",
  location: "",
  summary: "",
  description: "",
  published: false,
  coverPath: null,
  galleryPaths: [],
};

function recordValues(record: ProjectRecord): EditorValues {
  return {
    slug: record.slug,
    title: record.title,
    status: record.status,
    category: record.category,
    location: record.location,
    summary: record.summary,
    description: record.description,
    published: record.published,
    coverPath: record.cover_path,
    galleryPaths: record.gallery_paths ?? [],
  };
}

function imageUrl(path: string) {
  return getSupabaseClient().storage.from(projectImageBucket).getPublicUrl(path).data.publicUrl;
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function validateValues(values: EditorValues, coverFile: File | null) {
  const errors: string[] = [];
  if (!values.title.trim()) errors.push("Enter a project title.");
  if (!values.slug.trim() || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values.slug)) {
    errors.push("Enter a valid URL slug using lowercase letters, numbers, and hyphens.");
  }
  if (!values.location.trim()) errors.push("Enter the project location.");
  if (!values.summary.trim()) errors.push("Enter a short project summary.");
  if (!values.description.trim()) errors.push("Enter a project description.");
  if (!values.coverPath && !coverFile) errors.push("Choose a cover image.");
  return errors;
}

export function ProjectManager() {
  const [records, setRecords] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [busyProjectId, setBusyProjectId] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [values, setValues] = useState<EditorValues>(emptyValues);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [formVersion, setFormVersion] = useState(0);

  const refresh = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const result = await listProjects();
      setRecords(result.map(({ record }) => record));
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Unable to load projects.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  function startCreate() {
    setEditingId(null);
    setValues(emptyValues);
    setCoverFile(null);
    setGalleryFiles([]);
    setFormError("");
    setNotice("");
    setEditorOpen(true);
    setFormVersion((version) => version + 1);
  }

  function startEdit(record: ProjectRecord) {
    setEditingId(record.id);
    setValues(recordValues(record));
    setCoverFile(null);
    setGalleryFiles([]);
    setFormError("");
    setNotice("");
    setEditorOpen(true);
    setFormVersion((version) => version + 1);
  }

  function closeEditor() {
    setEditorOpen(false);
    setFormError("");
    setCoverFile(null);
    setGalleryFiles([]);
  }

  function chooseCover(file: File | undefined) {
    setFormError("");
    if (!file) {
      setCoverFile(null);
      return;
    }
    const validationError = validateProjectImage(file);
    if (validationError) {
      setCoverFile(null);
      setFormError(validationError);
      return;
    }
    setCoverFile(file);
  }

  function chooseGallery(files: FileList | null) {
    setFormError("");
    const selected = Array.from(files ?? []);
    const invalid = selected.map(validateProjectImage).find(Boolean);
    if (invalid) {
      setGalleryFiles([]);
      setFormError(invalid);
      return;
    }
    setGalleryFiles(selected);
  }

  function removeGalleryPath(path: string) {
    setValues((current) => ({
      ...current,
      galleryPaths: current.galleryPaths.filter((item) => item !== path),
    }));
  }

  async function saveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setNotice("");

    const validationErrors = validateValues(values, coverFile);
    if (validationErrors.length) {
      setFormError(validationErrors.join(" "));
      return;
    }

    setSaving(true);
    const uploadedPaths: string[] = [];
    const previousRecord = records.find((record) => record.id === editingId);
    try {
      const client = getSupabaseClient();
      let coverPath = values.coverPath;
      if (coverFile) {
        coverPath = await uploadProjectImage(coverFile);
        uploadedPaths.push(coverPath);
      }

      const addedGalleryPaths: string[] = [];
      for (const file of galleryFiles) {
        const path = await uploadProjectImage(file);
        uploadedPaths.push(path);
        addedGalleryPaths.push(path);
      }

      const projectInput: ProjectInput = {
        slug: values.slug.trim(),
        title: values.title.trim(),
        status: values.status,
        category: values.category,
        location: values.location.trim(),
        summary: values.summary.trim(),
        description: values.description.trim(),
        cover_path: coverPath,
        gallery_paths: [...values.galleryPaths, ...addedGalleryPaths],
        published: values.published,
      };

      const result = editingId
        ? await client.from("projects").update(projectInput).eq("id", editingId)
        : await client.from("projects").insert({
            ...projectInput,
            sort_order:
              records.reduce((highest, record) => Math.max(highest, record.sort_order), -1) + 1,
          });

      if (result.error) throw result.error;

      const nextPaths = new Set([projectInput.cover_path, ...projectInput.gallery_paths]);
      const pathsToRemove = previousRecord
        ? [previousRecord.cover_path, ...previousRecord.gallery_paths].filter(
            (path): path is string => Boolean(path) && !nextPaths.has(path),
          )
        : [];
      let cleanupWarning = "";
      if (pathsToRemove.length) {
        try {
          await removeUnreferencedProjectImages(pathsToRemove);
        } catch {
          cleanupWarning =
            " The project saved, but replaced image files could not be removed from Storage.";
        }
      }

      await refresh();
      closeEditor();
      setNotice(`Project ${editingId ? "updated" : "created"} successfully.${cleanupWarning}`);
    } catch (error) {
      let message = error instanceof Error ? error.message : "Unable to save project.";
      if (uploadedPaths.length) {
        try {
          await removeProjectImages(uploadedPaths);
        } catch {
          message += " Some newly uploaded files could not be cleaned up.";
        }
      }
      setFormError(message);
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(record: ProjectRecord) {
    setBusyProjectId(record.id);
    setNotice("");
    setLoadError("");
    try {
      const { error } = await getSupabaseClient()
        .from("projects")
        .update({ published: !record.published })
        .eq("id", record.id);
      if (error) throw error;
      setNotice(`Project ${record.published ? "unpublished" : "published"} successfully.`);
      await refresh();
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Unable to update project visibility.");
    } finally {
      setBusyProjectId(null);
    }
  }

  async function deleteProject(record: ProjectRecord) {
    if (!window.confirm(`Delete "${record.title}"? This cannot be undone.`)) return;
    setBusyProjectId(record.id);
    setNotice("");
    setLoadError("");
    try {
      const { error } = await getSupabaseClient().from("projects").delete().eq("id", record.id);
      if (error) throw error;

      let cleanupWarning = "";
      const paths = [record.cover_path, ...(record.gallery_paths ?? [])].filter(
        (path): path is string => Boolean(path),
      );
      try {
        await removeUnreferencedProjectImages(paths);
      } catch {
        cleanupWarning = " The project was deleted, but its Storage images could not be removed.";
      }

      setNotice(`Project deleted successfully.${cleanupWarning}`);
      await refresh();
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Unable to delete project.");
    } finally {
      setBusyProjectId(null);
    }
  }

  return (
    <div className="mt-8 space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <p className="text-sm text-muted-foreground">
          Create and maintain the projects shown in your public portfolio.
        </p>
        <button type="button" className="btn btn-primary w-fit" onClick={startCreate}>
          <Plus size={18} aria-hidden /> Add project
        </button>
      </div>

      {notice ? (
        <p className="rounded-md border border-primary/30 bg-accent p-3 text-sm" role="status">
          {notice}
        </p>
      ) : null}
      {loadError ? (
        <p
          className="rounded-md border border-destructive/40 p-3 text-sm text-destructive"
          role="alert"
        >
          {loadError}
        </p>
      ) : null}

      {editorOpen ? (
        <form
          key={formVersion}
          onSubmit={saveProject}
          className="rounded-lg border bg-card p-4 sm:p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">{editingId ? "Edit project" : "New project"}</p>
              <h3 className="mt-1 text-2xl font-bold">
                {editingId ? "Update project details" : "Add a project"}
              </h3>
            </div>
            <button
              type="button"
              className="rounded-md p-2 hover:bg-secondary"
              aria-label="Close project editor"
              onClick={closeEditor}
            >
              <X size={20} aria-hidden />
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1 text-sm font-semibold">
              Project title *
              <input
                className="field"
                required
                maxLength={160}
                value={values.title}
                onChange={(event) => {
                  const title = event.target.value;
                  setValues((current) => ({
                    ...current,
                    title,
                    slug: editingId ? current.slug : slugify(title),
                  }));
                }}
              />
            </label>
            <label className="grid gap-1 text-sm font-semibold">
              URL slug *
              <input
                className="field"
                required
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                maxLength={180}
                value={values.slug}
                onChange={(event) =>
                  setValues((current) => ({ ...current, slug: event.target.value }))
                }
              />
            </label>
            <label className="grid gap-1 text-sm font-semibold">
              Status *
              <select
                className="field"
                value={values.status}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    status: event.target.value as ProjectStatus,
                  }))
                }
              >
                {projectStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm font-semibold">
              Category *
              <select
                className="field"
                value={values.category}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    category: event.target.value as ProjectCategory,
                  }))
                }
              >
                {projectCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm font-semibold sm:col-span-2">
              Location *
              <input
                className="field"
                required
                maxLength={180}
                value={values.location}
                onChange={(event) =>
                  setValues((current) => ({ ...current, location: event.target.value }))
                }
              />
            </label>
            <label className="grid gap-1 text-sm font-semibold sm:col-span-2">
              Summary *
              <textarea
                className="field"
                required
                maxLength={300}
                rows={2}
                value={values.summary}
                onChange={(event) =>
                  setValues((current) => ({ ...current, summary: event.target.value }))
                }
              />
            </label>
            <label className="grid gap-1 text-sm font-semibold sm:col-span-2">
              Description *
              <textarea
                className="field"
                required
                maxLength={10000}
                rows={5}
                value={values.description}
                onChange={(event) =>
                  setValues((current) => ({ ...current, description: event.target.value }))
                }
              />
            </label>
            <label className="grid gap-1 text-sm font-semibold sm:col-span-2">
              Cover image {values.coverPath ? "(current cover set)" : "*"}
              <span className="text-xs font-normal text-muted-foreground">
                JPEG, PNG, or WebP. Maximum 5 MB per file.
              </span>
              <input
                key={`cover-${formVersion}`}
                className="field"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                required={!values.coverPath && !coverFile}
                onChange={(event) => chooseCover(event.target.files?.[0])}
              />
            </label>
            {values.coverPath ? (
              <div className="sm:col-span-2">
                <img
                  src={imageUrl(values.coverPath)}
                  alt="Current project cover"
                  className="h-36 w-56 rounded-md border object-cover"
                />
              </div>
            ) : null}
            <label className="grid gap-1 text-sm font-semibold sm:col-span-2">
              Gallery images
              <span className="text-xs font-normal text-muted-foreground">
                Select one or more JPEG, PNG, or WebP files. Maximum 5 MB each.
              </span>
              <input
                key={`gallery-${formVersion}`}
                className="field"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={(event) => chooseGallery(event.target.files)}
              />
            </label>
            {values.galleryPaths.length ? (
              <div className="flex flex-wrap gap-3 sm:col-span-2">
                {values.galleryPaths.map((path) => (
                  <div key={path} className="relative">
                    <img
                      src={imageUrl(path)}
                      alt="Project gallery"
                      className="h-24 w-32 rounded-md border object-cover"
                    />
                    <button
                      type="button"
                      className="absolute -right-2 -top-2 rounded-full border bg-card p-1"
                      aria-label="Remove gallery image"
                      onClick={() => removeGalleryPath(path)}
                    >
                      <X size={14} aria-hidden />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
            {galleryFiles.length ? (
              <p className="text-sm text-muted-foreground sm:col-span-2">
                {galleryFiles.length} new gallery image(s) selected.
              </p>
            ) : null}
            <label className="flex items-center gap-3 sm:col-span-2">
              <input
                type="checkbox"
                checked={values.published}
                onChange={(event) =>
                  setValues((current) => ({ ...current, published: event.target.checked }))
                }
                className="size-4 accent-primary"
              />
              <span className="text-sm font-semibold">Published on the public website</span>
            </label>
          </div>

          {formError ? (
            <p className="mt-4 text-sm text-destructive" role="alert">
              {formError}
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-2">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" aria-hidden /> Saving…
                </>
              ) : (
                <>
                  <Check size={18} aria-hidden /> Save project
                </>
              )}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={closeEditor}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <section className="overflow-hidden rounded-lg border bg-card" aria-label="Project records">
        {loading ? (
          <p className="flex items-center gap-2 p-6 text-muted-foreground" role="status">
            <LoaderCircle size={18} className="animate-spin" aria-hidden /> Loading projects…
          </p>
        ) : loadError && records.length === 0 ? (
          <div className="p-6">
            <p className="text-muted-foreground">
              Unable to load projects. Check your administrator permissions and database connection.
            </p>
            <button type="button" className="btn btn-outline mt-4" onClick={() => void refresh()}>
              Try again
            </button>
          </div>
        ) : records.length === 0 ? (
          <div className="p-8 text-center">
            <ImagePlus size={28} className="mx-auto text-primary" aria-hidden />
            <h3 className="mt-3 text-lg font-bold">No database projects yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Your existing sample portfolio remains unchanged on the public website until database
              projects are available.
            </p>
            <button type="button" className="btn btn-primary mt-4" onClick={startCreate}>
              <Plus size={18} aria-hidden /> Add your first project
            </button>
          </div>
        ) : (
          <div className="divide-y">
            {records.map((record) => (
              <article
                key={record.id}
                className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
              >
                <div className="flex min-w-0 items-center gap-4">
                  {record.cover_path ? (
                    <img
                      src={imageUrl(record.cover_path)}
                      alt=""
                      className="size-16 shrink-0 rounded-md border object-cover"
                    />
                  ) : (
                    <span className="flex size-16 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                      <ImagePlus aria-hidden />
                    </span>
                  )}
                  <div className="min-w-0">
                    <h3 className="truncate font-display font-bold">{record.title}</h3>
                    <p className="mt-0.5 truncate text-sm text-muted-foreground">
                      {record.category} · {record.status} · {record.location}
                    </p>
                    <p className="mt-1 text-xs font-semibold">
                      {record.published ? "Published" : "Draft"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-outline !min-h-10 !px-3"
                    onClick={() => startEdit(record)}
                    disabled={busyProjectId === record.id}
                  >
                    <Pencil size={16} aria-hidden /> Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline !min-h-10 !px-3"
                    onClick={() => void togglePublished(record)}
                    disabled={busyProjectId === record.id}
                  >
                    {busyProjectId === record.id
                      ? "Saving…"
                      : record.published
                        ? "Unpublish"
                        : "Publish"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline !min-h-10 !px-3 text-destructive"
                    onClick={() => void deleteProject(record)}
                    disabled={busyProjectId === record.id}
                  >
                    <Trash2 size={16} aria-hidden /> Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <p className="text-xs text-muted-foreground">
        Images are uploaded to the configured project-images bucket; database records store object
        paths. Each image is limited to 5 MB.
      </p>
      <p className="sr-only">
        Maximum image size is {Math.floor(maxProjectImageSize / 1024 / 1024)} MB.
      </p>
    </div>
  );
}
