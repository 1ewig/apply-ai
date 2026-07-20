"use server";

import { fetchMutation } from "convex/nextjs";
import { auth } from "@clerk/nextjs/server";
import { api } from "convex/_generated/api";

async function getAuthToken() {
  const { getToken } = await auth();
  const token = await getToken({ template: "convex" });
  return token ?? undefined;
}

export async function storeUserAction() {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, error: "No active session token" };
    }
    await fetchMutation(api.users.storeUser, {}, { token });
    return { success: true };
  } catch (err: any) {
    console.error("Error in storeUserAction:", err);
    return { success: false, error: err.message || "Failed to sync user session" };
  }
}
