"use server";

import { createClient } from "@/lib/supabase/server";
import { Project, ProjectStatus } from "@/types/pr-crm";
import { revalidatePath } from "next/cache";

export async function getProjects(): Promise<Project[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) {
      console.warn("Supabase projects fetch error:", error?.message);
      return [];
    }

    return data.map((p: any) => ({
      id: p.id,
      name: p.name,
      client_or_brand: p.client_or_brand,
      status: p.status as ProjectStatus,
      deadline: p.deadline,
      start_date: p.start_date,
      manager_id: p.manager_id,
      description: p.description,
      budget_eur: p.budget_eur,
      target_journalists: p.target_journalists || [],
    }));
  } catch (err) {
    console.warn("Failed to connect to Supabase server client:", err);
    return [];
  }
}

export async function updateProjectAction(projectId: string, updates: Partial<Project>) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("projects")
      .update({
        name: updates.name,
        client_or_brand: updates.client_or_brand,
        status: updates.status,
        deadline: updates.deadline,
        description: updates.description,
        budget_eur: updates.budget_eur,
        target_journalists: updates.target_journalists,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId);

    if (error) throw error;
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
