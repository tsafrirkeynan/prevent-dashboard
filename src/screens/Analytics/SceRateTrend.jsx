import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#2E86C1', '#27AE60', '#F39C12']

const TOOLTIP_STYLE = {
  contentStyle: { background: '#162433', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#E8F0F7' },
  labelStyle:   { color: '#8FAFC7', fontSize: 11 },
}

export default function SceRateTrend({ data, intersections }) {
  if (!data || !intersections || intersections.length === 0) return null
  const keys = intersections.map(i => i.name)

  return (
    <div
      className="rounded-xl p-4 h-full flex flex-col"
      style={{ background: '#162433', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="mb-3">
        <div className="text-tp text-sm font-semibold">SCE Rate Trend</div>
        <div className="text-ts text-xs">Last 8 weeks · per 100 vehicles</div>
      </div>
      <div className="flex-1" style={{ minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="week" tick={{ fill: '#8FAFC7', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#8FAFC7', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip {...TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ fontSize: 11, color: '#8FAFC7' }} />
            {keys.map((k, i) => (
              <Line
                key={k}
                type="monotone"
                dataKey={k}
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
