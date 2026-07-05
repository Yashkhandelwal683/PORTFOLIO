import { useState, useRef, useCallback, useEffect, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaStar } from 'react-icons/fa'
import DetailCard from './DetailCard'

const GalaxyScene = lazy(() => import('./GalaxyScene'))

const levelGradients = {
  Advanced: 'from-primary to-cyan-400',
  Intermediate: 'from-secondary to-purple-400',
  Learning: 'from-yellow-400 to-orange-400',
}

const levelStars = { Advanced: 5, Intermediate: 3, Learning: 1 }

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(query)
    setMatches(mq.matches)
    const handler = (e) => setMatches(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [query])
  return matches
}

/* ─── Shooting Stars ─── */
function ShootingStars() {
  const [star, setStar] = useState(null)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    const shoot = () => {
      if (!mounted.current) return
      const angle = -20 + Math.random() * 40
      const startX = 10 + Math.random() * 70
      const startY = 5 + Math.random() * 30
      const len = 60 + Math.random() * 80
      const dur = 1 + Math.random() * 0.5
      const id = Date.now()
      setStar({ id, angle, startX, startY, len, dur })
      setTimeout(() => {
        if (mounted.current) setStar(null)
      }, dur * 1000)
    }
    const interval = setInterval(shoot, 4000 + Math.random() * 6000)
    return () => {
      mounted.current = false
      clearInterval(interval)
    }
  }, [])

  if (!star) return null

  return (
    <motion.div
      key={star.id}
      className="absolute z-10 pointer-events-none"
      initial={{
        left: `${star.startX}%`,
        top: `${star.startY}%`,
        width: 0,
        height: 1,
        opacity: 1,
      }}
      animate={{
        left: `${star.startX + 25}%`,
        top: `${star.startY + 15}%`,
        width: star.len,
        opacity: 0,
      }}
      transition={{ duration: star.dur, ease: 'easeOut' }}
      style={{
        transform: `rotate(${star.angle}deg)`,
        background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.8), rgba(170,204,255,0.4))',
        boxShadow: '0 0 4px rgba(255,255,255,0.6), 0 0 12px rgba(170,204,255,0.3)',
        transformOrigin: 'left center',
      }}
    />
  )
}

/* ─── Tooltip ─── */
function Tooltip({ tech, category, mouseX, mouseY }) {
  if (!tech) return null
  const stars = levelStars[tech.level] || 1

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: 5 }}
      transition={{ duration: 0.12 }}
      className="fixed z-[70] pointer-events-none"
      style={{ left: mouseX + 16, top: mouseY - 10 }}
    >
      <div
        className="px-4 py-3 rounded-xl min-w-[150px]"
        style={{
          background: `linear-gradient(135deg, ${category.color}15, rgba(255,255,255,0.03))`,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <p className="text-white text-xs font-semibold mb-1">{tech.name}</p>
        <div className="flex items-center gap-1 mb-1.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <FaStar
              key={i}
              className={`text-[8px] ${i <= stars ? 'text-yellow-400' : 'text-gray-600'}`}
            />
          ))}
        </div>
        <span
          className={`inline-block text-[8px] font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r ${levelGradients[tech.level] || levelGradients.Learning} text-black`}
        >
          {tech.level}
        </span>
        <p className="text-gray-400 text-[9px] mt-1">{tech.projects?.length || 0} Projects</p>
      </div>
    </motion.div>
  )
}

/* ─── Mobile Carousel Layout ─── */
function MobileRadialLayout({ category, onTechClick }) {
  const Icon = category.icon
  const { skills } = category
  const scrollRef = useRef(null)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden p-4"
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.15 }}
        className="mb-6"
      >
        <div
          className="w-20 h-20 rounded-full flex flex-col items-center justify-center gap-1"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${category.color}50, ${category.color}10)`,
            border: `2px solid ${category.color}50`,
            boxShadow: `0 0 40px ${category.color}30`,
          }}
        >
          <Icon style={{ color: '#fff' }} className="text-xl" />
          <span className="text-white text-[9px] font-bold">{category.name}</span>
          <span className="text-[8px] text-gray-400">{skills.length} skills</span>
        </div>
      </motion.div>

      <div className="relative w-full max-w-[320px]">
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto py-3 px-2"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {skills.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              whileTap={{ scale: 0.92 }}
              className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0"
              style={{ scrollSnapAlign: 'center', width: 64 }}
              onClick={() => onTechClick(tech)}
            >
              <div
                className="w-14 h-14 rounded-full flex flex-col items-center justify-center gap-0.5"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${category.color}40, ${category.color}10)`,
                  border: `1.5px solid ${category.color}40`,
                  boxShadow: `0 0 20px ${category.color}18, inset 0 0 10px ${category.color}08`,
                }}
              >
                {tech.icon ? (
                  <tech.icon className="text-lg" style={{ color: '#fff' }} />
                ) : (
                  <span className="text-sm font-bold text-white">{tech.name[0]}</span>
                )}
                <span className="text-[7px] text-white/80 font-semibold leading-tight">{tech.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex gap-1.5 mt-4">
        <div className="w-1.5 h-1.5 rounded-full opacity-50" style={{ background: category.color }} />
        <div className="w-1.5 h-1.5 rounded-full bg-white/15" />
        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
      </div>
    </motion.div>
  )
}

/* ─── Loading ─── */
function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  )
}

/* ─── Modal ─── */
function GalaxyModal({ isDesktop, category, visible, onTechClick, onTechHover, onClose, selectedTech }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      onClick={(e) => e.stopPropagation()}
      className="relative w-[96vw] md:w-[88vw] lg:w-[78vw] h-[88vh] md:h-[85vh] lg:h-[80vh] rounded-2xl overflow-hidden select-none"
      style={{
        background: 'linear-gradient(135deg, rgba(8,8,35,0.96), rgba(3,3,15,0.99))',
        border: `1px solid ${category.color}40`,
        boxShadow: `
          0 0 80px ${category.color}15,
          0 0 200px rgba(0,0,0,0.9),
          0 0 4px ${category.color}20,
          inset 0 0 60px rgba(0,0,0,0.5)
        `,
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
    >
      {/* Nebula glow orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full opacity-[0.06] blur-3xl pointer-events-none"
        style={{ background: `radial-gradient(circle, ${category.color}, transparent)` }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-[0.04] blur-3xl pointer-events-none"
        style={{ background: `radial-gradient(circle, #6688ff, transparent)` }}
      />

      {/* Shooting stars */}
      <ShootingStars />

      {/* Close button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-all backdrop-blur-md border border-white/10 hover:border-white/30 hover:shadow-lg hover:shadow-white/10"
      >
        <FaTimes className="text-sm" />
      </button>

      {/* Auto-close countdown bar */}
      <div className="absolute top-0 left-0 right-0 z-30 h-0.5 overflow-hidden bg-white/[0.03]">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: 10, ease: 'linear' }}
          className="h-full rounded-full"
          style={{ background: category.color, boxShadow: `0 0 8px ${category.color}` }}
        />
      </div>

      {/* Galaxy or mobile layout */}
      {isDesktop ? (
        <div className="w-full h-full">
          <Suspense fallback={<LoadingFallback />}>
            <GalaxyScene
              category={category}
              onTechClick={onTechClick}
              onTechHover={onTechHover}
            />
          </Suspense>
        </div>
      ) : (
        <MobileRadialLayout category={category} onTechClick={onTechClick} />
      )}

      {/* DetailCard inside modal */}
      <AnimatePresence>
        {selectedTech && (
          <DetailCard
            tech={selectedTech}
            category={category}
            onClose={() => onTechClick(null)}
            insideContainer
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─── Main ─── */
export default function SkillGalaxy({ category, onClose }) {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [selectedTech, setSelectedTech] = useState(null)
  const [hoveredTech, setHoveredTech] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)
  const autoTimerRef = useRef(null)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const triggerClose = useCallback(() => {
    setClosing(true)
    setTimeout(() => onClose(), 450)
  }, [onClose])

  // Auto-close after 10 seconds
  useEffect(() => {
    if (!visible || closing) return
    autoTimerRef.current = setTimeout(triggerClose, 10000)
    return () => {
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current)
    }
  }, [visible, closing, triggerClose])

  // Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        if (selectedTech) {
          setSelectedTech(null)
          return
        }
        triggerClose()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selectedTech, triggerClose])

  const handleTechHover = useCallback((tech, e) => {
    setHoveredTech(tech)
    if (e) setMousePos({ x: e.clientX, y: e.clientY })
  }, [])

  const handleTechClick = useCallback((tech) => {
    if (!tech) {
      setSelectedTech(null)
      return
    }
    // Extend auto-close timer on interaction
    if (autoTimerRef.current) {
      clearTimeout(autoTimerRef.current)
      autoTimerRef.current = setTimeout(triggerClose, 10000)
    }
    setSelectedTech(tech)
  }, [triggerClose])

  const handleBackdropClick = useCallback(() => {
    if (selectedTech) {
      setSelectedTech(null)
    } else {
      triggerClose()
    }
  }, [selectedTech, triggerClose])

  const handleContainerMouseMove = useCallback(
    (e) => {
      if (hoveredTech) setMousePos({ x: e.clientX, y: e.clientY })
    },
    [hoveredTech],
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed inset-0 z-50"
      onMouseMove={handleContainerMouseMove}
    >
      {/* Backdrop - darkens and blurs the page behind */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-xl"
        onClick={handleBackdropClick}
      />

      {/* Centering container */}
      <div
        className="absolute inset-0 flex items-center justify-center p-4 md:p-6"
        style={{ pointerEvents: 'none' }}
      >
        <div style={{ pointerEvents: 'auto' }}>
          <AnimatePresence>
            {!closing && visible && (
              <GalaxyModal
                key="modal"
                isDesktop={isDesktop}
                category={category}
                visible={visible}
                onTechClick={handleTechClick}
                onTechHover={handleTechHover}
                onClose={triggerClose}
                selectedTech={selectedTech}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredTech && !selectedTech && (
          <Tooltip tech={hoveredTech} category={category} mouseX={mousePos.x} mouseY={mousePos.y} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
