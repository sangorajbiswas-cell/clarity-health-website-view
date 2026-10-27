import { useEffect, useRef, useState, type ReactNode } from "react";
import { initialClinicDemoData } from "@/content/site";
import {
  ClinicDemoDataContext,
  clinicDemoStorageKey,
  type ClinicDemoData,
} from "@/lib/clinic-data";

function isClinicDemoData(value: unknown): value is ClinicDemoData {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  const arrays = [
    "doctors",
    "services",
    "departments",
    "facilities",
    "testimonials",
    "appointments",
  ];
  const clinic = record["clinic"];
  const home = record["home"];
  return (
    typeof clinic === "object" &&
    clinic !== null &&
    typeof home === "object" &&
    home !== null &&
    arrays.every((key) => Array.isArray(record[key]))
  );
}

export function ClinicDemoDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ClinicDemoData>(initialClinicDemoData);
  const [loaded, setLoaded] = useState(false);
  const [storageError, setStorageError] = useState("");
  const [persistRevision, setPersistRevision] = useState(0);
  const ready = useRef(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(clinicDemoStorageKey);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (!isClinicDemoData(parsed))
          throw new Error("Saved clinic demo data has an invalid shape.");
        setData(parsed);
      }
      ready.current = true;
    } catch (error) {
      console.error("Unable to load saved clinic demo data.", error);
      setStorageError("Saved demo content could not be loaded. Reset it from the admin panel.");
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded || !ready.current) return;
    try {
      window.localStorage.setItem(clinicDemoStorageKey, JSON.stringify(data));
      setStorageError("");
    } catch (error) {
      console.error("Unable to save clinic demo data.", error);
      setStorageError("Demo changes could not be saved in this browser.");
    }
  }, [data, loaded, persistRevision]);

  function resetData() {
    ready.current = true;
    setData(initialClinicDemoData);
    setPersistRevision((revision) => revision + 1);
    setStorageError("");
  }

  return (
    <ClinicDemoDataContext.Provider value={{ data, setData, loaded, storageError, resetData }}>
      {children}
    </ClinicDemoDataContext.Provider>
  );
}
