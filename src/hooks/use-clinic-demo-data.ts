import { useContext } from "react";
import { ClinicDemoDataContext } from "@/lib/clinic-data";

export function useClinicDemoData() {
  const value = useContext(ClinicDemoDataContext);
  if (!value) {
    throw new Error("useClinicDemoData must be used within a ClinicDemoDataProvider.");
  }
  return value;
}
