'use client';

import { useState, useEffect } from 'react';
import { Bell, Check, X, ExternalLink, Info, AlertTriangle, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Notification, getNotifications, markAsRead, markAllAsRead, createNotification } from '@/app/actions/notifications';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const load = async () => {
        const data = await getNotifications();
        setNotifications(data);
        setLoading(false);
    };

    useEffect(() => {
        load();
        const interval = setInterval(load, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleTestNotification = async () => {
        const res = await createNotification({
            type: 'info',
            title: 'Test Notification',
            message: 'This is a test notification to verify the system.',
            link: '#'
        });

        if (res.success) {
            toast.success("Test Sent", { description: "Check your inbox." });
            load();
        } else {
            toast.error("Failed", { description: "Did you run the SQL migration?" });
        }
    };



    const unreadCount = notifications.filter(n => !n.is_read).length;

    const handleMarkRead = async (id: string, link?: string) => {
        await markAsRead(id);
        const newNotifs = notifications.map(n => n.id === id ? { ...n, is_read: true } : n);
        setNotifications(newNotifs);

        if (link) {
            router.push(link);
            setIsOpen(false);
        }
    };

    const handleMarkAllRead = async () => {
        await markAllAsRead();
        setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    };

    return (
        <div className="relative">
            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) load(); // Refresh on open
                }}
                className="relative p-2 text-zinc-500 hover:text-white transition-colors rounded-full hover:bg-white/10 group"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-black" />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40 bg-transparent"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-zinc-950/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[80vh]"
                        >
                            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                                <h3 className="text-sm font-bold text-white">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllRead}
                                        className="text-[10px] uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
                                    >
                                        Mark all read
                                    </button>
                                )}
                            </div>

                            <div className="overflow-y-auto custom-scrollbar flex-1">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-zinc-600 text-sm">
                                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                        No new notifications
                                    </div>
                                ) : (
                                    <div className="divide-y divide-white/5">
                                        {notifications.map((n) => (
                                            <div
                                                key={n.id}
                                                className={cn(
                                                    "p-4 hover:bg-white/5 transition-colors relative group",
                                                    !n.is_read && "bg-white/[0.02]"
                                                )}
                                            >
                                                <div className="flex gap-3">
                                                    <div className={cn(
                                                        "mt-1 w-2 h-2 rounded-full flex-shrink-0",
                                                        n.type === 'success' ? "bg-white" :
                                                            n.type === 'warning' ? "bg-zinc-500" :
                                                                n.type === 'error' ? "bg-red-500" : "bg-blue-500"
                                                    )} />

                                                    <div className="flex-1 space-y-1">
                                                        <div className="flex justify-between items-start">
                                                            <h4 className={cn("text-sm font-bold", n.is_read ? "text-zinc-500" : "text-white")}>{n.title}</h4>
                                                            <span className="text-[10px] text-zinc-600 whitespace-nowrap ml-2">
                                                                {new Date(n.created_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-zinc-400 leading-relaxed">{n.message}</p>

                                                        <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => handleMarkRead(n.id, n.link)}
                                                                className="text-[10px] font-bold uppercase tracking-wider text-white hover:underline flex items-center gap-1"
                                                            >
                                                                {n.link ? <>View <ExternalLink className="w-3 h-3" /></> : "Dismiss"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
