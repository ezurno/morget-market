"use server";

import { getSession } from "@/lib/sessions/session";
import { redirect } from "next/navigation";

export const logout = async () => {
  const session = await getSession();
  session.destroy();
  redirect("/");
};

export const modification = async (_: any, formData: FormData) => {};
