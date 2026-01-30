"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckCircle, Circle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
    { id: "onboarding", label: "01. Onboarding" },
    { id: "qualification", label: "02. Qualification" },
    { id: "appointment", label: "03. Appointment" },
    { id: "presentation", label: "04. Presentation" },
    { id: "closing", label: "05. Closing" },
];

export function StepNavigation({ leadId }: { leadId: string }) {
    const pathname = usePathname();

    return (
        <div className="w-full border-b border-white/5 bg-black/50 backdrop-blur-sm">
            <div className="flex items-center justify-start w-full px-4 overflow-x-auto no-scrollbar gap-8">
                {STEPS.map((step, index) => {
                    const isActive = pathname.includes(step.id);
                    // Simple heuristic: If we are on a later step, previous ones are "done" (visually)
                    const isCompleted = STEPS.findIndex(s => pathname.includes(s.id)) > index;

                    return (
                        <Link
                            key={step.id}
                            href={`/leads/${leadId}/${step.id}`}
                            className={cn(
                                "flex items-center gap-2 py-4 px-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                                isActive
                                    ? "border-white text-white"
                                    : "border-transparent text-zinc-600 hover:text-zinc-400"
                            )}
                        >
                            {isCompleted ? (
                                <CheckCircle className="w-4 h-4 text-white" />
                            ) : (
                                <Circle className={cn("w-4 h-4", isActive ? "text-white" : "text-zinc-700")} />
                            )}
                            {step.label}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
