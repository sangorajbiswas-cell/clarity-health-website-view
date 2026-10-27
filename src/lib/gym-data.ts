import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Service, Trainer } from "@/content/legacy-gym-site";

export type GymMember = {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: "Active" | "Paused";
  lastVisit: string;
};

export type GymClass = {
  id: string;
  name: string;
  category: string;
  coach: string;
  duration: string;
  active: boolean;
};

export type GymSession = {
  id: string;
  day: string;
  time: string;
  className: string;
  coach: string;
  category: string;
  spots: number;
};

export type GymLead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  received: string;
  status: "New" | "Contacted" | "Visit booked";
};

export type GymPlan = {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  featured: boolean;
  active: boolean;
};

export type GymTrainer = Trainer;
export type GymProgram = Service & { id: string };
export type GymOffer = {
  id: string;
  title: string;
  description: string;
  code: string;
  endDate: string;
  active: boolean;
};
export type GymFacility = {
  id: string;
  name: string;
  description: string;
  image: string;
  alt: string;
};
export type GymGalleryItem = {
  id: string;
  image: string;
  alt: string;
  caption: string;
};

export type GymDemoData = {
  members: GymMember[];
  classes: GymClass[];
  sessions: GymSession[];
  trainers: GymTrainer[];
  plans: GymPlan[];
  leads: GymLead[];
  programs: GymProgram[];
  offers: GymOffer[];
  facilities: GymFacility[];
  gallery: GymGalleryItem[];
};

export type GymDemoDataContextValue = {
  data: GymDemoData;
  setData: Dispatch<SetStateAction<GymDemoData>>;
  loaded: boolean;
  storageError: string;
  resetData: () => void;
};

export const gymDemoStorageKey = "iron-district-demo-data-v2";

export const GymDemoDataContext = createContext<GymDemoDataContextValue | null>(null);
