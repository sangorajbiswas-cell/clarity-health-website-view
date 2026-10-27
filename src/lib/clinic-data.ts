import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";

export type ClinicInformation = {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
  directionsUrl: string;
};

export type ClinicHomeContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  aboutTitle: string;
  aboutDescription: string;
  appointmentCta: string;
  testimonialsNote: string;
};

export type ClinicDoctor = {
  id: string;
  name: string;
  specialty: string;
  qualifications: string;
  experience: string;
  bio: string;
  image: string;
};

export type ClinicService = {
  id: string;
  name: string;
  department: string;
  description: string;
  visitLength: string;
  image: string;
};

export type ClinicDepartment = {
  id: string;
  name: string;
  description: string;
  leadDoctor: string;
  image: string;
};

export type ClinicFacility = {
  id: string;
  name: string;
  description: string;
  image: string;
  alt: string;
};

export type ClinicTestimonial = {
  id: string;
  quote: string;
  attribution: string;
  context: string;
};

export type AppointmentStatus = "New request" | "Contacted" | "Closed";

export type ClinicAppointmentRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  preferredDoctor: string;
  preferredDate: string;
  receivedAt: string;
  status: AppointmentStatus;
};

export type ClinicDemoData = {
  clinic: ClinicInformation;
  home: ClinicHomeContent;
  doctors: ClinicDoctor[];
  services: ClinicService[];
  departments: ClinicDepartment[];
  facilities: ClinicFacility[];
  testimonials: ClinicTestimonial[];
  appointments: ClinicAppointmentRequest[];
};

export type ClinicDemoDataContextValue = {
  data: ClinicDemoData;
  setData: Dispatch<SetStateAction<ClinicDemoData>>;
  loaded: boolean;
  storageError: string;
  resetData: () => void;
};

export const clinicDemoStorageKey = "clarity-health-demo-data-v1";

export const ClinicDemoDataContext = createContext<ClinicDemoDataContextValue | null>(null);
