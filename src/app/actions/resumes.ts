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

export async function listResumesAction() {
  const token = await getAuthToken();
  return await fetchQuery(api.resumes.list, {}, { token });
}

export async function addResumeAction(args: {
  name: string;
  content: string;
  isDefault: boolean;
}) {
  const token = await getAuthToken();
  return await fetchMutation(api.resumes.add, args, { token });
}

export async function updateResumeAction(args: {
  id: Id<"resumes">;
  name?: string;
  content?: string;
  isDefault?: boolean;
}) {
  const token = await getAuthToken();
  return await fetchMutation(api.resumes.update, args, { token });
}

export async function deleteResumeAction(id: Id<"resumes">) {
  const token = await getAuthToken();
  return await fetchMutation(api.resumes.remove, { id }, { token });
}
