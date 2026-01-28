export default function Home() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
        <p className="text-secondary opacity-80">Welcome back, Operator.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Placeholder Cards */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-6 rounded-xl bg-[#3D3D3D] border border-[#A68763]/30 hover:border-primary/50 transition-colors"
          >
            <h3 className="text-lg font-semibold text-foreground mb-2">Metric {i}</h3>
            <p className="text-3xl font-mono text-primary">0</p>
          </div>
        ))}
      </div>
    </div>
  );
}
