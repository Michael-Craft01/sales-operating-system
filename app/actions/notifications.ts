'use server';

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export type Notification = {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    link?: string;
    is_read: boolean;
    created_at: string;
};

export async function getNotifications() {
    try {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) throw error;
        return data as Notification[];
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
}

export async function createNotification(data: Omit<Notification, 'id' | 'created_at' | 'is_read'>) {
    try {
        const { error } = await supabase
            .from('notifications')
            .insert({ ...data, is_read: false });

        if (error) throw error;
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error creating notification:', error);
        return { success: false, error: 'Failed to create notification' };
    }
}

export async function markAsRead(id: string) {
    try {
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', id);

        if (error) throw error;
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error marking notification read:', error);
        return { success: false };
    }
}

export async function markAllAsRead() {
    try {
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('is_read', false); // Only update unread ones

        if (error) throw error;
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error clearing notifications:', error);
        return { success: false };
    }
}
