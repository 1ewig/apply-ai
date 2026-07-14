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
  const token = await getAuthToken();
  return await fetchMutation(api.users.storeUser, {}, { token });
}
