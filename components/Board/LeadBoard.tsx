"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { LeadCard } from "@/components/Board/LeadCard";
import { Lead, PipelineStage } from "@/types/lead";

interface LeadBoardProps {
    initialLeads: Lead[];
    onLeadMove?: (leadId: string, newStage: PipelineStage) => void;
}

const STAGES: PipelineStage[] = [
    'New',
    'Qualified',
    'Contacted',
    'Engaged',
    'Scheduled',
    'ClosedWon',
    'ClosedLost'
];

export function LeadBoard({ initialLeads, onLeadMove }: LeadBoardProps) {
    const [leads, setLeads] = useState(initialLeads);
    const [isBrowser, setIsBrowser] = useState(false);

    // Fix hydration mismatch for DnD
    useEffect(() => {
        setIsBrowser(true);
        setLeads(initialLeads);
    }, [initialLeads]);

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) return;

        const newStage = destination.droppableId as PipelineStage;

        // Optimistic Update
        const updatedLeads = leads.map(lead =>
            lead.id === draggableId ? { ...lead, stage: newStage } : lead
        );

        setLeads(updatedLeads);

        if (onLeadMove) {
            onLeadMove(draggableId, newStage);
        }
    };

    const handleAction = (action: string, leadId: string) => {
        console.log(`Action: ${action} on lead ${leadId}`);
    };

    if (!isBrowser) {
        return <div className="p-10 text-zinc-500">Loading Board...</div>;
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-6 overflow-x-auto pb-6 h-full min-w-full snap-x">
                {STAGES.map((stage) => {
                    const stageLeads = leads.filter(l => l.stage === stage);

                    return (
                        <div key={stage} className="min-w-[400px] flex flex-col h-full snap-center">
                            {/* Column Header */}
                            <div className="flex items-center justify-between mb-4 px-4 sticky top-0 bg-black/80 backdrop-blur-md z-10 py-4 border-b border-white/5 rounded-t-3xl">
                                <h2 className="text-xs font-bold text-white tracking-[0.2em] uppercase opacity-70">
                                    {stage.replace(/([A-Z])/g, ' $1').trim()}
                                </h2>
                                <span className="bg-white/10 text-white text-[10px] px-2.5 py-1 rounded-full font-mono">
                                    {stageLeads.length}
                                </span>
                            </div>

                            {/* Droppable Area */}
                            <Droppable droppableId={stage}>
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={`flex-1 rounded-b-3xl p-2 space-y-4 overflow-y-auto custom-scrollbar transition-colors duration-300 ${snapshot.isDraggingOver ? "bg-white/5" : "bg-transparent"
                                            }`}
                                    >
                                        {stageLeads.map((lead, index) => (
                                            <Draggable key={lead.id} draggableId={lead.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`transition-transform ${snapshot.isDragging ? "scale-105 rotate-1 shadow-2xl z-50" : ""}`}
                                                        style={provided.draggableProps.style}
                                                    >
                                                        <LeadCard lead={lead} onAction={handleAction} />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}

                                        {stageLeads.length === 0 && !snapshot.isDraggingOver && (
                                            <div className="h-32 flex flex-col items-center justify-center text-zinc-700 text-xs gap-2 border border-dashed border-zinc-800 rounded-3xl mx-2">
                                                <div className="w-2 h-2 bg-zinc-800 rounded-full" />
                                                <span>Empty Stage</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    );
                })}
            </div>
        </DragDropContext>
    );
}
