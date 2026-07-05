import { useEffect, useState, useRef } from 'react'

export default function ProgressRing({ percentage, label, color = '#00F5FF', size = 120 }) {
  const [offset, setOffset] = useState(0)
  const ref = useRef(null)
  const counted = useRef(false)

  const radius = size * 0.4
  const circumference = 2 * Math.PI * radius

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true
          const startTime = Date.now()
          const duration = 1500
          const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setOffset(circumference - (eased * percentage / 100) * circumference)
            if (progress < 1) requestAnimationFrame(animate)
          }
          animate()
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [percentage, circumference])

  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="6"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.1s ease-out' }}
        />
      </svg>
      <span className="text-2xl font-bold text-white">{percentage}%</span>
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  )
}
