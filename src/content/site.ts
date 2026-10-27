import type { ClinicDemoData } from "@/lib/clinic-data";

export const clinicImages = {
  hero: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=2000&q=85",
  consultation:
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=85",
  clinic:
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1400&q=85",
  doctorOne:
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=85",
  doctorTwo:
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=85",
  doctorThree:
    "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=900&q=85",
  care: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=85",
  wellness:
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=85",
  family:
    "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1200&q=85",
  women:
    "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1200&q=85",
  heart:
    "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=1200&q=85",
  lab: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=85",
};

export const clinicSiteDefaults = {
  name: "CLARITY HEALTH",
  tagline: "Thoughtful care, made easier to navigate.",
  phone: "+1 202-555-0124",
  email: "hello@clarityhealth.example",
  address: "100 Example Lane, Sample City",
  hours: "Monday–Friday, 8:00 AM–6:00 PM · Saturday by request",
  directionsUrl: "https://maps.google.com/?q=100+Example+Lane+Sample+City",
};

export const clinicHomeDefaults = {
  heroEyebrow: "A neighborhood clinic demo",
  heroTitle: "Care that starts with listening.",
  heroDescription:
    "An illustrative clinic experience designed around clear conversations, considerate care, and a more welcoming first step.",
  aboutTitle: "A little more clarity, at every step.",
  aboutDescription:
    "We believe healthcare can feel more human when people have time to ask questions and understand their options. This fictional clinic demonstrates one approachable way to present care online.",
  appointmentCta: "Request an appointment",
  testimonialsNote:
    "Illustrative sample quotes for layout only. These are not patient reviews or endorsements.",
};

export const initialClinicDemoData = {
  clinic: { ...clinicSiteDefaults },
  home: { ...clinicHomeDefaults },
  doctors: [
    {
      id: "doctor-mira-sample",
      name: "Mira Sample",
      specialty: "Primary care",
      qualifications: "Illustrative sample only — no real credentials.",
      experience: "Example profile",
      bio: "A fictional profile used to demonstrate how a clinic could introduce its care team.",
      image: clinicImages.doctorOne,
    },
    {
      id: "doctor-jordan-example",
      name: "Jordan Example",
      specialty: "Family health",
      qualifications: "Illustrative sample only — no real credentials.",
      experience: "Example profile",
      bio: "A fictional profile used to demonstrate clear, welcoming doctor information.",
      image: clinicImages.doctorTwo,
    },
    {
      id: "doctor-avery-demo",
      name: "Avery Demo",
      specialty: "Wellness consultations",
      qualifications: "Illustrative sample only — no real credentials.",
      experience: "Example profile",
      bio: "A fictional profile for this demo. No clinical services or medical advice are provided.",
      image: clinicImages.doctorThree,
    },
  ],
  services: [
    {
      id: "service-primary-care",
      name: "Primary care conversation",
      department: "Primary care",
      description:
        "A sample listing for a general appointment with time to discuss your questions and next steps.",
      visitLength: "Example: 30 minutes",
      image: clinicImages.care,
    },
    {
      id: "service-wellness",
      name: "Wellness visit",
      department: "Wellness",
      description:
        "An illustrative service description for a routine, person-centered wellness conversation.",
      visitLength: "Example: 30 minutes",
      image: clinicImages.wellness,
    },
    {
      id: "service-family",
      name: "Family health visit",
      department: "Family health",
      description:
        "A fictional example of a clinic visit for people looking for coordinated family care.",
      visitLength: "Example: 30 minutes",
      image: clinicImages.family,
    },
    {
      id: "service-womens-health",
      name: "Women's health consultation",
      department: "Women's health",
      description: "A sample listing showing how a clinic can describe a supportive consultation.",
      visitLength: "Example: 40 minutes",
      image: clinicImages.women,
    },
    {
      id: "service-heart-health",
      name: "Heart health discussion",
      department: "Wellness",
      description:
        "An illustrative, non-clinical service listing. It does not represent a medical claim.",
      visitLength: "Example: 30 minutes",
      image: clinicImages.heart,
    },
    {
      id: "service-care-planning",
      name: "Care planning conversation",
      department: "Primary care",
      description:
        "An example listing for discussing care preferences and possible next steps together.",
      visitLength: "Example: 30 minutes",
      image: clinicImages.consultation,
    },
  ],
  departments: [
    {
      id: "department-primary-care",
      name: "Primary care",
      description: "A welcoming starting point for general questions and conversations about care.",
      leadDoctor: "Mira Sample",
      image: clinicImages.care,
    },
    {
      id: "department-family-health",
      name: "Family health",
      description:
        "An illustrative department page for coordinated visits across different life stages.",
      leadDoctor: "Jordan Example",
      image: clinicImages.family,
    },
    {
      id: "department-wellness",
      name: "Wellness",
      description: "Sample wellness information for a calm, approachable clinic website.",
      leadDoctor: "Avery Demo",
      image: clinicImages.wellness,
    },
    {
      id: "department-womens-health",
      name: "Women's health",
      description:
        "An illustrative department introduction focused on clear, respectful conversations.",
      leadDoctor: "Mira Sample",
      image: clinicImages.women,
    },
  ],
  facilities: [
    {
      id: "facility-welcome",
      name: "A welcoming reception",
      description: "An illustrative reception area for this fictional clinic experience.",
      image: clinicImages.clinic,
      alt: "Bright, welcoming clinic interior, used as illustrative demo imagery",
    },
    {
      id: "facility-consult",
      name: "Consultation rooms",
      description: "A sample space for private conversations in the clinic demo.",
      image: clinicImages.consultation,
      alt: "Healthcare professional in a consultation room, illustrative stock photo",
    },
    {
      id: "facility-lab",
      name: "Care spaces",
      description: "Example imagery representing a considered and accessible environment.",
      image: clinicImages.lab,
      alt: "Clean clinical workspace, illustrative stock photo",
    },
  ],
  testimonials: [
    {
      id: "quote-listening",
      quote: "Good care begins when people have room to ask questions.",
      attribution: "Our care philosophy",
      context: "Illustrative sample — not a patient review",
    },
    {
      id: "quote-clarity",
      quote: "Clear information can make a first step feel a little easier.",
      attribution: "A principle we value",
      context: "Illustrative sample — not a patient review",
    },
    {
      id: "quote-together",
      quote: "Care is a conversation, with people at the center.",
      attribution: "Our approach",
      context: "Illustrative sample — not a patient review",
    },
  ],
  appointments: [
    {
      id: "appointment-demo-001",
      name: "Taylor Demo",
      email: "taylor@example.invalid",
      phone: "+1 555 010 1001",
      department: "Primary care",
      preferredDoctor: "No preference",
      preferredDate: "Flexible",
      receivedAt: "Demo sample",
      status: "New request",
    },
    {
      id: "appointment-demo-002",
      name: "Morgan Example",
      email: "morgan@example.invalid",
      phone: "+1 555 010 1002",
      department: "Wellness",
      preferredDoctor: "Avery Demo",
      preferredDate: "Flexible",
      receivedAt: "Demo sample",
      status: "Contacted",
    },
  ],
} satisfies ClinicDemoData;
