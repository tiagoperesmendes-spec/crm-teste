"use server";

import { createClient } from "@/lib/supabase/server";
import { DailyContact, ContactStatus, ContactType } from "@/types/pr-crm";
import { revalidatePath } from "next/cache";

export async function getDailyContacts(): Promise<DailyContact[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("daily_contacts")
      .select("*, journalists(name, outlet_name)")
      .order("contact_date", { ascending: false });

    if (error || !data) {
      console.warn("Supabase contacts fetch error:", error?.message);
      return [];
    }

    return data.map((c: any) => ({
      id: c.id,
      contact_name: c.journalists?.name || "Jornalista",
      outlet_name: c.journalists?.outlet_name || "Geral",
      contact_type: c.contact_type as ContactType,
      status: c.status as ContactStatus,
      subject_or_notes: c.subject_or_notes,
      contact_date: c.contact_date,
      contact_time: c.contact_time,
      project_id: c.project_id,
      journalist_id: c.journalist_id,
    }));
  } catch (err) {
    console.warn("Failed to connect to Supabase server client:", err);
    return [];
  }
}

export async function updateContactStatusAction(contactId: string, status: ContactStatus) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("daily_contacts")
      .update({ status })
      .eq("id", contactId);

    if (error) throw error;
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function createDailyContactAction(contact: Partial<DailyContact>) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("daily_contacts")
      .insert({
        journalist_id: contact.journalist_id,
        project_id: contact.project_id,
        contact_type: contact.contact_type || "email",
        status: contact.status || "enviado",
        subject_or_notes: contact.subject_or_notes,
        contact_date: contact.contact_date || new Date().toISOString().split("T")[0],
        contact_time: contact.contact_time || "10:00",
      })
      .select()
      .single();

    if (error) throw error;
    revalidatePath("/");
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
