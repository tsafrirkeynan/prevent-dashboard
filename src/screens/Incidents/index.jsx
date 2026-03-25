import { useState, useMemo } from 'react'
import ClipModal from './ClipModal'

const USER_ICONS = { car: '🚗', pedestrian: '🚶', cyclist: '🚲', motorcycle: '🛵' }

const SEV_STYLE = {
  High:   { bg: '#C0392B22', color: '#C0392B' },
  Medium: { bg: '#F39C1222', color: '#F39C12' },
  Low:    { bg: '#27AE6022', color: '#27AE60' },
}

const TYPE_OPTIONS = ['All', 'Near-Miss', 'Collision', 'Alert-Only', 'Speed Warning', 'Red-Light', 'Mixed Traffic']
const SEV_OPTIONS  = ['All', 'Low', 'Medium', 'High']

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-ts text-xs">{label}:</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="text-tp text-xs rounded-lg px-2 py-1.5 outline-none"
        style={{ background: '#0F1923', border: '1px solid rgba(255,255,255,0.08)', color: '#E8F0F7' }}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

export default function Incidents({ sim }) {
  const [typeFilter, setTypeFilter] = useState('All')
  const [sevFilter,  setSevFilter]  = useState('All')
  const [cityFilter, setCityFilter] = useState('All')
  const [clip, setClip] = useState(null)

  const incidents = sim.incidents
  const cities    = ['All', ...new Set(incidents.map(i => i.city))]

  const filtered = useMemo(() => incidents.filter(i => {
    if (typeFilter !== 'All' && i.type     !== typeFilter) return false
    if (sevFilter  !== 'All' && i.severity !== sevFilter)  return false
    if (cityFilter !== 'All' && i.city     !== cityFilter) return false
    return true
  }), [typeFilter, sevFilter, cityFilter, incidents])

  return (
    <div className="p-6 h-full flex flex-col" style={{ minHeight: 0 }}>
      <div className="mb-4">
        <h1 className="text-tp text-xl font-semibold">Incident Feed</h1>
        <p className="text-ts text-sm">{incidents.length} total recorded incidents</p>
      </div>

      {/* Filter Bar */}
      <div
        className="flex flex-wrap gap-3 p-3 rounded-xl mb-4 items-center"
        style={{ background: '#162433', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <FilterSelect label="Type"     value={typeFilter} onChange={setTypeFilter} options={TYPE_OPTIONS} />
        <FilterSelect label="Severity" value={sevFilter}  onChange={setSevFilter}  options={SEV_OPTIONS} />
        <FilterSelect label="City"     value={cityFilter} onChange={setCityFilter} options={cities} />
        <div className="ml-auto text-ts text-xs">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Table */}
      <div
        className="flex-1 rounded-xl overflow-hidden flex flex-col"
        style={{ background: '#162433', border: '1px solid rgba(255,255,255,0.06)', minHeight: 0 }}
      >
        {/* Header */}
        <div
          className="grid text-ts text-xs font-medium uppercase tracking-wider px-4 py-3 flex-shrink-0"
          style={{
            gridTemplateColumns: '120px 1fr 120px 80px 100px 70px 90px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div>Timestamp</div>
          <div>Intersection</div>
          <div>Type</div>
          <div>Severity</div>
          <div>Road Users</div>
          <div>Duration</div>
          <div>Actions</div>
        </div>

        {/* Rows */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 gap-2">
              <div className="text-ts text-2xl">🔍</div>
              <div className="text-ts text-sm">No incidents match the current filters</div>
              <button
                onClick={() => { setTypeFilter('All'); setSevFilter('All'); setCityFilter('All') }}
                className="text-accent text-xs hover:underline"
                style={{ color: '#2E86C1' }}
              >
                Clear filters
              </button>
            </div>
          ) : filtered.map(inc => (
            <div
              key={inc.id}
              className="grid items-center px-4 py-3 hover:bg-white/[0.02] transition-colors"
              style={{
                gridTemplateColumns: '120px 1fr 120px 80px 100px 70px 90px',
                borderBottom: '1px solid rgba(255,255,255,0.03)',
              }}
            >
              <div className="text-ts text-xs font-mono">{inc.ts.split(' ')[1]}</div>
              <div>
                <div className="text-tp text-xs font-medium leading-tight">{inc.intersection}</div>
                <div className="text-ts" style={{ fontSize: 10 }}>{inc.city}</div>
              </div>
              <div className="text-tp text-xs">{inc.type}</div>
              <div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: SEV_STYLE[inc.severity].bg, color: SEV_STYLE[inc.severity].color }}
                >
                  {inc.severity}
                </span>
              </div>
              <div className="flex gap-0.5 flex-wrap">
                {inc.users.map((u, i) => (
                  <span key={i} title={u} style={{ fontSize: 14 }}>{USER_ICONS[u] || '🚗'}</span>
                ))}
              </div>
              <div className="text-ts text-xs">{inc.duration}</div>
              <div>
                <button
                  onClick={() => setClip(inc)}
                  className="text-xs font-medium hover:underline"
                  style={{ color: '#2E86C1' }}
                >
                  ▶ Play Clip
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ClipModal incident={clip} onClose={() => setClip(null)} />
    </div>
  )
}
