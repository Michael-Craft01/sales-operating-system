import { Users, BarChart3, Clock, ArrowRight, Zap, Target } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { PipelineFunnel } from "@/components/PipelineFunnel";
import { ActionZone } from "@/components/ActionZone";
import { RecentLeadsList } from "@/components/RecentLeadsList";
import { GoalsWidget } from "@/components/GoalsWidget";
import { NotificationBell } from "@/components/Notifications/NotificationBell";
import { EngagementManager } from "@/components/EngagementManager";



export default async function Home() {
  // 1. Fetch leads for Funnel & Metrics
  const { data: leads } = await supabase
    .from('leads')
    .select('id, stage, created_at, last_action_at, business_name, industry, phone, email');

  // 2. Process Data
  const stageCounts: Record<string, number> = {};
  let totalLeads = 0;
  let won = 0;
  let lost = 0;

  (leads || []).forEach(lead => {
    stageCounts[lead.stage] = (stageCounts[lead.stage] || 0) + 1;
    totalLeads++;
    if (lead.stage === 'ClosedWon') won++;
    if (lead.stage === 'ClosedLost') lost++;
  });

  const winRate = (won + lost) > 0 ? Math.round((won / (won + lost)) * 100) : 0;

  // 3. Logic for "Next Best Action"
  const priorityStages = ['Scheduled', 'Engaged', 'Qualified', 'New'];
  const nextBestLeads = (leads || [])
    .filter(l => priorityStages.includes(l.stage))
    .sort((a, b) => {
      const stageDiff = priorityStages.indexOf(a.stage) - priorityStages.indexOf(b.stage);
      if (stageDiff !== 0) return stageDiff;
      return new Date(a.last_action_at || 0).getTime() - new Date(b.last_action_at || 0).getTime();
    })
    .slice(0, 5);

  // 4. Recent Activity
  const recentLeads = [...(leads || [])]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="h-full overflow-y-auto p-6 space-y-8 pb-12">
      <header className="flex justify-between items-end pb-6 border-b border-zinc-900">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight font-serif italic">Chocolate</h1>
          <p className="text-zinc-500 mt-1">Focus on what matters. Close the deal.</p>
        </div>
        <div className="text-right flex items-center gap-4">
          <div className="text-xs text-zinc-500 font-mono">
            <span className="block text-zinc-600 uppercase tracking-widest text-[10px] mb-1">Win Rate</span>
            <span className="text-xl text-white">{winRate}%</span>
          </div>
          <div className="h-8 w-px bg-zinc-900" />
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-mono">System</p>
            <div className="flex items-center gap-2 justify-end mt-1">
              <NotificationBell />
              <EngagementManager />
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-sm font-medium text-white">Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero: Next Best Action */}
      <section>
        <ActionZone leads={nextBestLeads} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column: Stats & Recent */}
        <div className="lg:col-span-2 space-y-8">

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard
              title="Total Leads"
              value={totalLeads}
              trend="Live"
              icon={Users}
            />
            <StatsCard
              title="Pipeline Value"
              value="$--"
              subtitle="Est. Revenue"
              trend="Pending"
              icon={BarChart3}
            />
            <StatsCard
              title="Action Needed"
              value={leads?.filter(l => ['New', 'Qualified'].includes(l.stage)).length || 0}
              subtitle="Leads waiting"
              trend="High"
              icon={Zap}
            />
          </div>

          {/* Recent Activity */}
          <div>
            <RecentLeadsList leads={leads || []} />
          </div>
        </div>

        {/* Sidebar: Pipeline Funnel */}
        <div className="lg:col-span-1">
          <PipelineFunnel data={stageCounts} />

          <GoalsWidget />

          <div className="mt-6 p-6 rounded-3xl bg-black border border-zinc-900">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-zinc-400" />
              <h3 className="font-bold text-white">Monthly Target</h3>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-mono text-white">{won}</span>
              <span className="text-zinc-500 mb-1">/ 10 deals</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-900 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: `${Math.min((won / 10) * 100, 100)}%` }} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatsCard({ title, value, subtitle, trend, icon: Icon }: any) {
  return (
    <div className="p-6 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 group shadow-[0_4px_24px_-1px_rgba(0,0,0,0.2)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-2xl bg-zinc-900 group-hover:bg-white group-hover:text-black transition-colors text-zinc-500">
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className="flex items-center text-xs font-medium px-2 py-1 rounded-full text-white bg-zinc-800 border border-zinc-700">
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-mono text-white mt-1 group-hover:text-zinc-200 transition-colors">{value}</h3>
        {subtitle && <p className="text-xs text-zinc-600 mt-1">{subtitle}</p>}
      </div>
    </div>
  )
}
