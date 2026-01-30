'use server';

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function terminateLead(leadId: string) {
    try {
        const { error } = await supabase
            .from('leads')
            .delete()
            .eq('id', leadId);

        if (error) throw error;

        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error terminating lead:', error);
        return { success: false, error: 'Failed to terminate lead' };
    }
}
