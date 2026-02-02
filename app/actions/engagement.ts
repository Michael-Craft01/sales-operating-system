'use server';

import { supabase } from "@/lib/supabase";

export async function checkStaleLeads() {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { data: leads, error } = await supabase
            .from('leads')
            .select('id, business_name, last_action_at')
            .eq('status', 'Active')
            .lt('last_action_at', sevenDaysAgo.toISOString())
            .limit(3); // Just grab a few to notify about

        if (error) throw error;
        return leads || [];
    } catch (error) {
        console.error('Error checking stale leads:', error);
        return [];
    }
}

export async function checkGoalProgress() {
    try {
        // Get Goals
        const { data: goals } = await supabase.from('goals').select('*').single();
        if (!goals) return null;

        // Get Current Month Revenue
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { data: wins } = await supabase
            .from('leads')
            .select('value') // Assuming 'value' column exists from previous task
            .eq('stage', 'ClosedWon')
            .gte('created_at', startOfMonth.toISOString());

        const currentAmount = wins?.reduce((sum, win) => sum + (win.value || 0), 0) || 0;

        const progress = currentAmount / (goals.amount || 1);

        return {
            currentAmount,
            targetAmount: goals.amount,
            progress,
            isClose: progress >= 0.8 && progress < 1.0
        };
    } catch (error) {
        console.error('Error checking goal progress:', error);
        return null;
    }
}
