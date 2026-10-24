import type { Project } from "@/content/site";
import { getSupabaseClient } from "@/lib/supabase";

export const projectStatuses = ["completed", "ongoing"] as const;
export const projectCategories = ["Residential", "Commercial", "Renovation"] as const;
export const projectImageBucket = "project-images";
export const maxProjectImageSize = 5 * 1024 * 1024;
export const acceptedProjectImageTypes = ["image/jpeg", "image/png", "image/webp"] as const;

export type ProjectStatus = (typeof projectStatuses)[number];
export type ProjectCategory = (typeof projectCategories)[number];

export type ProjectRecord = {
  id: string;
  slug: string;
  title: string;
  status: ProjectStatus;
  category: ProjectCategory;
  location: string;
  summary: string;
  description: string;
  cover_path: string | null;
  gallery_paths: string[];
  published: boolean;
  sort_order: number;
};

export type ProjectInput = Omit<ProjectRecord, "id" | "sort_order">;

const projectColumns =
  "id,slug,title,status,category,location,summary,description,cover_path,gallery_paths,published,sort_order";

function publicImageUrl(path: string): string {
  return getSupabaseClient().storage.from(projectImageBucket).getPublicUrl(path).data.publicUrl;
}

export function projectFromRecord(record: ProjectRecord): Project {
  const imagePaths = [
    ...new Set(
      [record.cover_path, ...(record.gallery_paths ?? [])].filter((path): path is string =>
        Boolean(path),
      ),
    ),
  ];
  const gallery = imagePaths.map(publicImageUrl);
  const cover = record.cover_path ? publicImageUrl(record.cover_path) : (gallery[0] ?? "");

  return {
    slug: record.slug,
    title: record.title,
    status: record.status,
    category: record.category,
    location: record.location,
    summary: record.summary,
    description: record.description,
    cover,
    gallery: gallery.length ? gallery : cover ? [cover] : [],
  };
}

export async function listProjects(options: { publishedOnly?: boolean } = {}) {
  let query = getSupabaseClient().from("projects").select(projectColumns);
  if (options.publishedOnly) query = query.eq("published", true);
  const { data, error } = await query.order("sort_order", { ascending: true });
  if (error) throw error;
  return (data as ProjectRecord[]).map((record) => ({
    record,
    project: projectFromRecord(record),
  }));
}

export async function getPublishedProject(slug: string): Promise<Project | null> {
  const { data, error } = await getSupabaseClient()
    .from("projects")
    .select(projectColumns)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) throw error;
  return data ? projectFromRecord(data as ProjectRecord) : null;
}

export function validateProjectImage(file: File): string | null {
  if (
    !acceptedProjectImageTypes.includes(file.type as (typeof acceptedProjectImageTypes)[number])
  ) {
    return "Choose a JPEG, PNG, or WebP image.";
  }
  if (file.size > maxProjectImageSize) {
    return "Each image must be 5 MB or smaller.";
  }
  return null;
}

export async function uploadProjectImage(file: File): Promise<string> {
  const validationError = validateProjectImage(file);
  if (validationError) throw new Error(validationError);

  const extension = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
  const path = `${crypto.randomUUID()}.${extension}`;
  const { error } = await getSupabaseClient()
    .storage.from(projectImageBucket)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) throw error;
  return path;
}

export async function removeProjectImages(paths: string[]) {
  if (paths.length === 0) return;
  const uniquePaths = [...new Set(paths)];
  const { error } = await getSupabaseClient().storage.from(projectImageBucket).remove(uniquePaths);
  if (error) throw error;
}

export async function removeUnreferencedProjectImages(paths: string[]) {
  if (paths.length === 0) return;
  const projects = await listProjects();
  const referencedPaths = new Set(
    projects.flatMap(({ record }) => [record.cover_path, ...record.gallery_paths].filter(Boolean)),
  );
  await removeProjectImages(paths.filter((path) => !referencedPaths.has(path)));
}
