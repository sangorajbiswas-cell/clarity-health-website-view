import { createContext } from "react";
import type { site } from "@/content/site";

export type SiteContent = Pick<
  typeof site,
  | "name"
  | "tagline"
  | "phone"
  | "phoneDisplay"
  | "email"
  | "address"
  | "hours"
  | "heroDescription"
  | "ctaText"
  | "instagramUrl"
  | "facebookUrl"
>;

export type SiteContentContextValue = {
  content: SiteContent;
  updateContent: (content: SiteContent) => void;
  storageError: string;
};

export const defaultSiteContent: SiteContent = {
  name: "IRON DISTRICT",
  tagline: "A training ground for the work you put in.",
  phone: "+912055550140",
  phoneDisplay: "+91 20 5555 0140",
  email: "hello@irondistrict.example",
  address: "The Foundry, Koregaon Park, Pune",
  hours: "Every day · 5:30 AM – 10:00 PM",
  heroDescription:
    "Not a before and after. Just a place to show up, put the work in, and feel good about it.",
  ctaText: "Book your first visit",
  instagramUrl: "https://instagram.com/",
  facebookUrl: "https://facebook.com/",
};

export const SiteContentContext = createContext<SiteContentContextValue | null>(null);
