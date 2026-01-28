export type PipelineStage =
    | 'New'
    | 'Qualified'
    | 'Contacted'
    | 'Engaged'
    | 'Scheduled'
    | 'ClosedWon'
    | 'ClosedLost';

export interface Lead {
    id: string;

    // Business Data (Flattened from Business model)
    businessName: string;
    address?: string; // Mapped to Google Maps
    website?: string;
    phone?: string;
    email?: string;
    category?: string; // Industry/Niche
    description?: string; // Business description

    // Sales Context (From Lead model)
    painPoint?: string;
    suggestedMessage?: string;

    // Pipeline & Process
    stage: PipelineStage;
    status: 'Active' | 'Archived';
    lastActionAt: Date;
    createdAt: Date;

    // Metadata
    originalQueryLocation?: string;
    originalQueryIndustry?: string;

    // Backup
    rawData?: Record<string, any>;
}
