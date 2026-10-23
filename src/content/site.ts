import hero from "@/assets/hero.jpg";
import p1 from "@/assets/project-1.jpg";
import p2 from "@/assets/project-2.jpg";
import p3 from "@/assets/project-3.jpg";

/**
 * EDITABLE CONTENT — all business details below are placeholders.
 * Replace with real, verifiable information before publishing.
 * Once the database is connected this content moves to the admin panel.
 */
export const site = {
  name: "BuildTrust Constructions",
  tagline: "Residential & commercial construction, built on clear communication.",
  phone: "+910000000000", // PLACEHOLDER — replace with real number
  phoneDisplay: "+91 00000 00000",
  whatsapp: "910000000000", // PLACEHOLDER — digits only, with country code
  email: "hello@example.com", // PLACEHOLDER
  address: "Office address to be added",
  hours: "Mon–Sat, 9:00 – 18:00 (placeholder)",
  heroImage: hero,
};

/** Shown only when filled in. Leave value empty ("") to hide a stat. */
export const stats: { label: string; value: string }[] = [
  { label: "Years of experience", value: "" },
  { label: "Projects delivered", value: "" },
  { label: "Cities served", value: "" },
];

export type Service = {
  slug: string;
  title: string;
  summary: string;
  includes: string[];
  rateGuide: string;
};

export const services: Service[] = [
  {
    slug: "new-home-construction",
    title: "New Home Construction",
    summary: "Turnkey homes from foundation to finishing, with a single point of contact.",
    includes: ["Structural design coordination", "Civil & masonry works", "Electrical & plumbing", "Finishing & handover"],
    rateGuide: "From ₹1,800 – ₹2,600 per sq.ft (sample range)",
  },
  {
    slug: "commercial-construction",
    title: "Commercial Construction",
    summary: "Offices, retail and mixed-use buildings delivered to schedule.",
    includes: ["RCC frame structures", "MEP coordination", "Statutory compliance support", "Project scheduling"],
    rateGuide: "Quoted per project after drawings review",
  },
  {
    slug: "renovation",
    title: "Renovation & Remodelling",
    summary: "Kitchens, bathrooms, extensions and complete home makeovers.",
    includes: ["Kitchen & bath remodels", "Room additions", "Waterproofing", "Flooring & painting"],
    rateGuide: "From ₹900 – ₹1,600 per sq.ft (sample range)",
  },
  {
    slug: "interiors",
    title: "Interior Fit-Out",
    summary: "Practical, well-built interiors for homes and workplaces.",
    includes: ["Modular kitchens & wardrobes", "False ceilings", "Lighting", "Custom joinery"],
    rateGuide: "Quoted per room / package (sample)",
  },
];

export type Project = {
  slug: string;
  title: string;
  status: "completed" | "ongoing";
  category: "Residential" | "Commercial" | "Renovation";
  location: string;
  summary: string;
  description: string;
  cover: string;
  gallery: string[];
};

export const projects: Project[] = [
  {
    slug: "sample-family-residence",
    title: "Sample Family Residence",
    status: "completed",
    category: "Residential",
    location: "Location to be added",
    summary: "Two-storey family home — sample portfolio entry.",
    description:
      "This is a sample project entry to show how portfolio items appear. Replace it with your real project details, scope, timeline and photos.",
    cover: p1,
    gallery: [p1, hero, p3],
  },
  {
    slug: "sample-office-block",
    title: "Sample Office Block",
    status: "ongoing",
    category: "Commercial",
    location: "Location to be added",
    summary: "Multi-storey RCC frame — sample ongoing project.",
    description:
      "Sample ongoing project. Add real progress updates and site photos once available.",
    cover: p2,
    gallery: [p2, hero],
  },
  {
    slug: "sample-kitchen-renovation",
    title: "Sample Kitchen Renovation",
    status: "completed",
    category: "Renovation",
    location: "Location to be added",
    summary: "Full kitchen remodel — sample portfolio entry.",
    description: "Sample renovation project. Replace with real before/after photos and scope.",
    cover: p3,
    gallery: [p3, p1],
  },
  {
    slug: "sample-villa-build",
    title: "Sample Villa Build",
    status: "ongoing",
    category: "Residential",
    location: "Location to be added",
    summary: "Contemporary villa nearing completion — sample entry.",
    description: "Sample ongoing residential project.",
    cover: hero,
    gallery: [hero, p1],
  },
];

/** SAMPLE PLACEHOLDERS — not real reviews. Replace with genuine client feedback (with permission). */
export const testimonials = [
  { quote: "Sample testimonial placeholder. Replace with a genuine client review.", name: "Sample Client", role: "Homeowner (placeholder)" },
  { quote: "Sample testimonial placeholder. Replace with a genuine client review.", name: "Sample Client", role: "Business owner (placeholder)" },
];

export const whatsappLink = (text = "Hello BuildTrust, I'd like to discuss a construction project.") =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
