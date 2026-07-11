import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Resume } from "@/types";

export function useResumes() {
  const resumesRaw = useQuery(api.resumes.list);
  const isLoading = resumesRaw === undefined;
  const resumes = (resumesRaw || []).map((r) => ({ ...r, id: r._id })) as Resume[];

  const convexAddResume = useMutation(api.resumes.add);
  const convexUpdateResume = useMutation(api.resumes.update);
  const convexDeleteResume = useMutation(api.resumes.remove);

  const addResume = (resume: Omit<Resume, 'id' | 'updatedAt'>) => {
    return convexAddResume({ ...resume });
  };

  const updateResume = (id: any, updates: Partial<Resume>) => {
    return convexUpdateResume({ id, ...updates });
  };

  const deleteResume = (id: any) => {
    return convexDeleteResume({ id });
  };

  const setDefaultResume = (id: any) => {
    return convexUpdateResume({ id, isDefault: true });
  };

  return { resumes, isLoading, addResume, updateResume, deleteResume, setDefaultResume };
}
