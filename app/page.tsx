import { ArrowUpRight, Users, MessageSquare, BarChart3, Clock } from "lucide-react";

export default function Home() {
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
          value="128"
          trend="+12%"
          icon={Users}
        />
        <StatsCard
          title="Response Rate"
          value="34%"
          trend="+2.4%"
          icon={MessageSquare}
        />
        <StatsCard
          title="Pipeline Value"
          value="$45,200"
          trend="+8%"
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
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 hover:bg-white/5 rounded-xl transition-colors border-b border-white/5 last:border-0 group">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                  {i}
                </div>
                <div>
                  <p className="text-sm text-zinc-200 font-medium">New lead ingested regarding "SaaS Pricing"</p>
                  <p className="text-xs text-zinc-500">2 hours ago</p>
                </div>
              </div>
              <button className="text-xs text-zinc-500 hover:text-white transition-colors">View</button>
            </div>
          ))}
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
