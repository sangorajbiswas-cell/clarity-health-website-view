import { useEffect, useRef, useState, type ReactNode } from "react";
import { gymDemoStorageKey, GymDemoDataContext, type GymDemoData } from "@/lib/gym-data";
import { initialGymDemoData, weeklySchedule } from "@/content/legacy-gym-site";

function isGymDemoData(value: unknown): value is GymDemoData {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  const keys: (keyof GymDemoData)[] = [
    "members",
    "classes",
    "sessions",
    "trainers",
    "plans",
    "leads",
    "programs",
    "offers",
    "facilities",
    "gallery",
  ];
  return keys.every((key) => key in record && Array.isArray(record[key]));
}

const defaultData: GymDemoData = {
  ...initialGymDemoData,
  sessions: weeklySchedule.map((session) => ({ ...session })),
};

export function GymDemoDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<GymDemoData>(defaultData);
  const [loaded, setLoaded] = useState(false);
  const [storageError, setStorageError] = useState("");
  const loadingRef = useRef(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(gymDemoStorageKey);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (!isGymDemoData(parsed)) throw new Error("Saved demo catalog has an invalid shape.");
        setData(parsed);
      }
    } catch (error) {
      console.error("Unable to load saved demo catalog.", error);
      setStorageError("Saved demo data could not be loaded. Reset it from the admin panel.");
    } finally {
      loadingRef.current = true;
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loadingRef.current) return;
    try {
      window.localStorage.setItem(gymDemoStorageKey, JSON.stringify(data));
      setStorageError("");
    } catch (error) {
      console.error("Unable to save demo catalog.", error);
      setStorageError("Demo changes could not be saved in this browser.");
    }
  }, [data]);

  function resetData() {
    const restored = {
      ...initialGymDemoData,
      sessions: weeklySchedule.map((session) => ({ ...session })),
    } satisfies GymDemoData;
    setData(restored);
    setStorageError("");
  }

  return (
    <GymDemoDataContext.Provider value={{ data, setData, loaded, storageError, resetData }}>
      {children}
    </GymDemoDataContext.Provider>
  );
}
