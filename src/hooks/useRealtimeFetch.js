import { useState, useEffect, useRef, useCallback } from 'react'

export default function useRealtimeFetch(fetchFn, interval = 120000, immediate = true, refreshDeps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const intervalRef = useRef(null)
  const mountedRef = useRef(true)
  const fetchCountRef = useRef(0)
  const fetchFnRef = useRef(fetchFn)
  const initialRef = useRef(true)
  fetchFnRef.current = fetchFn

  const fetchData = useCallback(async (isRetry = false) => {
    if (isRetry) fetchCountRef.current += 1
    if (fetchCountRef.current > 5) return

    setLoading(true)
    setError(null)

    try {
      const result = await fetchFnRef.current()
      if (!mountedRef.current) return
      setData(result)
      setError(null)
      setLastUpdated(new Date())
      setLoading(false)
      fetchCountRef.current = 0
    } catch (e) {
      if (!mountedRef.current) return
      setError(e.message || 'Fetch failed')
      setLoading(false)

      if (fetchCountRef.current < 5) {
        const delay = Math.min(1000 * Math.pow(2, fetchCountRef.current), 30000)
        setTimeout(() => fetchData(true), delay)
      }
    }
  }, [])

  const refresh = useCallback(() => {
    fetchCountRef.current = 0
    fetchData()
  }, [fetchData])

  useEffect(() => {
    mountedRef.current = true
    if (immediate) fetchData()
    intervalRef.current = setInterval(() => {
      fetchCountRef.current = 0
      fetchData()
    }, interval)
    return () => {
      mountedRef.current = false
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [fetchData, interval, immediate])

  useEffect(() => {
    if (initialRef.current) {
      initialRef.current = false
      return
    }
    refresh()
  }, refreshDeps) // eslint-disable-line

  return { data, loading, error, lastUpdated, refresh, setData }
}
