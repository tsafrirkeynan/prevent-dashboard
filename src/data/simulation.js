import { useState, useEffect, useRef } from 'react'
import { ALERT_DISPLAY_MS } from '../components/AlertToast'

// ─── Intersection Data ────────────────────────────────────────────────────────

export const IL_INTERSECTIONS = [
  {
    id: 'il-1',
    name: 'Ayalon / HaShalom',
    city: 'Tel Aviv',
    country: 'IL',
    lat: 32.0667,
    lng: 34.7903,
    status: 'normal',
    metrics: { volume: 280, speed: 48, sceRate: 1.4, falseAlarmRate: 3.2, ruuPenetration: 24 },
  },
  {
    id: 'il-2',
    name: 'Begin Rd / Ibn Gvirol',
    city: 'Tel Aviv',
    country: 'IL',
    lat: 32.0836,
    lng: 34.7865,
    status: 'warning',
    metrics: { volume: 310, speed: 42, sceRate: 2.1, falseAlarmRate: 4.8, ruuPenetration: 19 },
  },
  {
    id: 'il-3',
    name: 'Kaplan / Menachem Begin',
    city: 'Tel Aviv',
    country: 'IL',
    lat: 32.0681,
    lng: 34.7962,
    status: 'normal',
    metrics: { volume: 195, speed: 51, sceRate: 0.9, falseAlarmRate: 2.1, ruuPenetration: 31 },
  },
]

export const IN_INTERSECTIONS = [
  {
    id: 'in-1',
    name: 'Anna Salai / Nungambakkam',
    city: 'Chennai',
    country: 'IN',
    lat: 13.0670,
    lng: 80.2384,
    status: 'normal',
    metrics: { volume: 420, speed: 32, sceRate: 2.8, falseAlarmRate: 7.1, ruuPenetration: 18 },
  },
  {
    id: 'in-2',
    name: 'Velachery / OMR Junction',
    city: 'Chennai',
    country: 'IN',
    lat: 12.9765,
    lng: 80.2209,
    status: 'warning',
    metrics: { volume: 380, speed: 28, sceRate: 3.5, falseAlarmRate: 8.4, ruuPenetration: 14 },
  },
  {
    id: 'in-3',
    name: 'IIT Madras / Sardar Patel Rd',
    city: 'Chennai',
    country: 'IN',
    lat: 13.0099,
    lng: 80.2371,
    status: 'normal',
    metrics: { volume: 260, speed: 35, sceRate: 2.1, falseAlarmRate: 5.9, ruuPenetration: 21 },
  },
]

// ─── RSU Data ─────────────────────────────────────────────────────────────────

function makeRsus(intersections) {
  const rsus = []
  intersections.forEach(ix => {
    for (let i = 1; i <= 6; i++) {
      const unitNum = parseInt(ix.id.split('-')[1]) * 10 + i
      rsus.push({
        id: `${ix.country.toLowerCase()}-rsu-${unitNum}`,
        unitId: `RSU-${String(unitNum).padStart(2, '0')}`,
        intersectionId: ix.id,
        intersectionName: ix.name,
        city: ix.city,
        status: unitNum === 14 ? 'offline' : unitNum === 21 ? 'degraded' : 'online',
        uptime: unitNum === 14 ? 0 : unitNum === 21 ? 94.2 : parseFloat((98 + Math.random() * 1.8).toFixed(1)),
        lastPing: unitNum === 14 ? '2h ago' : unitNum === 21 ? '47s ago' : `${Math.floor(Math.random() * 20) + 2}s ago`,
        swVersion: unitNum === 14 ? 'v2.3.0' : 'v2.4.1',
        signal: unitNum === 14 ? null : unitNum === 21 ? -78 : -(55 + Math.floor(Math.random() * 20)),
      })
    }
  })
  rsus.push({
    id: 'spare-1', unitId: 'RSU-S1', intersectionId: null, intersectionName: 'Spare',
    city: '—', status: 'standby', uptime: null, lastPing: '—', swVersion: 'v2.5.0', signal: null,
  })
  rsus.push({
    id: 'spare-2', unitId: 'RSU-S2', intersectionId: null, intersectionName: 'Spare',
    city: '—', status: 'standby', uptime: null, lastPing: '—', swVersion: 'v2.5.0', signal: null,
  })
  return rsus
}

export const INITIAL_IL_RSUS = makeRsus(IL_INTERSECTIONS)
export const INITIAL_IN_RSUS = makeRsus(IN_INTERSECTIONS)

// ─── Incidents ────────────────────────────────────────────────────────────────

export const ALL_INCIDENTS = [
  { id: 'inc-001', ts: '2026-03-23 08:14', intersection: 'Ayalon / HaShalom', city: 'Tel Aviv', country: 'IL', type: 'Near-Miss', severity: 'High', users: ['car','car'], duration: '3.2s', ttc: 1.1 },
  { id: 'inc-002', ts: '2026-03-23 08:47', intersection: 'Begin Rd / Ibn Gvirol', city: 'Tel Aviv', country: 'IL', type: 'Speed Warning', severity: 'Medium', users: ['car','pedestrian'], duration: '1.8s', ttc: 2.4 },
  { id: 'inc-003', ts: '2026-03-23 09:03', intersection: 'Kaplan / Menachem Begin', city: 'Tel Aviv', country: 'IL', type: 'Alert-Only', severity: 'Low', users: ['car','cyclist'], duration: '0.9s', ttc: 3.8 },
  { id: 'inc-004', ts: '2026-03-23 09:31', intersection: 'Ayalon / HaShalom', city: 'Tel Aviv', country: 'IL', type: 'Near-Miss', severity: 'High', users: ['car','motorcycle'], duration: '2.7s', ttc: 0.8 },
  { id: 'inc-005', ts: '2026-03-23 10:15', intersection: 'Begin Rd / Ibn Gvirol', city: 'Tel Aviv', country: 'IL', type: 'Red-Light', severity: 'High', users: ['car','pedestrian'], duration: '4.1s', ttc: 0.5 },
  { id: 'inc-006', ts: '2026-03-23 10:48', intersection: 'Kaplan / Menachem Begin', city: 'Tel Aviv', country: 'IL', type: 'Near-Miss', severity: 'Medium', users: ['car','cyclist'], duration: '2.1s', ttc: 1.7 },
  { id: 'inc-007', ts: '2026-03-23 11:22', intersection: 'Ayalon / HaShalom', city: 'Tel Aviv', country: 'IL', type: 'Alert-Only', severity: 'Low', users: ['car','car'], duration: '1.2s', ttc: 4.2 },
  { id: 'inc-008', ts: '2026-03-23 12:05', intersection: 'Begin Rd / Ibn Gvirol', city: 'Tel Aviv', country: 'IL', type: 'Speed Warning', severity: 'Medium', users: ['car','pedestrian'], duration: '2.3s', ttc: 2.1 },
  { id: 'inc-009', ts: '2026-03-23 13:40', intersection: 'Kaplan / Menachem Begin', city: 'Tel Aviv', country: 'IL', type: 'Near-Miss', severity: 'High', users: ['motorcycle','pedestrian'], duration: '3.8s', ttc: 0.9 },
  { id: 'inc-010', ts: '2026-03-23 14:17', intersection: 'Ayalon / HaShalom', city: 'Tel Aviv', country: 'IL', type: 'Red-Light', severity: 'Medium', users: ['car','car'], duration: '2.9s', ttc: 1.5 },
  { id: 'inc-011', ts: '2026-03-23 15:02', intersection: 'Begin Rd / Ibn Gvirol', city: 'Tel Aviv', country: 'IL', type: 'Alert-Only', severity: 'Low', users: ['cyclist','pedestrian'], duration: '0.7s', ttc: 5.1 },
  { id: 'inc-012', ts: '2026-03-23 07:38', intersection: 'Anna Salai / Nungambakkam', city: 'Chennai', country: 'IN', type: 'Near-Miss', severity: 'High', users: ['motorcycle','pedestrian','pedestrian'], duration: '2.4s', ttc: 0.7 },
  { id: 'inc-013', ts: '2026-03-23 08:02', intersection: 'Velachery / OMR Junction', city: 'Chennai', country: 'IN', type: 'Mixed Traffic', severity: 'High', users: ['motorcycle','motorcycle','car'], duration: '3.1s', ttc: 1.0 },
  { id: 'inc-014', ts: '2026-03-23 08:29', intersection: 'IIT Madras / Sardar Patel Rd', city: 'Chennai', country: 'IN', type: 'Alert-Only', severity: 'Low', users: ['motorcycle','cyclist'], duration: '1.1s', ttc: 3.2 },
  { id: 'inc-015', ts: '2026-03-23 09:11', intersection: 'Anna Salai / Nungambakkam', city: 'Chennai', country: 'IN', type: 'Near-Miss', severity: 'High', users: ['car','motorcycle','pedestrian'], duration: '2.8s', ttc: 0.6 },
  { id: 'inc-016', ts: '2026-03-23 09:44', intersection: 'Velachery / OMR Junction', city: 'Chennai', country: 'IN', type: 'Mixed Traffic', severity: 'Medium', users: ['motorcycle','motorcycle','motorcycle'], duration: '1.9s', ttc: 1.8 },
  { id: 'inc-017', ts: '2026-03-23 10:30', intersection: 'IIT Madras / Sardar Patel Rd', city: 'Chennai', country: 'IN', type: 'Speed Warning', severity: 'Medium', users: ['car','pedestrian'], duration: '2.2s', ttc: 2.3 },
  { id: 'inc-018', ts: '2026-03-23 11:15', intersection: 'Anna Salai / Nungambakkam', city: 'Chennai', country: 'IN', type: 'Near-Miss', severity: 'High', users: ['motorcycle','car'], duration: '3.4s', ttc: 0.8 },
  { id: 'inc-019', ts: '2026-03-23 12:00', intersection: 'Velachery / OMR Junction', city: 'Chennai', country: 'IN', type: 'Mixed Traffic', severity: 'High', users: ['motorcycle','pedestrian','pedestrian','motorcycle'], duration: '4.2s', ttc: 0.4 },
  { id: 'inc-020', ts: '2026-03-23 13:22', intersection: 'IIT Madras / Sardar Patel Rd', city: 'Chennai', country: 'IN', type: 'Alert-Only', severity: 'Low', users: ['car','cyclist'], duration: '0.8s', ttc: 4.7 },
  { id: 'inc-021', ts: '2026-03-23 14:45', intersection: 'Anna Salai / Nungambakkam', city: 'Chennai', country: 'IN', type: 'Red-Light', severity: 'High', users: ['motorcycle','pedestrian'], duration: '3.7s', ttc: 0.3 },
  { id: 'inc-022', ts: '2026-03-23 15:30', intersection: 'Velachery / OMR Junction', city: 'Chennai', country: 'IN', type: 'Mixed Traffic', severity: 'Medium', users: ['car','motorcycle','motorcycle'], duration: '2.6s', ttc: 1.4 },
]

// ─── KPI Helpers ──────────────────────────────────────────────────────────────

function randBetween(a, b) { return Math.round(a + Math.random() * (b - a)) }
function randFloat(a, b, decimals = 1) {
  return parseFloat((a + Math.random() * (b - a)).toFixed(decimals))
}

function makeKpis(country) {
  return {
    activeRsus:    country === 'IL' ? `${randBetween(17,20)} / 20` : `${randBetween(16,19)} / 20`,
    scesToday:     country === 'IL' ? randBetween(18, 28) : randBetween(28, 44),
    scesYesterday: country === 'IL' ? 23 : 35,
    activeRuus:    country === 'IL' ? randBetween(340, 420) : randBetween(180, 260),
    alertsLastHr:  country === 'IL' ? randBetween(4, 9)    : randBetween(7, 14),
  }
}

// ─── Analytics Data ───────────────────────────────────────────────────────────

export function makeSceWeeklyData(country, intersections) {
  const weeks = ['W16','W17','W18','W19','W20','W21','W22','W23']
  return weeks.map((w, i) => {
    const base = country === 'IL' ? 3.2 - i * 0.28 : 4.8 - i * 0.38
    const row = { week: w }
    intersections.forEach(ix => {
      row[ix.name] = randFloat(base - 0.3, base + 0.3)
    })
    return row
  })
}

export function makeRoadUserBreakdown(country) {
  if (country === 'IN') {
    return [
      { name: 'Motorcycles', value: 38, fill: '#F39C12' },
      { name: 'Cars',        value: 31, fill: '#2E86C1' },
      { name: 'Pedestrians', value: 24, fill: '#E67E22' },
      { name: 'Cyclists',    value: 7,  fill: '#27AE60' },
    ]
  }
  return [
    { name: 'Cars',        value: 48, fill: '#2E86C1' },
    { name: 'Motorcycles', value: 22, fill: '#F39C12' },
    { name: 'Pedestrians', value: 19, fill: '#E67E22' },
    { name: 'Cyclists',    value: 11, fill: '#27AE60' },
  ]
}

export const COMPARISON_DATA = [
  { metric: 'Avg SCE Rate',        IL: 1.4,  IN: 2.8 },
  { metric: 'Alert Response (s)',  IL: 1.8,  IN: 2.4 },
  { metric: 'RUU Penetration (%)', IL: 24.7, IN: 17.6 },
]

export function makeHeatmapData() {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  return days.map(day => ({
    day,
    hours: Array.from({ length: 24 }, (_, h) => {
      const rushAM  = h >= 7  && h <= 9
      const rushPM  = h >= 16 && h <= 19
      const weekend = day === 'Sat' || day === 'Sun'
      let base = rushAM ? 7 : rushPM ? 8 : 2
      if (weekend) base = Math.max(1, base - 3)
      return Math.min(10, Math.max(0, base + Math.round((Math.random() - 0.5) * 2)))
    }),
  }))
}

// ─── Alert Generation ─────────────────────────────────────────────────────────

const ALERT_TYPES = ['Near-Miss', 'Speed Warning', 'Red-Light', 'Mixed Traffic']

function makeAlert(intersections) {
  const ix   = intersections[Math.floor(Math.random() * intersections.length)]
  const type = ALERT_TYPES[Math.floor(Math.random() * ALERT_TYPES.length)]
  const sev  = Math.random() > 0.5 ? 'High' : 'Medium'
  return {
    id:             `alert-${Date.now()}`,
    ts:             new Date().toLocaleTimeString('en-US', { hour12: false }),
    intersection:   ix.name,
    intersectionId: ix.id,
    city:           ix.city,
    type,
    severity: sev,
  }
}

// ─── useSimulation Hook ───────────────────────────────────────────────────────

export function useSimulation() {
  const [country, setCountry] = useState('IL')

  const baseIntersections = country === 'IL' ? IL_INTERSECTIONS : IN_INTERSECTIONS
  const baseRsus          = country === 'IL' ? INITIAL_IL_RSUS  : INITIAL_IN_RSUS

  const [intersections, setIntersections] = useState(() => baseIntersections.map(i => ({ ...i })))
  const [rsus, setRsus]                   = useState(() => baseRsus.map(r => ({ ...r })))
  const [kpis, setKpis]                   = useState(() => makeKpis('IL'))
  const [activeAlert, setActiveAlert]     = useState(null)
  const [selectedId, setSelectedId]       = useState(baseIntersections[0].id)

  const alertTimerRef = useRef(null)
  const kpiTimerRef   = useRef(null)
  const rsuTimerRef   = useRef(null)

  // Reset all state when country changes
  useEffect(() => {
    const ix = country === 'IL' ? IL_INTERSECTIONS : IN_INTERSECTIONS
    const ru = country === 'IL' ? INITIAL_IL_RSUS  : INITIAL_IN_RSUS
    setIntersections(ix.map(i => ({ ...i })))
    setRsus(ru.map(r => ({ ...r })))
    setKpis(makeKpis(country))
    setSelectedId(ix[0].id)
    setActiveAlert(null)
  }, [country])

  // 15s KPI + metrics update
  useEffect(() => {
    kpiTimerRef.current = setInterval(() => {
      setKpis(makeKpis(country))
      setIntersections(prev => prev.map(ix => {
        const ranges = country === 'IL'
          ? { volume: [180, 340], speed: [38, 55], sce: [0.8, 3.2], fa: [2, 8], ruu: [18, 34] }
          : { volume: [200, 480], speed: [22, 40], sce: [1.8, 4.5], fa: [4, 12], ruu: [12, 26] }
        return {
          ...ix,
          metrics: {
            volume:         randBetween(ranges.volume[0], ranges.volume[1]),
            speed:          randFloat(ranges.speed[0],   ranges.speed[1]),
            sceRate:        randFloat(ranges.sce[0],     ranges.sce[1]),
            falseAlarmRate: randFloat(ranges.fa[0],      ranges.fa[1]),
            ruuPenetration: randFloat(ranges.ruu[0],     ranges.ruu[1]),
          },
        }
      }))
    }, 15000)
    return () => clearInterval(kpiTimerRef.current)
  }, [country])

  // 30s RSU ping fluctuation
  useEffect(() => {
    rsuTimerRef.current = setInterval(() => {
      setRsus(prev => prev.map(rsu => {
        if (rsu.status === 'offline' || rsu.status === 'standby') return rsu
        return {
          ...rsu,
          uptime:   parseFloat(Math.min(99.9, (rsu.uptime || 98) + (Math.random() - 0.5) * 0.1).toFixed(1)),
          lastPing: `${Math.floor(Math.random() * 25) + 2}s ago`,
          signal:   rsu.signal != null ? rsu.signal + Math.round((Math.random() - 0.5) * 4) : null,
        }
      }))
    }, 30000)
    return () => clearInterval(rsuTimerRef.current)
  }, [])

  // 45s alert generation
  useEffect(() => {
    const trigger = () => {
      const ix    = country === 'IL' ? IL_INTERSECTIONS : IN_INTERSECTIONS
      const alert = makeAlert(ix)
      setActiveAlert(alert)
      setIntersections(prev => prev.map(i =>
        i.id === alert.intersectionId ? { ...i, status: 'alert' } : i
      ))
      setTimeout(() => {
        setActiveAlert(null)
        setIntersections(prev => prev.map(i =>
          i.id === alert.intersectionId ? { ...i, status: 'warning' } : i
        ))
      }, ALERT_DISPLAY_MS)
    }
    alertTimerRef.current = setInterval(trigger, 45000)
    return () => clearInterval(alertTimerRef.current)
  }, [country])

  const selectedIntersection = intersections.find(i => i.id === selectedId) || intersections[0]
  const filteredIncidents    = ALL_INCIDENTS.filter(inc => inc.country === country)

  return {
    country,
    setCountry,
    intersections,
    rsus,
    kpis,
    activeAlert,
    selectedIntersection,
    setSelectedId,
    incidents:         filteredIncidents,
    allIncidents:      ALL_INCIDENTS,
    sceWeeklyData:     makeSceWeeklyData(country, intersections),
    roadUserBreakdown: makeRoadUserBreakdown(country),
    heatmapData:       makeHeatmapData(),
  }
}
