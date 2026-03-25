function KpiCard({ icon, label, value, trend, trendDir }) {
  return (
    <div
      className="flex-1 rounded-xl p-4"
      style={{ background: '#162433', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-ts text-xs font-medium uppercase tracking-wider">{label}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <div className="text-tp text-2xl font-bold">{value}</div>
      {trend != null && (
        <div
          className="text-xs mt-1 flex items-center gap-1"
          style={{ color: trendDir === 'up' ? '#C0392B' : '#27AE60' }}
        >
          <span>{trendDir === 'up' ? '▲' : '▼'}</span>
          <span>{trend} vs yesterday</span>
        </div>
      )}
    </div>
  )
}

export default function KpiBar({ kpis }) {
  const sceDiff = kpis.scesToday - kpis.scesYesterday
  const sceDir  = sceDiff >= 0 ? 'up' : 'down'

  return (
    <div className="flex gap-4 mb-6">
      <KpiCard icon="📡" label="Active RSUs"      value={kpis.activeRsus} />
      <KpiCard icon="⚡" label="SCEs Today"       value={kpis.scesToday}
               trend={String(Math.abs(sceDiff))} trendDir={sceDir} />
      <KpiCard icon="📱" label="Active RUU Users" value={kpis.activeRuus.toLocaleString()} />
      <KpiCard icon="🔔" label="Alerts Last Hour" value={kpis.alertsLastHr} />
    </div>
  )
}
