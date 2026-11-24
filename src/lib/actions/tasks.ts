"use server";

import { createClient } from "@/lib/supabase/server";
import { Task, TaskPriority, TaskStatus } from "@/types/pr-crm";
import { revalidatePath } from "next/cache";

export async function getTasks(): Promise<Task[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tasks")
      .select("*, projects(name, client_or_brand)")
      .order("created_at", { ascending: false });

    if (error || !data) {
      console.warn("Supabase tasks fetch error, fallback to mock data:", error?.message);
      return [];
    }

    return data.map((t: any) => ({
      id: t.id,
      title: t.title,
      project_id: t.project_id,
      project_name: t.projects?.name || "Geral",
      client_or_brand: t.projects?.client_or_brand,
      priority: t.priority as TaskPriority,
      due_date: t.due_date,
      due_time: t.due_time,
      status: t.status as TaskStatus,
      description: t.description,
      notes: t.notes,
      subtasks: t.subtasks || [],
      comments: t.comments || [],
    }));
  } catch (err) {
    console.warn("Failed to connect to Supabase server client:", err);
    return [];
  }
}

export async function updateTaskPriorityAction(taskId: string, priority: TaskPriority) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("tasks")
      .update({ priority, updated_at: new Date().toISOString() })
      .eq("id", taskId);

    if (error) throw error;
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function toggleTaskStatusAction(taskId: string, currentStatus: TaskStatus) {
  try {
    const nextStatus: TaskStatus = currentStatus === "completed" ? "pending" : "completed";
    const supabase = await createClient();
    const { error } = await supabase
      .from("tasks")
      .update({ status: nextStatus, updated_at: new Date().toISOString() })
      .eq("id", taskId);

    if (error) throw error;
    revalidatePath("/");
    return { success: true, status: nextStatus };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateTaskDetailAction(taskId: string, updates: Partial<Task>) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("tasks")
      .update({
        title: updates.title,
        priority: updates.priority,
        due_date: updates.due_date,
        due_time: updates.due_time,
        description: updates.description,
        notes: updates.notes,
        subtasks: updates.subtasks,
        comments: updates.comments,
        status: updates.status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId);

    if (error) throw error;
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
