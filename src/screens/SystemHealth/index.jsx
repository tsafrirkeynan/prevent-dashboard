import OtaPanel from './OtaPanel'

const STATUS_STYLE = {
  online:   { bg: '#27AE6022', color: '#27AE60', label: 'Online',   icon: '●' },
  degraded: { bg: '#F39C1222', color: '#F39C12', label: 'Degraded', icon: '⚠' },
  offline:  { bg: '#C0392B22', color: '#C0392B', label: 'Offline',  icon: '✕' },
  standby:  { bg: '#8FAFC722', color: '#8FAFC7', label: 'Standby',  icon: '○' },
}

const ALERT_COLOR = { warn: '#F39C12', alert: '#C0392B', info: '#2E86C1' }

function buildAlerts(rsus, otaPending) {
  const alerts = []
  rsus.filter(r => r.status === 'degraded').forEach((r, i) =>
    alerts.push({ id: `d${i}`, msg: `${r.unitId} signal degraded — check antenna mounting`, age: '15 min ago', sev: 'warn' })
  )
  rsus.filter(r => r.status === 'offline').forEach((r, i) =>
    alerts.push({ id: `o${i}`, msg: `${r.unitId} offline — maintenance required`, age: '2 hrs ago', sev: 'alert' })
  )
  if (otaPending > 0)
    alerts.push({ id: 'ota', msg: `OTA update available for ${otaPending} units (v2.5.0)`, age: '1 hr ago', sev: 'info' })
  return alerts
}

export default function SystemHealth({ sim }) {
  const rsus = sim.rsus

  const counts = {
    online:   rsus.filter(r => r.status === 'online').length,
    degraded: rsus.filter(r => r.status === 'degraded').length,
    offline:  rsus.filter(r => r.status === 'offline').length,
    standby:  rsus.filter(r => r.status === 'standby').length,
    otaPending: rsus.filter(r => r.swVersion === 'v2.4.1' && r.status !== 'offline').length,
  }

  const sysAlerts = buildAlerts(rsus, counts.otaPending)

  return (
    <div className="p-6 flex flex-col gap-5 min-h-full">
      <div>
        <h1 className="text-tp text-xl font-semibold">System Health</h1>
        <p className="text-ts text-sm">RSU network status and firmware management</p>
      </div>

      {/* Summary stats */}
      <div className="flex gap-3">
        {[
          { label: 'Online',      value: counts.online,    color: '#27AE60' },
          { label: 'Degraded',    value: counts.degraded,  color: '#F39C12' },
          { label: 'Offline',     value: counts.offline,   color: '#C0392B' },
          { label: 'OTA Pending', value: counts.otaPending,color: '#2E86C1' },
        ].map(s => (
          <div
            key={s.label}
            className="flex-1 rounded-xl p-4 text-center"
            style={{ background: '#162433', border: `1px solid ${s.color}22` }}
          >
            <div className="font-bold text-2xl" style={{ color: s.color }}>{s.value}</div>
            <div className="text-ts text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* RSU Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: '#162433', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-tp text-sm font-semibold">RSU Units</span>
          <span className="text-ts text-xs ml-2">({rsus.length} total)</span>
        </div>
        {/* Table header */}
        <div
          className="grid text-ts text-xs font-medium uppercase tracking-wider px-4 py-2"
          style={{
            gridTemplateColumns: '80px 1fr 100px 90px 70px 80px 70px 70px',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <div>Unit ID</div>
          <div>Intersection</div>
          <div>City</div>
          <div>Status</div>
          <div>Uptime</div>
          <div>Last Ping</div>
          <div>SW Ver</div>
          <div>Signal</div>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: 340 }}>
          {rsus.map(rsu => {
            const st = STATUS_STYLE[rsu.status]
            return (
              <div
                key={rsu.id}
                className="grid items-center px-4 py-2.5 hover:bg-white/[0.02] transition-colors"
                style={{
                  gridTemplateColumns: '80px 1fr 100px 90px 70px 80px 70px 70px',
                  borderBottom: '1px solid rgba(255,255,255,0.03)',
                }}
              >
                <div className="text-tp text-xs font-mono">{rsu.unitId}</div>
                <div className="text-ts text-xs truncate">{rsu.intersectionName}</div>
                <div className="text-ts text-xs">{rsu.city}</div>
                <div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: st.bg, color: st.color }}
                  >
                    {st.icon} {st.label}
                  </span>
                </div>
                <div className="text-tp text-xs">
                  {rsu.uptime != null ? `${rsu.uptime.toFixed(1)}%` : '—'}
                </div>
                <div className="text-ts text-xs">{rsu.lastPing}</div>
                <div className="text-ts text-xs font-mono">{rsu.swVersion}</div>
                <div
                  className="text-xs"
                  style={{ color: rsu.signal == null ? '#8FAFC7' : rsu.signal > -65 ? '#27AE60' : rsu.signal > -75 ? '#F39C12' : '#C0392B' }}
                >
                  {rsu.signal != null ? `${rsu.signal} dBm` : '—'}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* OTA + System Alerts side by side */}
      <div className="flex gap-4">
        <div className="flex-1">
          <OtaPanel pendingCount={counts.otaPending} />
        </div>
        <div
          className="rounded-xl p-4 flex flex-col gap-2"
          style={{ width: 340, background: '#162433', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="text-tp text-sm font-semibold mb-1">Active System Alerts</div>
          {sysAlerts.map(a => (
            <div
              key={a.id}
              className="flex items-start gap-2 p-2.5 rounded-lg"
              style={{ background: `${ALERT_COLOR[a.sev]}11`, border: `1px solid ${ALERT_COLOR[a.sev]}22` }}
            >
              <span style={{ color: ALERT_COLOR[a.sev], fontSize: 14, lineHeight: 1.2 }}>
                {a.sev === 'alert' ? '✕' : a.sev === 'warn' ? '⚠' : 'ℹ'}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-tp text-xs">{a.msg}</div>
                <div className="text-ts" style={{ fontSize: 10 }}>{a.age}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
