import { useState } from 'react'
import type { FC } from 'react'

interface PricePoint {
  month: string
  rate: number
}

interface PriceSparklineProps {
  data: PricePoint[]
  stabilityScore: number
  unit?: string
  color?: string
}

export const PriceSparkline: FC<PriceSparklineProps> = ({
  data,
  stabilityScore,
  unit = '',
  color = '#2575fc'
}) => {
  const [activePoint, setActivePoint] = useState<PricePoint | null>(null)

  if (!data || data.length === 0) return null

  const rates = data.map((d) => d.rate)
  const minRate = Math.min(...rates)
  const maxRate = Math.max(...rates)
  const range = maxRate - minRate || 1

  // SVG dimensions
  const width = 140
  const height = 36
  const paddingX = 8
  const paddingY = 6

  // Calculate coordinates
  const points = data.map((d, index) => {
    const x = paddingX + (index / (data.length - 1)) * (width - paddingX * 2)
    // Invert Y axis
    const y =
      height -
      paddingY -
      ((d.rate - minRate) / range) * (height - paddingY * 2)
    return { x, y, data: d }
  })

  // Build SVG path
  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`
  }, '')

  // Build SVG area fill path
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`

  return (
    <div className="flex flex-col space-y-1.5 w-full">
      {/* Stability Badge & Current Hovered Metric */}
      <div className="flex items-center justify-between text-[10px] font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2575fc] animate-pulse" />
          <span className="text-[#0F172A] font-semibold tracking-wider">
            {stabilityScore}% STABLE
          </span>
        </div>

        <div className="text-[10px] text-slate-500 font-mono">
          {activePoint ? (
            <span className="font-semibold text-[#0F172A]">
              {activePoint.month}: ₹{activePoint.rate}{unit ? ` ${unit}` : ''}
            </span>
          ) : (
            <span>5-Mo Trend</span>
          )}
        </div>
      </div>

      {/* SVG Sparkline Container */}
      <div className="relative w-full h-[36px] bg-sky-50/50 border border-slate-200 rounded-md overflow-hidden px-1">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={`grad-${stabilityScore}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <path d={areaD} fill={`url(#grad-${stabilityScore})`} />

          {/* Sparkline curve */}
          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive touch/hover points */}
          {points.map((pt, idx) => (
            <circle
              key={idx}
              cx={pt.x}
              cy={pt.y}
              r={activePoint?.month === pt.data.month ? 3.5 : 2}
              fill={activePoint?.month === pt.data.month ? '#2575fc' : '#FFFFFF'}
              stroke="#2575fc"
              strokeWidth="1.5"
              className="cursor-pointer transition-all duration-150"
              onMouseEnter={() => setActivePoint(pt.data)}
              onMouseLeave={() => setActivePoint(null)}
            />
          ))}
        </svg>
      </div>
    </div>
  )
}
