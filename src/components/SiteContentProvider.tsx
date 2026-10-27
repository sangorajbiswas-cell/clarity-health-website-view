import { useEffect, useRef, useState, type ReactNode } from "react";
import { site } from "@/content/site";
import {
  SiteContentContext,
  defaultSiteContent,
  type SiteContent,
  type SiteContentContextValue,
} from "@/lib/site-content";

const storageKey = "iron-district-site-content";

function isSiteContent(value: unknown): value is SiteContent {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    typeof value.name === "string" &&
    "tagline" in value &&
    typeof value.tagline === "string" &&
    "phone" in value &&
    typeof value.phone === "string" &&
    "phoneDisplay" in value &&
    typeof value.phoneDisplay === "string" &&
    "email" in value &&
    typeof value.email === "string" &&
    "address" in value &&
    typeof value.address === "string" &&
    "hours" in value &&
    typeof value.hours === "string" &&
    "heroDescription" in value &&
    typeof value.heroDescription === "string" &&
    "ctaText" in value &&
    typeof value.ctaText === "string" &&
    "instagramUrl" in value &&
    typeof value.instagramUrl === "string" &&
    "facebookUrl" in value &&
    typeof value.facebookUrl === "string"
  );
}

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(site);
  const [storageError, setStorageError] = useState("");
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (typeof parsed !== "object" || parsed === null) {
          throw new Error("Saved website content has an invalid shape.");
        }
        const upgraded = { ...defaultSiteContent, ...parsed };
        if (!isSiteContent(upgraded))
          throw new Error("Saved website content has an invalid shape.");
        setContent(upgraded);
      }
    } catch (error) {
      console.error("Unable to load saved demo website content.", error);
      setStorageError("Saved site content could not be loaded. Reset it from the admin panel.");
    } finally {
      loaded.current = true;
    }
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(content));
      setStorageError("");
    } catch (error) {
      console.error("Unable to save demo website content.", error);
      setStorageError("Website changes could not be saved in this browser.");
    }
  }, [content]);

  return (
    <SiteContentContext.Provider value={{ content, updateContent: setContent, storageError }}>
      {children}
    </SiteContentContext.Provider>
  );
}
