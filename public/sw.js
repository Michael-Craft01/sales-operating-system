// Service Worker for Push Notifications
// Handles push events and notification clicks with deep-linking

self.addEventListener('push', function (event) {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: data.icon || '/favicon.png',
            badge: '/favicon.png',
            vibrate: [100, 50, 100],
            tag: data.tag || 'default',
            renotify: true,
            requireInteraction: true,
            data: {
                url: data.url || '/',
                dateOfArrival: Date.now(),
            },
            actions: [
                { action: 'open', title: 'View' },
                { action: 'dismiss', title: 'Dismiss' }
            ]
        };
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    if (event.action === 'dismiss') {
        return;
    }

    // Get the URL from notification data
    const urlToOpen = event.notification.data?.url || '/';

    // Determine base URL dynamically
    const baseUrl = self.location.origin;
    const fullUrl = new URL(urlToOpen, baseUrl).href;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(function (clientList) {
                // Check if app is already open
                for (const client of clientList) {
                    if (client.url.startsWith(baseUrl) && 'focus' in client) {
                        client.navigate(fullUrl);
                        return client.focus();
                    }
                }
                // Open new window if not
                if (clients.openWindow) {
                    return clients.openWindow(fullUrl);
                }
            })
    );
});

// Install event - cache essential assets
self.addEventListener('install', function (event) {
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', function (event) {
    event.waitUntil(clients.claim());
});
