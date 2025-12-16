"use server";

import { revalidatePath } from "next/cache";
import { addPlant } from "@/lib/plants";

export async function addPlantAction(formData: FormData) {
  const name = formData.get("name") as string;
  const feeling = formData.get("feeling") as string;

  if (!name || !feeling) {
    return { error: "Name and feeling are required" };
  }

  try {
    await addPlant(name, feeling);
    revalidatePath("/plants");
    return { success: true };
  } catch (error) {
    console.error("Error adding plant:", error);
    return { error: "Failed to add plant" };
  }
}
