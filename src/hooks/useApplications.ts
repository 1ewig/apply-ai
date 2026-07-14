import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { JobApplication } from "@/types";
import {
  listApplicationsAction,
  addApplicationAction,
  updateApplicationAction,
  deleteApplicationAction,
} from "@/app/actions/applications";

export function useApplications() {
  const queryClient = useQueryClient();

  const { data: jobsRaw, isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: async () => await listApplicationsAction(),
  });

  const jobs = (jobsRaw || []).map((j) => ({ ...j, id: j._id })) as JobApplication[];

  const addJobMutation = useMutation({
    mutationFn: async (job: Omit<JobApplication, 'id'>) => {
      return await addApplicationAction({
        ...job,
        company: job.company || undefined,
        role: job.role || undefined,
        url: job.url || undefined,
        jobDescription: job.jobDescription || undefined,
        matchScore: job.matchScore || undefined,
        resumeUsed: job.resumeUsed || undefined,
        customResumeContent: job.customResumeContent || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });

  const updateJobMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: any; updates: Partial<JobApplication> }) => {
      return await updateApplicationAction({
        id,
        ...updates,
      });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      // Also invalidate analysis query to keep detail pages synced
      queryClient.invalidateQueries({ queryKey: ["analysis", variables.id] });
    },
  });

  const deleteJobMutation = useMutation({
    mutationFn: async (id: any) => {
      return await deleteApplicationAction(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });

  const addJob = async (job: Omit<JobApplication, 'id'>) => {
    return await addJobMutation.mutateAsync(job);
  };

  const updateJob = async (id: any, updates: Partial<JobApplication>) => {
    return await updateJobMutation.mutateAsync({ id, updates });
  };

  const deleteJob = async (id: any) => {
    return await deleteJobMutation.mutateAsync(id);
  };

  return { jobs, isLoading, addJob, updateJob, deleteJob };
}
