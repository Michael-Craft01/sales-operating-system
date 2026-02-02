'use client';

import { useEffect, useState } from 'react';
import { Bell, BellOff, BellRing } from 'lucide-react';

export function PushNotificationManager() {
    const [isSupported, setIsSupported] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [permission, setPermission] = useState<NotificationPermission>('default');

    useEffect(() => {
        // Check if push notifications are supported
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true);
            checkSubscription();
            setPermission(Notification.permission);
        } else {
            setIsLoading(false);
        }
    }, []);

    const checkSubscription = async () => {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            setIsSubscribed(!!subscription);
        } catch (error) {
            console.error('Error checking subscription:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const subscribe = async () => {
        setIsLoading(true);
        try {
            // Request notification permission
            const permissionResult = await Notification.requestPermission();
            setPermission(permissionResult);

            if (permissionResult !== 'granted') {
                console.log('Notification permission denied');
                setIsLoading(false);
                return;
            }

            // Register service worker if not already registered
            const registration = await navigator.serviceWorker.register('/sw.js');
            await navigator.serviceWorker.ready;

            // Subscribe to push
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(
                    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
                ),
            });

            // Save subscription to server
            const response = await fetch('/api/push/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(subscription.toJSON()),
            });

            if (response.ok) {
                setIsSubscribed(true);
            } else {
                console.error('Failed to save subscription');
            }
        } catch (error) {
            console.error('Error subscribing:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const unsubscribe = async () => {
        setIsLoading(true);
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();

            if (subscription) {
                // Unsubscribe from push
                await subscription.unsubscribe();

                // Remove from server
                await fetch('/api/push/subscribe', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ endpoint: subscription.endpoint }),
                });

                setIsSubscribed(false);
            }
        } catch (error) {
            console.error('Error unsubscribing:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Don't render anything if not supported
    if (!isSupported) {
        return null;
    }

    return (
        <button
            onClick={isSubscribed ? unsubscribe : subscribe}
            disabled={isLoading || permission === 'denied'}
            className={`
        flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
        transition-all duration-200
        ${isSubscribed
                    ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300'
                }
        ${permission === 'denied' ? 'opacity-50 cursor-not-allowed' : ''}
        disabled:opacity-50
      `}
            title={
                permission === 'denied'
                    ? 'Notifications blocked in browser settings'
                    : isSubscribed
                        ? 'Click to disable push notifications'
                        : 'Click to enable push notifications'
            }
        >
            {isLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : isSubscribed ? (
                <BellRing className="w-4 h-4" />
            ) : permission === 'denied' ? (
                <BellOff className="w-4 h-4" />
            ) : (
                <Bell className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
                {permission === 'denied'
                    ? 'Blocked'
                    : isSubscribed
                        ? 'Push On'
                        : 'Push Off'
                }
            </span>
        </button>
    );
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
