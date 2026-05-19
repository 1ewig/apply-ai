import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { JobApplication } from "./types";

export function useApplications() {
  const jobsRaw = useQuery(api.applications.list) || [];
  const jobs = jobsRaw.map((j) => ({ ...j, id: j._id })) as JobApplication[];

  const convexAddJob = useMutation(api.applications.add);
  const convexUpdateJob = useMutation(api.applications.update);
  const convexDeleteJob = useMutation(api.applications.remove);

  const addJob = (job: Omit<JobApplication, 'id' | 'dateApplied'>) => {
    return convexAddJob({ ...job });
  };

  const updateJob = (id: string, updates: Partial<JobApplication>) => {
    return convexUpdateJob({ id, ...updates });
  };

  const deleteJob = (id: string) => {
    return convexDeleteJob({ id });
  };

  return { jobs, addJob, updateJob, deleteJob };
}
