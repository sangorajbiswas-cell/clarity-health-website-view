import { describe, expect, it } from "vitest";
import { enquirySchema } from "@/routes/contact";

const valid = {
  name: "Asha",
  phone: "+91 98765 43210",
  email: "",
  service: "Renovation",
  location: "Pune",
  budget: "",
  timeline: "",
  message: "Two floor house extension",
  consent: true,
};

describe("quote enquiry form", () => {
  it("accepts a complete enquiry", () => expect(enquirySchema.safeParse(valid).success).toBe(true));
  it("rejects an enquiry without consent", () =>
    expect(enquirySchema.safeParse({ ...valid, consent: false }).success).toBe(false));
});
