import { useState, useCallback, useRef, useEffect, memo } from 'react'
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion'

const lidVariants = {
  closed: {
    rotateX: 0,
    transition: { type: 'spring', stiffness: 180, damping: 14 },
  },
  open: {
    rotateX: -115,
    transition: { type: 'spring', stiffness: 200, damping: 12 },
  },
}

const glowStripVariants = {
  closed: { opacity: 0, scaleX: 0.3 },
  open: {
    opacity: 1,
    scaleX: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

const FolderCard = memo(function FolderCard({ face, glowColor, index, isActive, onClick, disabled }) {
  const [isHovered, setIsHovered] = useState(false)
  const Icon = face.icon
  const topSkills = face.skills.slice(0, 3)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className="perspective-[800px]"
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={disabled ? undefined : onClick}
        onKeyDown={e => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault()
            onClick()
          }
        }}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-label={`Open ${face.label} folder`}
        className="relative cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:rounded-2xl"
      >
        <div
          className="relative rounded-2xl p-5 md:p-6 flex flex-col items-center gap-4 transition-all duration-400"
          style={{
            background: isHovered && !disabled
              ? 'rgba(30, 41, 59, 0.9)'
              : 'rgba(17, 24, 39, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: isHovered && !disabled
              ? '1px solid rgba(255,255,255,0.12)'
              : isActive
                ? '1px solid rgba(255,255,255,0.08)'
                : '1px solid rgba(255,255,255,0.06)',
            transform: isHovered && !disabled
              ? 'translateY(-10px) scale(1.04) rotateX(3deg)'
              : 'translateY(0) scale(1) rotateX(0)',
            boxShadow: isHovered && !disabled
              ? `0 16px 48px rgba(0,0,0,0.5), 0 0 30px ${glowColor}20, 0 0 60px ${glowColor}10`
              : isActive
                ? '0 4px 12px rgba(0,0,0,0.2)'
                : '0 4px 20px rgba(0,0,0,0.3)',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            opacity: isActive ? 0.4 : 1,
            filter: isActive ? 'grayscale(0.5)' : 'none',
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%)',
            }}
          />

          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[6deg]"
            style={{
              background: `${glowColor}15`,
              border: `1px solid ${glowColor}25`,
            }}
          >
            <Icon style={{ color: face.color, fontSize: 16 }} />
          </div>

          <div className="text-center space-y-1.5">
            <h3
              className="text-sm font-bold transition-colors duration-300"
              style={{ color: isHovered && !disabled ? '#fff' : '#e0e0e0' }}
            >
              {face.label}
            </h3>
            <p className="text-[10px] text-gray-500 font-medium">
              {face.skills.length} Technologies
            </p>
          </div>

          <div className="flex items-center gap-2">
            {topSkills.map(skill => (
              <div
                key={skill.name}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300"
                style={{
                  background: isHovered && !disabled
                    ? 'rgba(255,255,255,0.06)'
                    : 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  transform: isHovered && !disabled ? 'translateY(-2px)' : 'translateY(0)',
                }}
              >
                {skill.icon ? (
                  <skill.icon style={{ color: face.color, fontSize: 13 }} />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: face.color }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
})

function ExpandedView({ face, glowColor, onClose }) {
  const lidControls = useAnimationControls()
  const glowStripControls = useAnimationControls()
  const [visibleCount, setVisibleCount] = useState(0)
  const [phase, setPhase] = useState('opening')
  const mountedRef = useRef(true)
  const cancelRef = useRef(false)
  
  const resolveRef = useRef(null)
  const Icon = face.icon
  const skills = face.skills

  useEffect(() => {
    runSequence()
    return () => {
      mountedRef.current = false
      if (resolveRef.current) {
        resolveRef.current()
        resolveRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sleep = useCallback((ms) => {
    return new Promise(resolve => {
      const timer = setTimeout(() => {
        resolveRef.current = null
        resolve()
      }, ms)
      resolveRef.current = () => {
        clearTimeout(timer)
        resolveRef.current = null
        resolve()
      }
    })
  }, [])

  const wake = useCallback(() => {
    if (resolveRef.current) {
      const r = resolveRef.current
      resolveRef.current = null
      r()
    }
  }, [])

  const reverseSequence = useCallback(async () => {
    setPhase('hiding')
    for (let i = skills.length - 1; i >= 0; i--) {
      if (!mountedRef.current) return
      setVisibleCount(i)
      if (i > 0) {
        await sleep(400)
        if (!mountedRef.current) return
      }
    }
  }, [skills.length, sleep])

  const runSequence = async () => {
    await lidControls.start('open')
    glowStripControls.start('open')
    if (!mountedRef.current || cancelRef.current) return
    setPhase('revealing')

    for (let i = 0; i < skills.length; i++) {
      if (!mountedRef.current || cancelRef.current) return
      setVisibleCount(i + 1)
      if (i < skills.length - 1) {
        await sleep(2000)
        if (!mountedRef.current || cancelRef.current) return
      }
    }

    if (!mountedRef.current || cancelRef.current) return
    setPhase('visible')

    await sleep(2000)
    if (!mountedRef.current || cancelRef.current) return

    await reverseSequence()
    if (!mountedRef.current) return

    setPhase('closing')
    glowStripControls.start('closed')
    await lidControls.start('closed')
    if (mountedRef.current) onClose()
  }

  const handleBackdropClick = useCallback(async () => {
    if (cancelRef.current) return
    if (phase === 'hiding' || phase === 'closing') return

    cancelRef.current = true
    wake()

    await sleep(50)

    await reverseSequence()
    if (!mountedRef.current) return

    setPhase('closing')
    glowStripControls.start('closed')
    await lidControls.start('closed')
    if (mountedRef.current) onClose()
  }, [phase, sleep, wake, reverseSequence, lidControls, glowStripControls, onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-10 md:py-16"
      onClick={handleBackdropClick}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(ellipse, ${glowColor}25, transparent 70%)`,
          filter: 'blur(80px)',
        }}
      />

      <div className="relative z-10 w-full max-w-5xl mx-4 px-4" onClick={e => e.stopPropagation()}>
        <div className="flex flex-col items-center">
          <motion.div
            className="w-full min-h-[200px] mb-10 md:mb-14"
            animate={
              phase === 'visible'
                ? { y: [0, -4, 0] }
                : { y: 0 }
            }
            transition={
              phase === 'visible'
                ? { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 0.3 }
            }
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              <AnimatePresence mode="popLayout">
                {skills.map((skill, i) => {
                  if (i >= visibleCount) return null
                  const SkillIcon = skill.icon

                  return (
                    <motion.div
                      key={skill.name}
                      layout
                      initial={{
                        opacity: 0,
                        y: 120,
                        scale: 0.85,
                        rotate: i % 2 === 0 ? -6 : 6,
                        filter: 'blur(6px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        rotate: 0,
                        filter: 'blur(0px)',
                        boxShadow: [
                          '0 4px 12px rgba(0,0,0,0.1)',
                          `0 24px 64px rgba(0,0,0,0.5), 0 0 40px ${glowColor}20`,
                        ],
                      }}
                      exit={{
                        opacity: 0,
                        y: 80,
                        scale: 0.85,
                        rotate: i % 2 === 0 ? 6 : -6,
                        filter: 'blur(6px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 100,
                        damping: 12,
                        mass: 0.8,
                        boxShadow: { duration: 0.5, ease: 'easeOut' },
                      }}
                      className="relative rounded-2xl overflow-hidden group perspective-[400px]"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: `1px solid ${glowColor}15`,
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{
                          background: `radial-gradient(circle at 50% 100%, ${glowColor}12, transparent 70%)`,
                        }}
                      />

                      <div
                        className="absolute top-0 left-[5%] right-[5%] h-[1px] rounded-full"
                        style={{
                          background: glowColor,
                          filter: 'blur(2px)',
                          opacity: 0.3,
                        }}
                      />

                      <div className="relative p-3.5 md:p-4">
                        <div className="flex items-center gap-3 mb-2.5">
                          <div
                            className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{
                              background: `${glowColor}12`,
                              border: `1px solid ${glowColor}20`,
                            }}
                          >
                            {SkillIcon ? (
                              <SkillIcon style={{ color: glowColor, fontSize: 16 }} />
                            ) : (
                              <span className="text-sm font-bold" style={{ color: glowColor }}>
                                {skill.name[0]}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-white truncate">
                              {skill.name}
                            </p>
                            <p className="text-[10px] font-medium" style={{ color: glowColor }}>
                              {skill.level || 'Proficient'}
                            </p>
                          </div>
                        </div>

                        {skill.timeline && (
                          <p className="text-[10px] text-gray-500 truncate">
                            {skill.timeline}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </motion.div>

          <div className="perspective-[1200px] relative" style={{ width: 140, height: 110 }}>
            <div
              className="absolute -inset-8 rounded-full pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${glowColor}18, transparent 70%)`,
                filter: 'blur(30px)',
              }}
            />

            <div
              className="absolute inset-0 rounded-2xl border border-white/[0.08] backdrop-blur-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
            />

            <div
              className="absolute -top-3 left-0 w-10 h-3 rounded-t-lg border border-white/[0.08] border-b-0 backdrop-blur-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
              }}
            />

            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="absolute bottom-2 left-1/2 rounded-lg border border-white/[0.04]"
                style={{
                  width: `${78 + i * 5}%`,
                  height: `${58 - i * 10}%`,
                  background: `rgba(255,255,255,${0.02 + i * 0.01})`,
                  zIndex: 2 - i,
                  transform: `translate(-50%, ${i * 2}px) rotate(${(i - 1) * 3}deg)`,
                }}
              />
            ))}

            <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 3 }}>
              <Icon style={{ color: glowColor, fontSize: 32 }} />
            </div>

            <motion.div
              className="absolute inset-0 rounded-2xl border border-white/[0.1] backdrop-blur-xl"
              style={{
                transformOrigin: 'bottom',
                zIndex: 4,
                backfaceVisibility: 'hidden',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 16px rgba(0,0,0,0.3)',
                willChange: 'transform',
              }}
              variants={lidVariants}
              initial="closed"
              animate={lidControls}
            />

            <motion.div
              className="absolute -bottom-[2px] left-[10%] right-[10%] h-[3px] rounded-full z-5"
              style={{
                background: glowColor,
                boxShadow: `0 0 12px ${glowColor}, 0 0 24px ${glowColor}`,
              }}
              variants={glowStripVariants}
              initial="closed"
              animate={glowStripControls}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function SkillFolderCards({ faces, glowColors }) {
  const [activeFolderId, setActiveFolderId] = useState(null)
  const isAnimatingRef = useRef(false)

  const handleFolderClick = useCallback((faceId) => {
    if (isAnimatingRef.current) return
    isAnimatingRef.current = true
    setActiveFolderId(faceId)
  }, [])

  const handleClose = useCallback(() => {
    isAnimatingRef.current = false
    setActiveFolderId(null)
  }, [])

  const selectedFace = activeFolderId
    ? faces.find(f => f.id === activeFolderId)
    : null

  return (
    <div className="relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {faces.map((face, i) => (
          <FolderCard
            key={face.id}
            face={face}
            index={i}
            glowColor={glowColors[face.id]}
            isActive={activeFolderId === face.id}
            onClick={() => handleFolderClick(face.id)}
            disabled={isAnimatingRef.current}
          />
        ))}
      </div>

      <AnimatePresence>
        {selectedFace && (
          <ExpandedView
            key={selectedFace.id}
            face={selectedFace}
            glowColor={glowColors[selectedFace.id]}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
