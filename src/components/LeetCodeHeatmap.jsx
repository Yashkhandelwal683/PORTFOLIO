import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', '']

const LEVELS = [
  { level: 0, color: '#1a1a2e', label: 'No submissions' },
  { level: 1, color: '#0e4429', label: '1-2 submissions' },
  { level: 2, color: '#006d32', label: '3-5 submissions' },
  { level: 3, color: '#26a641', label: '6-9 submissions' },
  { level: 4, color: '#39d353', label: '10+ submissions' },
]

const FUTURE_COLOR = '#0d1117'
const DIFFICULTY_COLORS = { Easy: '#00B8A3', Medium: '#FFA116', Hard: '#FF375F' }
const STATUS_COLORS = { Accepted: '#00B8A3', 'Wrong Answer': '#FF375F', 'Time Limit Exceeded': '#FFA116' }
const LEETCODE_BASE = 'https://alfa-leetcode-api.onrender.com'

function getLevel(count) {
  if (count === 0) return 0
  if (count <= 2) return 1
  if (count <= 5) return 2
  if (count <= 9) return 3
  return 4
}

function formatTime(ts) {
  const d = new Date(parseInt(ts) * 1000)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })
}

function Skeleton() {
  return (
    <div className="w-full animate-pulse p-6 md:p-8" style={{
      background: 'rgba(255,255,255,0.03)',
      backdropFilter: 'blur(16px)',
      borderRadius: '20px',
      border: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div className="h-5 w-48 bg-white/5 rounded mb-6" />
      <div className="flex gap-1.5 mb-6">
        <div className="flex flex-col gap-1">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="w-[14px] h-[14px] rounded-sm" style={{ background: 'rgba(255,255,255,0.05)' }} />
          ))}
        </div>
        {[...Array(53)].map((_, i) => (
          <div key={i} className="flex flex-col gap-1">
            {[...Array(7)].map((_, j) => (
              <div key={j} className="w-[14px] h-[14px] rounded-sm" style={{ background: 'rgba(255,255,255,0.05)' }} />
            ))}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-6 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-14 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }} />
        ))}
      </div>
    </div>
  )
}

function ErrorState({ onRetry, message }) {
  return (
    <div className="w-full p-8 text-center flex flex-col items-center justify-center" style={{
      background: 'rgba(255,255,255,0.03)',
      backdropFilter: 'blur(16px)',
      borderRadius: '20px',
      border: '1px solid rgba(255,255,255,0.06)',
      minHeight: '200px',
    }}>
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFA116]/20 to-[#FFA116]/5 flex items-center justify-center mx-auto mb-3">
        <svg className="w-6 h-6 text-[#FFA116]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p style={{ color: '#9ca3af' }} className="text-sm mb-3">{message || 'Unable to load LeetCode heatmap'}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-full text-xs font-medium transition-all"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#9ca3af',
          }}
        >
          Retry
        </button>
      )}
    </div>
  )
}

const Cell = React.memo(function Cell({ day, isFuture, isToday, isSelected, onClick, onHover, size, CELL, GAP }) {
  const bgColor = isFuture ? FUTURE_COLOR : LEVELS[day.level]?.color || LEVELS[0].color
  return (
    <motion.div
      onClick={() => { if (!isFuture) onClick(day) }}
      onMouseEnter={(e) => { if (!isFuture) onHover(e, day) }}
      onMouseLeave={() => onHover(null, null)}
      className={isFuture ? '' : 'cursor-pointer'}
      style={{
        width: size,
        height: size,
        borderRadius: '3px',
        backgroundColor: bgColor,
        border: isSelected
          ? '2px solid #ffffff'
          : isToday
            ? '2px solid rgba(0, 245, 255, 0.7)'
            : '2px solid transparent',
        boxShadow: isToday
          ? '0 0 12px rgba(0, 245, 255, 0.4), inset 0 0 8px rgba(0, 245, 255, 0.1)'
          : '0 0 0 transparent',
        opacity: isFuture ? 0.2 : 1,
      }}
      whileHover={!isFuture ? {
        scale: 1.65,
        zIndex: 10,
        transition: { type: 'spring', stiffness: 400, damping: 15 },
      } : {}}
      onHoverStart={!isFuture ? (e) => {
        e.currentTarget.style.boxShadow = day.count > 0
          ? `0 0 16px ${bgColor}80, 0 4px 12px rgba(0, 0, 0, 0.3)`
          : '0 4px 12px rgba(0, 0, 0, 0.2)'
      } : undefined}
      onHoverEnd={!isFuture ? (e) => {
        e.currentTarget.style.boxShadow = isToday ? '0 0 12px rgba(0, 245, 255, 0.4)' : '0 0 0 transparent'
      } : undefined}
    />
  )
})

export default function LeetCodeHeatmap({ username, stats: propStats, calData: propCalData, year: propYear, onYearChange }) {
  const [calData, setCalData] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [problemDetails, setProblemDetails] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedDay, setSelectedDay] = useState(null)
  const [hoveredDay, setHoveredDay] = useState(null)
  const [hoverPos, setHoverPos] = useState(null)
  const [selectedYear, setSelectedYear] = useState(propYear || new Date().getFullYear())
  const [activeYears, setActiveYears] = useState([])
  const gridRef = useRef(null)
  const containerRef = useRef(null)
  const initialLoadDone = useRef(false)

  const year = propYear || selectedYear
  const resolvedCalData = propCalData || calData

  const CELL = 14
  const GAP = 3

  const prevYearRef = useRef(year)
  const propCalKey = propCalData?.submissionCalendar
  const prevPropCalKeyRef = useRef(propCalKey)

  useEffect(() => {
    if (!username) return

    const yearChanged = prevYearRef.current !== year
    const calKeyChanged = propCalKey !== prevPropCalKeyRef.current
    prevYearRef.current = year
    prevPropCalKeyRef.current = propCalKey

    if (yearChanged || calKeyChanged) {
      initialLoadDone.current = false
    }

    if (initialLoadDone.current) return

    let cancelled = false

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(false)

        const calOk = propCalData && !yearChanged
        const calPromise = calOk
          ? Promise.resolve(null)
          : fetch(`${LEETCODE_BASE}/${username}/calendar?year=${year}`)

        const subPromise = fetch(`${LEETCODE_BASE}/${username}/submission?limit=20`)

        const [calResult, subRes] = await Promise.all([calPromise, subPromise])
        if (!subRes.ok) throw new Error('API error')
        if (!calOk && calResult && !calResult.ok) throw new Error('API error')

        const subs = await subRes.json()
        if (cancelled) return

        if (!calOk && calResult) {
          const cal = await calResult.json()
          if (cancelled) return
          if (cal.activeYears) setActiveYears(cal.activeYears)
          setCalData(cal)
        } else if (propCalData?.activeYears) {
          setActiveYears(propCalData.activeYears)
        }

        setSubmissions(subs.submission || [])

        const slugs = [...new Set((subs.submission || []).map(s => s.titleSlug))]
        const details = {}
        for (let i = 0; i < slugs.length; i += 5) {
          const batch = await Promise.allSettled(
            slugs.slice(i, i + 5).map(s =>
              fetch(`${LEETCODE_BASE}/select?titleSlug=${s}`).then(r => r.json())
            )
          )
          batch.forEach((r, idx) => {
            if (r.status === 'fulfilled' && r.value?.difficulty) {
              details[slugs[i + idx]] = { difficulty: r.value.difficulty }
            }
          })
        }
        if (!cancelled) setProblemDetails(details)
        initialLoadDone.current = true
      } catch {
        if (!cancelled) setError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()
    const id = setInterval(fetchData, 120000)
    return () => { cancelled = true; clearInterval(id) }
  }, [username, propCalData, year, propCalKey])

  const submissionMap = useMemo(() => {
    if (!resolvedCalData?.submissionCalendar) return new Map()
    try {
      const cal = JSON.parse(resolvedCalData.submissionCalendar)
      const map = new Map()
      Object.entries(cal).forEach(([ts, count]) => {
        const d = new Date(parseInt(ts) * 1000)
        map.set(d.toISOString().split('T')[0], Number(count))
      })
      return map
    } catch {
      return new Map()
    }
  }, [resolvedCalData])

  const submissionsByDate = useMemo(() => {
    const map = new Map()
    submissions.forEach(s => {
      const d = new Date(parseInt(s.timestamp) * 1000)
      const key = d.toISOString().split('T')[0]
      if (!map.has(key)) map.set(key, [])
      map.get(key).push({
        title: s.title,
        titleSlug: s.titleSlug,
        timestamp: s.timestamp,
        statusDisplay: s.statusDisplay,
        lang: s.lang,
        difficulty: problemDetails[s.titleSlug]?.difficulty || null,
        link: `https://leetcode.com/problems/${s.titleSlug}/`,
        time: formatTime(s.timestamp),
      })
    })
    return map
  }, [submissions, problemDetails])

  const todayKey = useMemo(() => new Date().toISOString().split('T')[0], [])

  const yearDays = useMemo(() => {
    const days = []
    for (let m = 0; m < 12; m++) {
      const daysInMonth = new Date(Date.UTC(year, m + 1, 0)).getUTCDate()
      for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(Date.UTC(year, m, d))
        const key = date.toISOString().split('T')[0]
        const rawCount = submissionMap.get(key)
        const count = rawCount !== undefined ? rawCount : 0
        const isFuture = key > todayKey
        days.push({
          date,
          key,
          count,
          isFuture,
          isToday: key === todayKey,
          level: isFuture ? 0 : getLevel(count),
          month: m,
          dayOfMonth: d,
          dayOfWeek: date.getUTCDay(),
        })
      }
    }
    return days
  }, [submissionMap, todayKey, year])

  const weeks = useMemo(() => {
    if (yearDays.length === 0) return []
    const padStart = yearDays[0].dayOfWeek
    const allCells = []
    for (let i = 0; i < padStart; i++) allCells.push(null)
    yearDays.forEach(d => allCells.push(d))
    const rem = allCells.length % 7
    if (rem > 0) for (let i = 0; i < 7 - rem; i++) allCells.push(null)
    const grouped = []
    for (let i = 0; i < allCells.length; i += 7) {
      grouped.push(allCells.slice(i, i + 7))
    }
    return grouped
  }, [yearDays])

  const monthLabels = useMemo(() => {
    if (weeks.length === 0) return []
    const labels = []
    let lastMonth = -1
    weeks.forEach((week, wi) => {
      const first = week.find(d => d !== null)
      if (first && first.month !== lastMonth) {
        lastMonth = first.month
        labels.push({ index: wi, label: MONTHS[lastMonth], width: 1 })
      }
    })
    for (let i = 0; i < labels.length - 1; i++) {
      labels[i].width = labels[i + 1].index - labels[i].index
    }
    if (labels.length > 0) {
      labels[labels.length - 1].width = Math.max(1, weeks.length - labels[labels.length - 1].index)
    }
    return labels
  }, [weeks])

  const activeDaysCount = useMemo(() => {
    return yearDays.filter(d => !d.isFuture && d.count > 0).length
  }, [yearDays])

  const handleCellClick = useCallback((day) => {
    if (!day || day.isFuture) return
    setSelectedDay(day)
  }, [])

  const TOOLTIP_W = 320
  const TOOLTIP_H = 200

  const handleCellHover = useCallback((e, day) => {
    if (!day) {
      setHoveredDay(null)
      setHoverPos(null)
      return
    }
    const rect = e.currentTarget.getBoundingClientRect()
    const viewportW = window.innerWidth
    let left = rect.left + rect.width / 2

    if (left + TOOLTIP_W / 2 > viewportW - 16) {
      left = viewportW - 16 - TOOLTIP_W / 2
    }
    if (left - TOOLTIP_W / 2 < 16) {
      left = 16 + TOOLTIP_W / 2
    }

    const spaceAbove = rect.top
    const spaceBelow = window.innerHeight - rect.bottom
    const below = spaceAbove < TOOLTIP_H + 16 && spaceBelow > spaceAbove
    const top = below ? rect.bottom + 8 : rect.top

    const daySubs = submissionsByDate.get(day.key) || []
    const accepted = daySubs.filter(s => s.statusDisplay === 'Accepted').length

    setHoverPos({ x: left, y: top, below })
    setHoveredDay({
      ...day,
      dateStr: new Date(day.key + 'T00:00:00Z').toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
      }),
      submissions: daySubs,
      accepted,
    })
  }, [submissionsByDate])

  const handleYearChange = useCallback((newYear) => {
    setSelectedYear(newYear)
    initialLoadDone.current = false
    if (onYearChange) onYearChange(newYear)
  }, [onYearChange])

  const retry = useCallback(() => {
    setError(false)
    setLoading(true)
    initialLoadDone.current = false
  }, [])

  if (loading && !resolvedCalData) return <Skeleton />
  if (error || (weeks.length === 0 && !loading)) {
    return <ErrorState onRetry={retry} message={error ? 'Unable to load LeetCode heatmap' : 'No data available'} />
  }

  const s = propStats || {}

  const statCards = [
    { label: 'Total Solved', value: s.totalSolved, color: '#7B61FF' },
    { label: 'Submissions', value: s.totalSubmissions, color: '#00F5FF' },
    { label: 'Current Streak', value: s.currentStreak, suffix: ' days', color: '#FF6B35' },
    { label: 'Longest Streak', value: s.longestStreak, suffix: ' days', color: '#FF6B35' },
    { label: 'Active Days', value: activeDaysCount, color: '#39d353' },
    { label: 'Acceptance Rate', value: s.acceptanceRate ? `${s.acceptanceRate}%` : 'N/A', color: '#00B8A3' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="w-full"
      style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(16px)',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
      ref={containerRef}
    >
      <div className="p-6 md:p-8 pb-0">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-gradient-to-b from-[#00F5FF] to-[#7B61FF] rounded-full" />
          <h3 className="text-lg font-bold" style={{ color: '#ffffff' }}>
            LeetCode Activity ({year})
          </h3>
          <div className="ml-auto flex items-center gap-2">
            <select
              value={year}
              onChange={(e) => handleYearChange(parseInt(e.target.value))}
              className="text-xs px-2 py-1 rounded-lg cursor-pointer outline-none"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#9ca3af',
              }}
            >
              {(activeYears.length > 0 ? activeYears : [2024, 2025, 2026]).map((y) => (
                <option key={y} value={y} style={{ background: '#1a1a2e', color: '#ffffff' }}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {statCards.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -3, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
              className="p-3 rounded-xl text-center"
              style={{
                background: `linear-gradient(135deg, ${stat.color}10, transparent)`,
                border: `1px solid ${stat.color}20`,
              }}
            >
              <p className="text-xs" style={{ color: '#9ca3af' }}>{stat.label}</p>
              <p className="text-lg font-bold mt-0.5" style={{ color: stat.color }}>
                {stat.value}{stat.suffix || ''}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-4 mb-5 text-xs flex-wrap">
          {['Easy', 'Medium', 'Hard'].map((d) => {
            const count = s.totalSolved && s[d.toLowerCase() + 'Solved']
              ? s[d.toLowerCase() + 'Solved']
              : 0
            const pct = s.totalSolved > 0 ? Math.round((count / s.totalSolved) * 100) : 0
            return (
              <div key={d} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: DIFFICULTY_COLORS[d] }} />
                <span style={{ color: '#9ca3af' }}>{d}:</span>
                <span className="font-semibold" style={{ color: '#ffffff' }}>{count} ({pct}%)</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="px-6 md:px-8">
        <div className="overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }} ref={gridRef}>
          <div style={{ minWidth: `${weeks.length * (CELL + GAP) + 40}px` }}>
            <div className="flex ml-9 mb-1.5 text-[10px]" style={{ color: '#9ca3af' }}>
              {monthLabels.map((m, i) => (
                <span key={i} className="font-medium" style={{ width: `${m.width * (CELL + GAP)}px`, minWidth: `${m.width * (CELL + GAP)}px` }}>
                  {m.label}
                </span>
              ))}
            </div>

            <div className="flex gap-px">
              <div className="flex flex-col mr-1.5 text-[9px]" style={{ color: '#9ca3af', gap: `${GAP}px` }}>
                {DAY_LABELS.map((d, i) => (
                  <span key={i} className="flex items-center leading-none" style={{ height: `${CELL}px` }}>{d}</span>
                ))}
              </div>

              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col" style={{ gap: `${GAP}px` }}>
                  {week.map((day, di) => {
                    if (!day) return <div key={`e-${wi}-${di}`} style={{ width: CELL, height: CELL, borderRadius: '3px' }} />
                    return (
                      <Cell
                        key={day.key}
                        day={day}
                        isFuture={day.isFuture}
                        isToday={day.isToday}
                        isSelected={selectedDay?.key === day.key}
                        onClick={handleCellClick}
                        onHover={handleCellHover}
                        size={CELL}
                        CELL={CELL}
                        GAP={GAP}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2">
            <span className="text-[10px]" style={{ color: '#6b7280' }}>Less</span>
            {LEVELS.map((l) => (
              <div key={l.level} className="rounded-sm" style={{ width: CELL, height: CELL, backgroundColor: l.color, border: '1px solid transparent' }} />
            ))}
            <span className="text-[10px]" style={{ color: '#6b7280' }}>More</span>
          </div>
          <p className="text-[10px]" style={{ color: '#6b7280' }}>{activeDaysCount} active days</p>
        </div>

        <div className="mt-3 pb-1">
          <p className="text-[10px]" style={{ color: '#6b7280' }}>
            Showing activity from Jan 1 to Dec 31, {year}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {hoveredDay && hoverPos && (
          <motion.div
            key={hoveredDay.key}
            initial={{ opacity: 0, y: 4, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.92 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="fixed z-50 pointer-events-none"
            style={{
              left: hoverPos.x,
              top: hoverPos.y,
              transform: hoverPos.below
                ? 'translate(-50%, 0)'
                : 'translate(-50%, calc(-100% - 8px))',
            }}
          >
            <div
              className="overflow-hidden shadow-2xl"
              style={{
                background: 'rgba(10, 10, 30, 0.95)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.08)',
                width: '320px',
                maxWidth: '90vw',
              }}
            >
              <div className="p-4 pb-3" style={{
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                background: `linear-gradient(135deg, ${hoveredDay.count > 0 ? '#39d353' : '#1a1a2e'}15, transparent)`,
              }}>
                <p className="font-semibold text-sm" style={{ color: '#ffffff' }}>{hoveredDay.dateStr}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-lg font-bold" style={{ color: hoveredDay.count > 0 ? '#39d353' : '#6b7280' }}>
                    {hoveredDay.count} submission{hoveredDay.count !== 1 ? 's' : ''}
                  </span>
                  {hoveredDay.submissions.length > 0 && (
                    <span className="text-xs" style={{ color: '#00B8A3' }}>
                      {hoveredDay.accepted} accepted
                    </span>
                  )}
                </div>
              </div>

              {hoveredDay.submissions.length > 0 && (
                <div className="p-3 space-y-1.5 max-h-[280px] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                  {hoveredDay.submissions.map((sub, idx) => (
                    <div
                      key={`${sub.titleSlug}-${sub.timestamp}`}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: `1px solid ${STATUS_COLORS[sub.statusDisplay] || '#6b7280'}15`,
                      }}
                    >
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{
                        background: `${STATUS_COLORS[sub.statusDisplay] || '#6b7280'}20`,
                      }}>
                        {sub.statusDisplay === 'Accepted' ? (
                          <svg className="w-3 h-3" style={{ color: '#00B8A3' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3" style={{ color: '#FF375F' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-medium truncate" style={{ color: '#ffffff' }}>{sub.title}</span>
                          {sub.difficulty && (
                            <span
                              className="text-[9px] font-semibold px-1.5 py-0.5 rounded shrink-0"
                              style={{
                                background: `${DIFFICULTY_COLORS[sub.difficulty]}20`,
                                color: DIFFICULTY_COLORS[sub.difficulty],
                              }}
                            >
                              {sub.difficulty}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[9px]" style={{ color: STATUS_COLORS[sub.statusDisplay] || '#6b7280' }}>
                            {sub.statusDisplay === 'Accepted' ? '✓' : '✗'} Accepted
                          </span>
                          <span className="text-[9px]" style={{ color: '#6b7280' }}>{sub.lang}</span>
                          <span className="text-[9px]" style={{ color: '#6b7280' }}>{sub.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {hoveredDay.count > 0 && hoveredDay.submissions.length === 0 && (
                <div className="p-4 text-center">
                  <p className="text-xs" style={{ color: '#6b7280' }}>No recent submission details available</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.6)' }}
            onClick={() => setSelectedDay(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(24px)',
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 32px 64px rgba(0, 0, 0, 0.4)',
              }}
            >
              <div className="relative p-6 pb-4" style={{
                background: `linear-gradient(135deg, ${selectedDay.count > 0 ? '#39d353' : '#1a1a2e'}20, transparent)`,
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold" style={{ color: '#ffffff' }}>
                    {new Date(selectedDay.key + 'T00:00:00Z').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}
                  </p>
                  <button onClick={() => setSelectedDay(null)} className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <svg className="w-4 h-4" style={{ color: '#9ca3af' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 }}
                  className="flex items-center justify-between p-4 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <span className="text-sm" style={{ color: '#9ca3af' }}>Total Submissions</span>
                  <span className="text-2xl font-bold" style={{ color: selectedDay.count > 0 ? '#39d353' : '#6b7280' }}>
                    {selectedDay.count}
                  </span>
                </motion.div>

                {(() => {
                  const daySubs = submissionsByDate.get(selectedDay.key) || []
                  const accepted = daySubs.filter(s => s.statusDisplay === 'Accepted').length
                  const wrong = daySubs.length - accepted
                  if (daySubs.length > 0) {
                    return (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.08 }}
                        className="flex gap-3"
                      >
                        <div className="flex-1 p-3 rounded-xl text-center" style={{ background: 'rgba(0, 184, 163, 0.08)', border: '1px solid rgba(0, 184, 163, 0.15)' }}>
                          <p className="text-lg font-bold" style={{ color: '#00B8A3' }}>{accepted}</p>
                          <p className="text-[10px]" style={{ color: '#9ca3af' }}>Accepted</p>
                        </div>
                        <div className="flex-1 p-3 rounded-xl text-center" style={{ background: 'rgba(255, 55, 95, 0.08)', border: '1px solid rgba(255, 55, 95, 0.15)' }}>
                          <p className="text-lg font-bold" style={{ color: '#FF375F' }}>{wrong}</p>
                          <p className="text-[10px]" style={{ color: '#9ca3af' }}>Wrong/Other</p>
                        </div>
                      </motion.div>
                    )
                  }
                  return null
                })()}

                {selectedDay.count > 0 && !submissionsByDate.get(selectedDay.key) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="p-4 rounded-xl text-center"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <p className="text-xs" style={{ color: '#6b7280' }}>No recent submission details available for this date</p>
                  </motion.div>
                )}

                {selectedDay.count === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="p-4 rounded-xl text-center"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <p className="text-sm" style={{ color: '#6b7280' }}>No submissions on this day.</p>
                  </motion.div>
                )}

                {(() => {
                  const daySubs = submissionsByDate.get(selectedDay.key)
                  if (daySubs && daySubs.length > 0) {
                    return (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.12 }}
                      >
                        <p className="text-xs font-medium mb-2" style={{ color: '#9ca3af' }}>Questions</p>
                        <div className="space-y-2">
                          {daySubs.map((sub, idx) => (
                            <motion.a
                              key={`${sub.titleSlug}-${sub.timestamp}`}
                              href={sub.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.12 + idx * 0.03 }}
                              className="flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.02]"
                              style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: `1px solid ${STATUS_COLORS[sub.statusDisplay] || '#6b7280'}20`,
                              }}
                            >
                              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{
                                background: `${STATUS_COLORS[sub.statusDisplay] || '#6b7280'}20`,
                              }}>
                                {sub.statusDisplay === 'Accepted' ? (
                                  <svg className="w-3.5 h-3.5" style={{ color: '#00B8A3' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : (
                                  <svg className="w-3.5 h-3.5" style={{ color: '#FF375F' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate" style={{ color: '#ffffff' }}>{sub.title}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  {sub.difficulty && (
                                    <span className="text-[10px] font-medium" style={{ color: DIFFICULTY_COLORS[sub.difficulty] || '#9ca3af' }}>
                                      {sub.difficulty}
                                    </span>
                                  )}
                                  <span className="text-[10px]" style={{ color: STATUS_COLORS[sub.statusDisplay] || '#9ca3af' }}>
                                    {sub.statusDisplay}
                                  </span>
                                  <span className="text-[10px]" style={{ color: '#6b7280' }}>{sub.lang}</span>
                                </div>
                              </div>
                              <span className="text-[10px] shrink-0" style={{ color: '#6b7280' }}>{sub.time}</span>
                            </motion.a>
                          ))}
                        </div>
                      </motion.div>
                    )
                  }
                  return null
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
