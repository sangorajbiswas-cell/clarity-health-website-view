import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env["VITE_SUPABASE_URL"];
const supabaseAnonKey = import.meta.env["VITE_SUPABASE_ANON_KEY"];

export type Database = {
  public: {
    Tables: {
      admins: {
        Row: { user_id: string };
        Insert: { user_id: string };
        Update: { user_id?: string };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          slug: string;
          title: string;
          status: "completed" | "ongoing";
          category: "Residential" | "Commercial" | "Renovation";
          location: string;
          summary: string;
          description: string;
          cover_path: string | null;
          gallery_paths: string[];
          published: boolean;
          sort_order: number;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          status: "completed" | "ongoing";
          category: "Residential" | "Commercial" | "Renovation";
          location: string;
          summary: string;
          description: string;
          cover_path: string | null;
          gallery_paths: string[];
          published: boolean;
          sort_order?: number;
        };
        Update: {
          slug?: string;
          title?: string;
          status?: "completed" | "ongoing";
          category?: "Residential" | "Commercial" | "Renovation";
          location?: string;
          summary?: string;
          description?: string;
          cover_path?: string | null;
          gallery_paths?: string[];
          published?: boolean;
          sort_order?: number;
        };
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};

export class SupabaseConfigurationError extends Error {
  constructor() {
    super("Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
    this.name = "SupabaseConfigurationError";
  }
}

let supabaseClient: ReturnType<typeof createClient<Database>> | undefined;

export function getSupabaseClient(): ReturnType<typeof createClient<Database>> {
  if (typeof window === "undefined") {
    throw new Error("The Supabase browser client is unavailable during server rendering.");
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new SupabaseConfigurationError();
  }

  supabaseClient ??= createClient<Database>(supabaseUrl, supabaseAnonKey);
  return supabaseClient;
}
