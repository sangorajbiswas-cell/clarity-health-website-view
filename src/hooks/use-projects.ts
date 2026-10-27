import { useEffect, useState } from "react";
import { projects as fallbackProjects, type Project } from "@/content/legacy-gym-site";
import { listProjects } from "@/lib/projects";

export function usePublishedProjects() {
  const [projects, setProjects] = useState(fallbackProjects);

  useEffect(() => {
    let active = true;
    void listProjects({ publishedOnly: true })
      .then((results) => {
        if (active && results.length > 0) {
          setProjects(results.map(({ project }) => project));
        }
      })
      .catch((error: unknown) => {
        if (active) console.error("Unable to load published projects; using local content.", error);
      });

    return () => {
      active = false;
    };
  }, []);

  return projects;
}
