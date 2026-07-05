import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa'
import { SiLeetcode } from 'react-icons/si'

/* ─── Stars ─── */
function Stars() {
  const stars = useMemo(() =>
    Array.from({ length: 120 }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: 1 + Math.random() * 2,
      delay: Math.random() * 6,
      duration: 2 + Math.random() * 4,
    })),
  [], [])

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{ top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size }}
          animate={{ opacity: [0.15, 0.9, 0.15] }}
          transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

/* ─── Aurora / Nebula ─── */
function Aurora() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <motion.div
        className="absolute -top-1/4 left-1/3 w-[500px] h-[500px] rounded-full opacity-25"
        style={{ background: 'radial-gradient(circle, rgba(0,150,255,0.3), transparent 70%)', filter: 'blur(80px)' }}
        animate={{ x: [0, 30, -20, 0], y: [0, -20, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(123,97,255,0.3), transparent 70%)', filter: 'blur(80px)' }}
        animate={{ x: [0, -20, 30, 0], y: [0, 15, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, rgba(0,245,255,0.15), transparent 70%)', filter: 'blur(100px)' }}
        animate={{ scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

/* ─── Orbit Lines ─── */
function OrbitLines({ mousePos }) {
  const offsetX = (mousePos.x - 0.5) * 8
  const offsetY = (mousePos.y - 0.5) * 6

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      <motion.div
        className="absolute rounded-full border border-primary/15"
        style={{ width: 280, height: 280, x: offsetX, y: offsetY }}
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute rounded-full border border-secondary/15"
        style={{ width: 400, height: 400, x: -offsetX * 0.5, y: -offsetY * 0.5 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute rounded-full border border-primary/10"
        style={{ width: 520, height: 520, x: offsetX * 0.3, y: offsetY * 0.3 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}

/* ─── Ground Platform ─── */
function GroundPlatform({ mousePos }) {
  const hoverScale = 1 + (mousePos.x - 0.5) * 0.04
  const hoverGlow = 30 + Math.abs(mousePos.x - 0.5) * 30

  return (
    <motion.div
      className="absolute bottom-[8%] left-1/2 -translate-x-1/2 z-20"
      style={{ scale: hoverScale }}
    >
      {/* Outer energy wave */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-[340px] h-[28px] rounded-[50%] border border-primary/10"
        style={{ bottom: '50%', marginBottom: -14 }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.1, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Main platform glow */}
      <div
        className="w-[280px] h-[24px] rounded-[50%]"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,245,255,0.12) 0%, transparent 70%)',
          boxShadow: `0 0 ${hoverGlow}px rgba(0,245,255,0.15), 0 0 80px rgba(123,97,255,0.08)`,
        }}
      />

      {/* Outer ring */}
      <motion.div
        className="absolute inset-0 rounded-[50%] border"
        style={{ borderColor: 'rgba(0,245,255,0.3)' }}
        animate={{
          boxShadow: [
            '0 0 20px rgba(0,245,255,0.15) inset',
            '0 0 40px rgba(0,245,255,0.3) inset',
            '0 0 20px rgba(0,245,255,0.15) inset',
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Inner ring */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[14px] rounded-[50%] border"
        style={{ borderColor: 'rgba(123,97,255,0.2)' }}
        animate={{ rotateX: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Center dot */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
        style={{ background: '#00F5FF', boxShadow: '0 0 10px rgba(0,245,255,0.6), 0 0 30px rgba(0,245,255,0.2)' }}
      />
    </motion.div>
  )
}

/* ─── Floating Widget ─── */
const widgetItems = [
  { icon: '🟢', label: 'Available for Internship', color: '#00F5FF' },
  { icon: '💻', label: 'MERN Stack Developer', color: '#7B61FF' },
  { icon: '☕', label: 'Java Developer', color: '#FF6B35' },
  { icon: '🧠', label: 'DSA Enthusiast', color: '#FFD700' },
  { icon: '🚀', label: 'Building Billing Software', color: '#00E676' },
  { icon: '📍', label: 'India', color: '#FF4081' },
]

function FloatingWidgets() {
  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {/* Connecting lines (SVG) */}
      <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.path
          d="M 12 12 Q 20 25 6 38"
          stroke="rgba(0,245,255,0.12)"
          strokeWidth="0.3"
          fill="none"
          strokeDasharray="0.5 0.5"
          animate={{ strokeDashoffset: [0, -2] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <motion.path
          d="M 88 10 Q 80 25 92 40"
          stroke="rgba(123,97,255,0.12)"
          strokeWidth="0.3"
          fill="none"
          strokeDasharray="0.5 0.5"
          animate={{ strokeDashoffset: [0, 2] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <motion.path
          d="M 6 38 Q 15 55 8 72"
          stroke="rgba(0,245,255,0.1)"
          strokeWidth="0.3"
          fill="none"
          strokeDasharray="0.4 0.4"
          animate={{ strokeDashoffset: [0, -1.5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
        />
      </svg>

      {/* Widget positions around the character */}
      {widgetItems.map((item, i) => {
        const positions = [
          { top: '8%', left: '6%' },
          { top: '6%', right: '6%', left: 'auto' },
          { top: '35%', left: '1%' },
          { top: '38%', right: '2%', left: 'auto' },
          { top: 'auto', bottom: '22%', left: '4%' },
          { top: 'auto', bottom: '25%', right: '4%', left: 'auto' },
        ]

        const pos = positions[i]
        const delay = i * 0.4

        return (
          <motion.div
            key={item.label}
            className="absolute z-10"
            style={{
              ...pos,
              transform: 'translateY(0)',
            }}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: [0, -5, 0], scale: 1 }}
            transition={{
              opacity: { delay: 1 + delay, duration: 0.5 },
              y: { delay: delay, duration: 3 + i * 0.3, repeat: Infinity, ease: 'easeInOut' },
              scale: { delay: 1 + delay, duration: 0.5 },
            }}
            whileHover={{ scale: 1.08, y: -8 }}
          >
            <div
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap cursor-pointer select-none"
              style={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: `1px solid ${item.color}25`,
                boxShadow: `0 0 20px ${item.color}08, 0 8px 32px rgba(0,0,0,0.3)`,
              }}
            >
              <span className="text-sm">{item.icon}</span>
              <span className="text-[11px] font-medium text-gray-200/90 tracking-wide">{item.label}</span>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

/* ─── Social Dock ─── */
const socials = [
  { icon: FaLinkedin, href: 'https://www.linkedin.com/in/yash-khandelwal-8a9734252/', color: '#0A66C2' },
  { icon: FaGithub, href: 'https://github.com/Yashkhandelwal683', color: '#fff' },
  { icon: SiLeetcode, href: 'https://leetcode.com/u/yash_khandelwal123/', color: '#FFA116' },
  { icon: FaInstagram, href: 'https://www.instagram.com/', color: '#E4405F' },
]

function SocialDock() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      className="absolute z-30 flex gap-3 py-4 px-2.5 rounded-2xl max-lg:flex-row max-lg:bottom-28 max-lg:left-1/2 max-lg:-translate-x-1/2 max-lg:py-2.5 max-lg:px-4 lg:left-8 lg:top-1/2 lg:-translate-y-1/2 lg:flex-col"
      style={{
        background: 'rgba(255,255,255,0.02)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {socials.map((social) => (
        <motion.a
          key={social.href}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 flex items-center justify-center rounded-xl transition-all"
          style={{ color: 'rgba(255,255,255,0.5)' }}
          whileHover={{
            scale: 1.15,
            color: social.color,
            transition: { type: 'spring', stiffness: 300, damping: 12 },
          }}
        >
          <social.icon className="text-base" />
        </motion.a>
      ))}
    </motion.div>
  )
}

/* ─── Rim Lights ─── */
function RimLights({ mousePos }) {
  const followX = (mousePos.x - 0.5) * 15
  const followY = (mousePos.y - 0.5) * 10

  return (
    <div className="absolute inset-0 pointer-events-none z-5">
      {/* Blue rim light (left) */}
      <motion.div
        className="absolute left-[-5%] top-1/4 w-[300px] h-[600px] opacity-20"
        style={{
          background: 'linear-gradient(180deg, transparent, rgba(0,150,255,0.25), transparent)',
          filter: 'blur(60px)',
          x: followX,
          y: followY,
        }}
      />
      {/* Purple rim light (right) */}
      <motion.div
        className="absolute right-[-5%] top-1/4 w-[300px] h-[600px] opacity-20"
        style={{
          background: 'linear-gradient(180deg, transparent, rgba(123,97,255,0.2), transparent)',
          filter: 'blur(60px)',
          x: -followX * 0.7,
          y: -followY * 0.7,
        }}
      />
    </div>
  )
}

/* ─── Mobile Floating Tags (simplified for mobile) ─── */
function MobileTags() {
  return (
    <div className="flex flex-wrap gap-2 justify-center px-4 pb-8">
      {widgetItems.map((item) => (
        <span
          key={item.label}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${item.color}20`,
          }}
        >
          <span>{item.icon}</span>
          <span className="text-gray-300">{item.label}</span>
        </span>
      ))}
    </div>
  )
}

/* ─── Main ─── */
export default function HeroScene({ mousePos }) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <SocialDock />
      {/* Desktop scene */}
      <div className="hidden lg:flex relative w-full h-full items-center justify-center">
        <Stars />
        <Aurora />
        <RimLights mousePos={mousePos} />
        <OrbitLines mousePos={mousePos} />

        {/* Character image */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-20"
          style={{
            transformStyle: 'preserve-3d',
            perspective: 800,
          }}
        >
          <motion.div
            className="relative"
            animate={{
              rotateX: (mousePos.y - 0.5) * -3,
              rotateY: (mousePos.x - 0.5) * 4,
            }}
            transition={{ type: 'spring', stiffness: 80, damping: 20 }}
          >
            <img
              src="/images/image.png"
              alt="Yash Khandelwal"
              className="select-none pointer-events-none relative z-10"
              style={{
                height: '82vh',
                maxHeight: '900px',
                width: 'auto',
                objectFit: 'contain',
                objectPosition: 'bottom center',
              }}
            />
          </motion.div>
        </motion.div>

        <GroundPlatform mousePos={mousePos} />
        <FloatingWidgets mousePos={mousePos} />
      </div>

      {/* Mobile/tablet scene */}
      <div className="flex lg:hidden relative w-full items-center justify-center">
        <Stars />
        <Aurora />

        <div className="relative z-20">
          <img
            src="/images/image.png"
            alt="Yash Khandelwal"
            className="select-none pointer-events-none"
            style={{
              height: '60vh',
              maxHeight: '600px',
              width: 'auto',
              objectFit: 'contain',
              objectPosition: 'bottom center',
            }}
          />
        </div>

        <GroundPlatform mousePos={{ x: 0.5, y: 0.5 }} />

        <div className="absolute bottom-0 left-0 right-0 z-30">
          <MobileTags />
        </div>
      </div>
    </div>
  )
}
