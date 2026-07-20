"use server";

import { fetchQuery, fetchMutation } from "convex/nextjs";
import { auth } from "@clerk/nextjs/server";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

async function getAuthToken() {
  const { getToken } = await auth();
  const token = await getToken({ template: "convex" });
  return token ?? undefined;
}

export async function listApplicationsAction() {
  try {
    const token = await getAuthToken();
    if (!token) return [];
    return await fetchQuery(api.applications.list, {}, { token });
  } catch (err) {
    console.error("Error in listApplicationsAction:", err);
    return [];
  }
}

export async function getAnalysisAction(applicationId: Id<"applications">) {
  try {
    const token = await getAuthToken();
    if (!token) return null;
    return await fetchQuery(api.applications.getAnalysis, { applicationId }, { token });
  } catch (err) {
    console.error("Error in getAnalysisAction:", err);
    return null;
  }
}

export async function addApplicationAction(args: {
  company?: string;
  role?: string;
  status: string;
  dateApplied: string;
  url?: string;
  jobDescription?: string;
  matchScore?: number;
  analysisResult?: any;
  resumeUsed?: string;
  customResumeContent?: string;
}) {
  const token = await getAuthToken();
  return await fetchMutation(api.applications.add, args, { token });
}

export async function updateApplicationAction(args: {
  id: Id<"applications">;
  company?: string;
  role?: string;
  status?: string;
  dateApplied?: string;
  url?: string;
  jobDescription?: string;
  matchScore?: number;
  analysisResult?: any;
  resumeUsed?: string;
  customResumeContent?: string;
}) {
  const token = await getAuthToken();
  return await fetchMutation(api.applications.update, args, { token });
}

export async function deleteApplicationAction(id: Id<"applications">) {
  const token = await getAuthToken();
  return await fetchMutation(api.applications.remove, { id }, { token });
}
