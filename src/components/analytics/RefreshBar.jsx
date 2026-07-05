import { useState, useEffect } from 'react'
import { FaSyncAlt } from 'react-icons/fa'

function timeAgo(date) {
  if (!date || !(date instanceof Date) || isNaN(date)) return 'never'
  const diff = Date.now() - date.getTime()
  if (diff < 0) return 'just now'
  const sec = Math.floor(diff / 1000)
  if (sec < 5) return 'just now'
  if (sec < 60) return `${sec}s ago`
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  return `${Math.floor(hr / 24)}d ago`
}

export default function RefreshBar({ lastUpdated, onRefresh, loading }) {
  const [display, setDisplay] = useState('')

  useEffect(() => {
    if (!lastUpdated) { setDisplay(''); return }
    setDisplay(timeAgo(lastUpdated))
    const id = setInterval(() => setDisplay(timeAgo(lastUpdated)), 10000)
    return () => clearInterval(id)
  }, [lastUpdated])

  return (
    <div className="flex items-center gap-2 text-[10px] text-gray-500">
      {display && <span>Updated {display}</span>}
      <button
        onClick={onRefresh}
        disabled={loading}
        className="p-1 rounded-md hover:bg-white/10 transition-colors disabled:opacity-30"
      >
        <FaSyncAlt className={`text-[10px] ${loading ? 'animate-spin' : ''}`} />
      </button>
    </div>
  )
}
