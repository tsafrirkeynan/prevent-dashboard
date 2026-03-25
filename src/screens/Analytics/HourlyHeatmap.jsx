const CELL_W = 22
const CELL_H = 20
const LABEL_W = 32
const LABEL_H = 16

function cellColor(value) {
  if (value <= 1) return '#162433'
  if (value <= 3) return '#1F5C99'
  if (value <= 5) return '#2E86C1'
  if (value <= 7) return '#F39C12'
  return '#C0392B'
}

export default function HourlyHeatmap({ data }) {
  if (!data) return null
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))

  return (
    <div
      className="rounded-xl p-4 h-full flex flex-col"
      style={{ background: '#162433', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="mb-3">
        <div className="text-tp text-sm font-semibold">SCE Hourly Heatmap</div>
        <div className="text-ts text-xs">Frequency by hour and day of week</div>
      </div>
      <div className="flex-1 overflow-auto" style={{ minHeight: 0 }}>
        <svg
          width={LABEL_W + hours.length * CELL_W + 10}
          height={LABEL_H + data.length * CELL_H + 30}
        >
          {/* Hour labels */}
          {hours.map((h, i) => (
            i % 3 === 0 && (
              <text
                key={`hl-${h}`}
                x={LABEL_W + i * CELL_W + CELL_W / 2}
                y={LABEL_H - 2}
                textAnchor="middle"
                fill="#8FAFC7"
                fontSize={8}
              >
                {h}
              </text>
            )
          ))}

          {/* Day rows */}
          {data.map((row, di) => (
            <g key={`row-${row.day}`}>
              <text
                x={LABEL_W - 4}
                y={LABEL_H + di * CELL_H + CELL_H / 2 + 4}
                textAnchor="end"
                fill="#8FAFC7"
                fontSize={9}
              >
                {row.day}
              </text>
              {row.hours.map((val, hi) => (
                <rect
                  key={`cell-${di}-${hi}`}
                  x={LABEL_W + hi * CELL_W + 1}
                  y={LABEL_H + di * CELL_H + 1}
                  width={CELL_W - 2}
                  height={CELL_H - 2}
                  rx={2}
                  fill={cellColor(val)}
                />
              ))}
            </g>
          ))}

          {/* Legend */}
          {[[1,'Low'],[4,'Med'],[8,'High']].map(([v, lbl], i) => (
            <g key={`leg-${lbl}`}>
              <rect
                x={LABEL_W + i * 50}
                y={LABEL_H + data.length * CELL_H + 6}
                width={14} height={10} rx={2}
                fill={cellColor(v)}
              />
              <text
                x={LABEL_W + i * 50 + 18}
                y={LABEL_H + data.length * CELL_H + 15}
                fill="#8FAFC7"
                fontSize={8}
              >
                {lbl}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}
