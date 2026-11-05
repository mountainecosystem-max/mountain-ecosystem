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
  color = '#285A40'
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
          <span className="w-1.5 h-1.5 rounded-full bg-[#285A40] animate-pulse" />
          <span className="text-[#123D2D] font-semibold tracking-wider">
            {stabilityScore}% STABLE
          </span>
        </div>

        <div className="text-[10px] text-[#576159] font-mono">
          {activePoint ? (
            <span className="font-semibold text-[#123D2D]">
              {activePoint.month}: ₹{activePoint.rate}{unit ? ` ${unit}` : ''}
            </span>
          ) : (
            <span>5-Mo Trend</span>
          )}
        </div>
      </div>

      {/* SVG Sparkline Container */}
      <div className="relative w-full h-[36px] bg-[#E8EFE3]/50 border border-[#CBDAC4]/60 rounded-sm overflow-hidden px-1">
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

          {/* Data point dots */}
          {points.map((pt, i) => {
            const isHovered = activePoint?.month === pt.data.month
            const isLatest = i === points.length - 1
            return (
              <circle
                key={pt.data.month}
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? 3.5 : isLatest ? 2.5 : 1.75}
                fill={isHovered ? '#123D2D' : color}
                stroke="#FFFFFF"
                strokeWidth={isHovered ? 1.5 : 1}
                className="transition-all duration-150 cursor-pointer"
                onMouseEnter={() => setActivePoint(pt.data)}
                onMouseLeave={() => setActivePoint(null)}
              />
            )
          })}
        </svg>
      </div>

      {/* Month Markers Row */}
      <div className="flex items-center justify-between text-[8px] font-mono uppercase tracking-wider text-[#576159] px-0.5">
        {data.map((d) => (
          <span
            key={d.month}
            className={`transition-colors ${
              activePoint?.month === d.month ? 'text-[#123D2D] font-bold' : ''
            }`}
          >
            {d.month}
          </span>
        ))}
      </div>
    </div>
  )
}
