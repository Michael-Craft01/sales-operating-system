import { LeadBoard } from "@/components/Board/LeadBoard";
import { Lead } from "@/types/lead";

// Mock Data for Verification
const MOCK_LEADS: Lead[] = [
    {
        id: '1',
        businessName: 'Acme Dental Studio',
        category: 'Dental Practice',
        address: '123 Market St, San Francisco, CA',
        stage: 'New',
        status: 'Active',
        painPoint: 'Low patient retention rates',
        suggestedMessage: 'I noticed your reviews mention long wait times. We help clinics automate scheduling to fix exactly that.',
        phone: '+15550123456',
        website: 'https://example.com',
        createdAt: new Date(),
        lastActionAt: new Date(),
    },
    {
        id: '2',
        businessName: 'TechFlow Solutions',
        category: 'SaaS',
        stage: 'Qualified',
        status: 'Active',
        painPoint: 'Scaling outbound sales',
        suggestedMessage: 'Saw you are hiring SDRs. Our tool automates the first touch so your reps can focus on closing.',
        email: 'contact@techflow.com',
        createdAt: new Date(),
        lastActionAt: new Date(),
    },
    {
        id: '3',
        businessName: 'GreenLeaf Landscaping',
        category: 'Local Services',
        stage: 'Contacted',
        status: 'Active',
        painPoint: 'Seasonal booking gaps',
        phone: '+15559876543',
        createdAt: new Date(),
        lastActionAt: new Date(),
    }
];

export default function LeadsPage() {
    return (
        <div className="h-[calc(100vh-80px)]">
            <header className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Lead Operations</h1>
                    <p className="text-secondary opacity-80">Manage your active pipeline.</p>
                </div>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold hover:bg-secondary transition-colors">
                    Add Manual Lead
                </button>
            </header>

            <LeadBoard leads={MOCK_LEADS} />
        </div>
    );
}
