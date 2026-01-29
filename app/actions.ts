"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function logActivity(leadId: string, actionType: string, metadata: any = {}) {
    try {
        const { error } = await supabase
            .from('status_history')
            .insert({
                lead_id: leadId,
                action_type: actionType,
                metadata: metadata,
                created_at: new Date().toISOString() // Explicit timestamp
            });

        if (error) throw error;

        // If it's a "Call" or "Email", we might want to update the lead's Last Active timestamp or Stage
        if (['call', 'email'].includes(actionType.toLowerCase())) {
            await supabase
                .from('leads')
                .update({
                    last_action_at: new Date().toISOString(),
                    status: 'Contacted'
                })
                .eq('id', leadId);
        }

        revalidatePath(`/leads/${leadId}`);
        revalidatePath('/leads');
        revalidatePath('/'); // Refresh dashboard recent activity potentially

        return { success: true };
    } catch (error) {
        console.error("Failed to log activity:", error);
        return { success: false };
    }
}
