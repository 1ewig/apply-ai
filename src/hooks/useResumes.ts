import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Resume } from "@/types";
import {
  listResumesAction,
  addResumeAction,
  updateResumeAction,
  deleteResumeAction,
} from "@/app/actions/resumes";

export function useResumes() {
  const queryClient = useQueryClient();

  const { data: resumesRaw, isLoading } = useQuery({
    queryKey: ["resumes"],
    queryFn: async () => await listResumesAction(),
  });

  const resumes = (resumesRaw || []).map((r) => ({ ...r, id: r._id })) as Resume[];

  const addResumeMutation = useMutation({
    mutationFn: async (resume: Omit<Resume, 'id' | 'updatedAt'>) => {
      return await addResumeAction(resume);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });

  const updateResumeMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: any; updates: Partial<Resume> }) => {
      return await updateResumeAction({ id, ...updates });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });

  const deleteResumeMutation = useMutation({
    mutationFn: async (id: any) => {
      return await deleteResumeAction(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });

  const addResume = async (resume: Omit<Resume, 'id' | 'updatedAt'>) => {
    return await addResumeMutation.mutateAsync(resume);
  };

  const updateResume = async (id: any, updates: Partial<Resume>) => {
    return await updateResumeMutation.mutateAsync({ id, updates });
  };

  const deleteResume = async (id: any) => {
    return await deleteResumeMutation.mutateAsync(id);
  };

  const setDefaultResume = async (id: any) => {
    return await updateResumeMutation.mutateAsync({ id, updates: { isDefault: true } });
  };

  return { resumes, isLoading, addResume, updateResume, deleteResume, setDefaultResume };
}
