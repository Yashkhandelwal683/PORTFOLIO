import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  FaGithub, FaCode, FaReact, FaAward, FaCalendarAlt, FaStar,
  FaCodeBranch, FaClock, FaCoffee, FaRocket,
  FaBook, FaBrain, FaProjectDiagram, FaUserGraduate,
} from 'react-icons/fa'
import { SiLeetcode } from 'react-icons/si'
import { HiLightningBolt } from 'react-icons/hi'
import SectionWrapper from '../components/SectionWrapper'
import BlurText from '../components/BlurText'
import AnimatedCounter from '../components/AnimatedCounter'
import ProgressRing from '../components/ProgressRing'
import { fetchGitHubContributions } from '../utils/githubContributions'

const LEETCODE_BASE = 'https://alfa-leetcode-api.onrender.com'
const LEETCODE_USERNAME = 'yash_khandelwal123'
const ALL_QUESTIONS = { All: 3977, Easy: 951, Medium: 2077, Hard: 949 }

const LEVELS = [
  { level: 0, color: '#1a1a2e' },
  { level: 1, color: '#0e4429' },
  { level: 2, color: '#006d32' },
  { level: 3, color: '#26a641' },
  { level: 4, color: '#39d353' },
]

const funStats = [
  { icon: FaCoffee, label: 'Cups of Coffee', value: 500, suffix: '+' },
  { icon: FaCode, label: 'Lines of Code', value: 50000, suffix: '+' },
  { icon: FaRocket, label: 'Projects Built', value: 15, suffix: '+' },
  { icon: FaBook, label: 'Technologies Learned', value: 20, suffix: '+' },
  { icon: FaBrain, label: 'Problems Solved', value: 500, suffix: '+' },
  { icon: FaStar, label: 'GitHub Repositories', value: 20, suffix: '+' },
  { icon: FaClock, label: 'Coding Hours', value: 1000, suffix: '+' },
  { icon: FaReact, label: 'Portfolio Visitors', value: 1000, suffix: '+' },
]

const journeyTimeline = [
  { year: '2022', title: 'Started Programming', description: 'Began my coding journey with C language' },
  { year: '2023', title: 'Learned Java & DSA', description: 'Mastered Java and started solving DSA problems' },
  { year: '2023', title: 'Started Web Development', description: 'Learned React and frontend development' },
  { year: '2024', title: 'Built Full Stack Projects', description: 'Created multiple full stack applications' },
  { year: '2024', title: 'Started Spring Boot', description: 'Expanded into Java backend development' },
  { year: '2025', title: 'Internship Experience', description: 'Completed Full Stack Web Development Internship' },
  { year: '2025', title: 'Preparing for Placements', description: 'Sharpening skills for top product-based companies' },
  { year: 'Future', title: 'Software Engineer', description: 'Goal: Join a top product-based company' },
]

export default function Dashboard() {
  const [githubData, setGithubData] = useState(null)
  const [stars, setStars] = useState(0)
  const [loading, setLoading] = useState(true)
  const [leetCodeStats, setLeetCodeStats] = useState(null)
  const [contribWeeks, setContribWeeks] = useState([])
  const [contribTotal, setContribTotal] = useState(0)
  const contribFetchedRef = useRef(false)

  useEffect(() => {
    const fetchGitHub = async () => {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch('/api/github/users/Yashkhandelwal683'),
          fetch('/api/github/users/Yashkhandelwal683/repos?per_page=100'),
        ])
        const userData = await userRes.json()
        const reposData = await reposRes.json()
        console.log('[Dashboard] GitHub user:', userData)
        setGithubData(userData)
        const totalStars = Array.isArray(reposData)
          ? reposData.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0)
          : 0
        setStars(totalStars)
      } catch (e) {
        console.error('Failed to fetch GitHub data', e)
      } finally {
        setLoading(false)
      }
    }
    fetchGitHub()
  }, [])

  const fetchLeetCode = useCallback(async () => {
    try {
      const year = new Date().getFullYear()
      const [profileRes, solvedRes] = await Promise.all([
        fetch(`${LEETCODE_BASE}/${LEETCODE_USERNAME}`),
        fetch(`${LEETCODE_BASE}/${LEETCODE_USERNAME}/solved`),
      ])
      const solved = await solvedRes.json()
      console.log('[Dashboard] LeetCode:', { solved })
      if (solved && typeof solved.easySolved === 'number') {
        setLeetCodeStats(solved)
      }
    } catch (e) {
      console.error('[Dashboard] LeetCode fetch failed:', e)
    }
  }, [])

  useEffect(() => {
    fetchLeetCode()
    const id = setInterval(fetchLeetCode, 120000)
    return () => clearInterval(id)
  }, [fetchLeetCode])

  useEffect(() => {
    if (contribFetchedRef.current) return
    contribFetchedRef.current = true
    fetchGitHubContributions('Yashkhandelwal683').then(({ days, total }) => {
      console.log(`[Dashboard] Contributions: ${total} total`)
      setContribTotal(total)
      const grouped = []
      for (let w = 0; w < days.length / 7; w++) {
        const week = days.slice(w * 7, (w + 1) * 7)
        if (week.length === 0) break
        grouped.push(week)
      }
      setContribWeeks(grouped)
    }).catch(e => {
      console.error('[Dashboard] Contributions fetch failed:', e)
    })
  }, [])

  return (
    <SectionWrapper id="dashboard" className="section-padding">
      <div className="container-max">
        <motion.div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Developer <span className="gradient-text">Dashboard</span>
          </h2>
          <BlurText
            text="I am a Java Developer"
            delay={100}
            animateBy="words"
            direction="top"
            className="text-lg md:text-xl text-primary font-medium mb-2 justify-center"
          />
          <BlurText
            text="I am a Problem Solver"
            delay={100}
            animateBy="words"
            direction="bottom"
            className="text-base md:text-lg text-secondary font-medium mb-6 justify-center"
          />
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
        </motion.div>

        {/* 1. GitHub Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 mb-8 gradient-border"
        >
          <div className="flex items-center gap-3 mb-8">
            <FaGithub className="text-3xl text-white" />
            <h3 className="text-2xl font-bold text-white">GitHub Statistics</h3>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 glass-card animate-pulse" />
              ))}
            </div>
          ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <motion.div whileHover={{ scale: 1.05, y: -4 }} className="glass-card p-5 text-center bg-primary/5 border-primary/20">
                  <FaCode className="text-2xl text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{githubData?.public_repos || 0}</p>
                  <p className="text-xs text-gray-400">Repositories</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05, y: -4 }} className="glass-card p-5 text-center bg-secondary/5 border-secondary/20">
                  <FaStar className="text-2xl text-secondary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{stars}</p>
                  <p className="text-xs text-gray-400">Stars Earned</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05, y: -4 }} className="glass-card p-5 text-center bg-primary/5 border-primary/20">
                  <FaCodeBranch className="text-2xl text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{githubData?.followers || 0}</p>
                  <p className="text-xs text-gray-400">Followers</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05, y: -4 }} className="glass-card p-5 text-center bg-secondary/5 border-secondary/20">
                  <FaUserGraduate className="text-2xl text-secondary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{githubData?.following || 0}</p>
                  <p className="text-xs text-gray-400">Following</p>
                </motion.div>
              </div>
          )}
          <div className="mt-6 glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-white">
                {contribTotal.toLocaleString()} contributions in the last year
              </h4>
            </div>
            {contribWeeks.length > 0 ? (
              <div className="overflow-x-auto scrollbar-thin">
                <div className="flex gap-px" style={{ minWidth: '728px' }}>
                  {contribWeeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-px">
                      {week.map((day) => (
                        <div
                          key={day.key}
                          className="w-[11px] h-[11px] rounded-[2px]"
                          style={{ backgroundColor: LEVELS[day.level]?.color || '#1a1a2e' }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-end gap-1.5 mt-3">
                  <span className="text-[10px] text-gray-500">Less</span>
                  {LEVELS.map((l) => (
                    <div key={l.level} className="w-[11px] h-[11px] rounded-[2px]" style={{ backgroundColor: l.color }} />
                  ))}
                  <span className="text-[10px] text-gray-500">More</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-20">
                <p className="text-gray-500 text-xs">Loading contribution data...</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* 2. LeetCode Progress */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 mb-8 gradient-border"
        >
          <div className="flex items-center gap-3 mb-8">
            <FaCode className="text-3xl text-[#FFA116]" />
            <h3 className="text-2xl font-bold text-white">LeetCode Progress</h3>
          </div>
          {leetCodeStats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <ProgressRing percentage={Math.round((leetCodeStats.easySolved / ALL_QUESTIONS.Easy) * 100)} label={`Easy (${leetCodeStats.easySolved})`} color="#00FF88" size={100} />
              </div>
              <div className="text-center">
                <ProgressRing percentage={Math.round((leetCodeStats.mediumSolved / ALL_QUESTIONS.Medium) * 100)} label={`Medium (${leetCodeStats.mediumSolved})`} color="#FFA116" size={100} />
              </div>
              <div className="text-center">
                <ProgressRing percentage={Math.round((leetCodeStats.hardSolved / ALL_QUESTIONS.Hard) * 100)} label={`Hard (${leetCodeStats.hardSolved})`} color="#FF4444" size={100} />
              </div>
              <div className="text-center">
                <ProgressRing percentage={Math.round((leetCodeStats.solvedProblem / ALL_QUESTIONS.All) * 100)} label={`Total (${leetCodeStats.solvedProblem})`} color="#7B61FF" size={100} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="w-24 h-24 mx-auto rounded-full bg-white/5" />
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* 3. Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="glass-card p-8 mb-8 gradient-border"
        >
          <div className="flex items-center gap-3 mb-8">
            <FaAward className="text-3xl text-primary" />
            <h3 className="text-2xl font-bold text-white">Certifications</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
              className="glass-card p-6 group hover:border-primary/30 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
                  <span className="text-3xl">📜</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                    Full Stack Web Development Internship
                  </h4>
                  <p className="text-sm text-gray-400 mt-1">Future Interns</p>
                  <p className="text-xs text-gray-500 mt-1">2025</p>
                  <div className="flex items-center gap-3 mt-4">
                    <a
                      href="/certificates/internship-certificate.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 transition-all"
                    >
                      View Certificate
                    </a>
                    <a
                      href="/certificates/internship-certificate.pdf"
                      download
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 transition-all"
                    >
                      Download
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* 4. Fun Developer Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="glass-card p-8 mb-8"
        >
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <HiLightningBolt className="text-primary" />
            Fun Developer Stats
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {funStats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.08, y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                  className="text-center cursor-default"
                >
                  <Icon className="text-2xl text-primary mx-auto mb-2" />
                  <p className="text-3xl font-bold gradient-text">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* 5. Coding Journey Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="glass-card p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <FaCalendarAlt className="text-3xl text-primary" />
            <h3 className="text-2xl font-bold text-white">Coding Journey</h3>
          </div>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-transparent" />
            <div className="space-y-8 pl-12">
              {journeyTimeline.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ x: 6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                  className="relative group"
                >
                  <div className="absolute -left-8 top-1 w-3 h-3 rounded-full bg-primary border-2 border-bg group-hover:scale-150 group-hover:bg-secondary transition-all duration-300" />
                  <span className="text-xs text-primary font-mono">{item.year}</span>
                  <h4 className="text-white font-semibold mt-1">{item.title}</h4>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 6. Live Coding Status */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="glass-card p-8"
        >
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <FaClock className="text-primary" />
            Live Coding Status
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Currently Building', value: 'Full Stack Projects', icon: FaProjectDiagram },
              { label: 'Learning', value: 'Spring Boot & System Design', icon: FaBook },
              { label: 'Focus', value: 'DSA & Placements', icon: FaBrain },
              { label: 'Available For', value: 'Internship Opportunities', icon: FaRocket },
            ].map((item, _i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.label}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="glass-card p-5"
                >
                  <Icon className="text-primary text-xl mb-3" />
                  <p className="text-gray-400 text-xs mb-1">{item.label}</p>
                  <p className="text-white font-semibold">{item.value}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
