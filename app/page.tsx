import { ArrowUpRight, Users, MessageSquare, BarChart3, Clock, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export const revalidate = 0; // Dynamic data

export default async function Home() {
  // 1. Fetch Total Leads
  const { count: totalLeads } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true });

  // 2. Fetch Recent Activity (Last 5 leads)
  const { data: recentLeads } = await supabase
    .from('leads')
    .select('id, business_name, created_at, stage, industry')
    .order('created_at', { ascending: false })
    .limit(5);

  // 3. Simple Pipeline Stats (Example: Count 'New' vs 'Qualified' etc could be added here)
  // For now we just show total leads.

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end pb-6 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-zinc-400 mt-1">Welcome back, Operator.</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-mono">System Status</p>
          <div className="flex items-center gap-2 justify-end mt-1">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-emerald-500">Online</span>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Leads"
          value={totalLeads || 0}
          trend="Live"
          icon={Users}
        />
        <StatsCard
          title="Response Rate"
          value="--%"
          trend="Pending"
          icon={MessageSquare}
        />
        <StatsCard
          title="Pipeline Value"
          value="$--"
          trend="Pending"
          icon={BarChart3}
        />
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-zinc-500" />
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        </div>
        <div className="bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/5 p-1">
          {recentLeads && recentLeads.length > 0 ? (
            recentLeads.map((lead: any) => (
              <div key={lead.id} className="flex items-center justify-between p-4 hover:bg-white/5 rounded-xl transition-colors border-b border-white/5 last:border-0 group">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors text-xs font-bold">
                    {lead.business_name ? lead.business_name.substring(0, 2).toUpperCase() : "??"}
                  </div>
                  <div>
                    <p className="text-sm text-zinc-200 font-medium">{lead.business_name || "Unknown Business"} <span className="text-zinc-600 mx-2">|</span> <span className="text-zinc-500 font-normal">{lead.industry || "No Industry"}</span></p>
                    <p className="text-xs text-zinc-500">
                      Created {new Date(lead.created_at).toLocaleString()} • <span className="text-zinc-400">{lead.stage}</span>
                    </p>
                  </div>
                </div>
                <Link href={`/leads/${lead.id}`} className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1">
                  View <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-zinc-500 text-sm">
              No activity yet. Waiting for webhooks...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, trend, icon: Icon }: any) {
  return (
    <div className="p-6 rounded-3xl bg-zinc-900/40 backdrop-blur-xl border border-white/5 hover:border-white/10 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors text-zinc-400 group-hover:text-white">
          <Icon className="w-5 h-5" />
        </div>
        <span className="flex items-center text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
          {trend} <ArrowUpRight className="w-3 h-3 ml-1" />
        </span>
      </div>
      <div>
        <p className="text-sm text-zinc-500 font-medium uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-mono text-white mt-1 group-hover:text-zinc-100 transition-colors">{value}</h3>
      </div>
    </div>
  )
}
