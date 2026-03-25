import CameraFeed from './CameraFeed'

const SEV_STYLE = {
  High:   { bg: '#C0392B22', color: '#C0392B' },
  Medium: { bg: '#F39C1222', color: '#F39C12' },
  Low:    { bg: '#27AE6022', color: '#27AE60' },
}

const MOCK_ALERTS = [
  { id: 1, time: '15:42', type: 'Near-Miss',    severity: 'High'   },
  { id: 2, time: '14:28', type: 'Speed Warning', severity: 'Medium' },
  { id: 3, time: '13:55', type: 'Red-Light',     severity: 'High'   },
  { id: 4, time: '12:11', type: 'Alert-Only',    severity: 'Low'    },
  { id: 5, time: '11:03', type: 'Near-Miss',     severity: 'Medium' },
]

function MetricRow({ label, value, unit }) {
  return (
    <div
      className="flex justify-between items-center py-1.5"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
    >
      <span className="text-ts text-xs">{label}</span>
      <span className="text-tp text-sm font-semibold">
        {value}<span className="text-ts text-xs ml-1">{unit}</span>
      </span>
    </div>
  )
}

function RsuDot({ rsu }) {
  const color = rsu.status === 'online' ? '#27AE60' : rsu.status === 'degraded' ? '#F39C12' : '#C0392B'
  return (
    <div
      className="flex flex-col items-center gap-0.5"
      title={`${rsu.unitId} · ${rsu.uptime != null ? rsu.uptime.toFixed(1) + '%' : 'N/A'}`}
    >
      <div className="w-3 h-3 rounded-full" style={{ background: color, boxShadow: `0 0 4px ${color}` }} />
      <span className="text-ts" style={{ fontSize: 9 }}>{rsu.unitId}</span>
    </div>
  )
}

export default function IntersectionDetail({ intersection, rsus, onPlayClip }) {
  if (!intersection) return null
  const ixRsus = rsus.filter(r => r.intersectionId === intersection.id)
  const m = intersection.metrics

  return (
    <div
      className="h-full overflow-y-auto flex flex-col gap-3 p-3 rounded-xl"
      style={{ background: '#162433', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div>
        <div className="text-tp font-semibold text-sm">{intersection.name}</div>
        <div className="text-ts text-xs">
          {intersection.city} · Local {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      <CameraFeed intersectionId={intersection.id} />

      <div>
        <div className="text-ts text-xs font-medium uppercase tracking-wider mb-1.5">Real-Time Metrics</div>
        <MetricRow label="Traffic Volume"     value={m.volume}         unit="veh/hr" />
        <MetricRow label="Avg Approach Speed" value={m.speed}          unit="km/h"  />
        <MetricRow label="SCE Rate"           value={m.sceRate}        unit="/100v" />
        <MetricRow label="False Alarm Rate"   value={m.falseAlarmRate} unit="%"     />
        <MetricRow label="RUU Penetration"    value={m.ruuPenetration} unit="%"     />
      </div>

      <div>
        <div className="text-ts text-xs font-medium uppercase tracking-wider mb-1.5">Recent Alerts</div>
        <div className="flex flex-col gap-1">
          {MOCK_ALERTS.map(a => (
            <div key={a.id} className="flex items-center gap-2 py-1">
              <span className="text-ts text-xs w-10 flex-shrink-0">{a.time}</span>
              <span className="text-tp text-xs flex-1">{a.type}</span>
              <span
                className="text-xs px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0"
                style={{ background: SEV_STYLE[a.severity].bg, color: SEV_STYLE[a.severity].color, fontSize: 10 }}
              >
                {a.severity}
              </span>
              <button
                onClick={() => onPlayClip && onPlayClip({ ...a, intersection: intersection.name, city: intersection.city, ts: a.time, ttc: 1.2, duration: '2.4s' })}
                className="flex-shrink-0 hover:underline"
                style={{ color: '#2E86C1', fontSize: 10 }}
              >
                ▶ Clip
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-ts text-xs font-medium uppercase tracking-wider mb-2">RSU Unit Health</div>
        <div className="flex flex-wrap gap-3">
          {ixRsus.length > 0
            ? ixRsus.map(r => <RsuDot key={r.id} rsu={r} />)
            : Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: '#27AE60' }} />
                  <span className="text-ts" style={{ fontSize: 9 }}>RSU-{i + 1}</span>
                </div>
              ))
          }
        </div>
      </div>
    </div>
  )
}
