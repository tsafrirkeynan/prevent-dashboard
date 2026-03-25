import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'

const STATUS_COLOR = {
  normal:  '#27AE60',
  warning: '#F39C12',
  alert:   '#C0392B',
  offline: '#C0392B',
}

function createMarkerIcon(color, flash) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:18px;height:18px;border-radius:50%;
      background:${color};
      border:2px solid rgba(255,255,255,0.8);
      box-shadow:0 0 ${flash ? '12px 4px' : '6px 2px'} ${color};
      ${flash ? 'animation:markerPulse 0.6s ease-in-out infinite alternate;' : ''}
    "></div>
    <style>@keyframes markerPulse{to{transform:scale(1.4);opacity:0.6}}</style>`,
    iconSize:   [18, 18],
    iconAnchor: [9, 9],
  })
}

function Markers({ intersections, selectedId, onSelect, alertId }) {
  const map = useMap()
  const markersRef = useRef({})

  useEffect(() => {
    Object.values(markersRef.current).forEach(m => m.remove())
    markersRef.current = {}

    intersections.forEach(ix => {
      const isAlert = ix.id === alertId || ix.status === 'alert'
      const color   = STATUS_COLOR[isAlert ? 'alert' : ix.status] || STATUS_COLOR.normal
      const icon    = createMarkerIcon(color, isAlert)
      const marker  = L.marker([ix.lat, ix.lng], { icon })
      marker.bindTooltip(ix.name, {
        permanent: false,
        direction: 'top',
        className: 'leaflet-tooltip-dark',
      })
      marker.on('click', () => onSelect(ix.id))
      marker.addTo(map)
      markersRef.current[ix.id] = marker
    })
  }, [intersections, alertId, selectedId])

  return null
}

function MapBounds({ intersections }) {
  const map = useMap()
  const prevCountryRef = useRef(null)

  useEffect(() => {
    const country = intersections[0]?.country
    if (country && country !== prevCountryRef.current && intersections.length > 0) {
      prevCountryRef.current = country
      const bounds = L.latLngBounds(intersections.map(i => [i.lat, i.lng]))
      map.fitBounds(bounds, { padding: [40, 40] })
    }
  }, [intersections])

  return null
}

export default function IntersectionMap({ intersections, selectedId, onSelect, alertId }) {
  const center = intersections[0] ? [intersections[0].lat, intersections[0].lng] : [32.07, 34.79]

  return (
    <div
      className="relative h-full rounded-xl overflow-hidden"
      style={{ border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <MapContainer
        center={center}
        zoom={14}
        style={{ height: '100%', width: '100%', background: '#0F1923' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={19}
        />
        <Markers
          intersections={intersections}
          selectedId={selectedId}
          onSelect={onSelect}
          alertId={alertId}
        />
        <MapBounds intersections={intersections} />
      </MapContainer>

      {/* Legend */}
      <div
        className="absolute bottom-3 left-3 px-3 py-2 rounded-lg text-xs flex gap-3 z-[1000]"
        style={{ background: 'rgba(22,36,51,0.92)' }}
      >
        {[['#27AE60','Normal'],['#F39C12','Warning'],['#C0392B','Alert']].map(([c, l]) => (
          <div key={l} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
            <span className="text-ts">{l}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
