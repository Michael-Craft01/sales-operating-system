'use client';

import { Toaster as Sonner } from 'sonner';

export function Toaster() {
    return (
        <Sonner
            theme="dark"
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast:
                        'group toast group-[.toaster]:bg-black group-[.toaster]:text-white group-[.toaster]:border-zinc-800 group-[.toaster]:shadow-lg group-[.toaster]:rounded-2xl group-[.toaster]:font-sans',
                    description: 'group-[.toast]:text-zinc-500',
                    actionButton:
                        'group-[.toast]:bg-white group-[.toast]:text-black',
                    cancelButton:
                        'group-[.toast]:bg-zinc-800 group-[.toast]:text-zinc-400',
                    title: 'group-[.toast]:font-bold group-[.toast]:text-lg group-[.toast]:mb-1',
                    icon: 'group-[.toast]:text-white',
                },
            }}
        />
    );
}
