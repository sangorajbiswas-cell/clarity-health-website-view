import { useContext } from "react";
import { GymDemoDataContext } from "@/lib/gym-data";

export function useGymDemoData() {
  const value = useContext(GymDemoDataContext);
  if (!value) {
    throw new Error("useGymDemoData must be used within GymDemoDataProvider.");
  }
  return value;
}
