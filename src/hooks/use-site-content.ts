import { useContext } from "react";
import { SiteContentContext } from "@/lib/site-content";

export function useSiteContent() {
  const value = useContext(SiteContentContext);
  if (!value) {
    throw new Error("useSiteContent must be used within SiteContentProvider.");
  }
  return value;
}
