import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { FaDownload } from 'react-icons/fa'
import { HiMail } from 'react-icons/hi'
import MagneticButton from '../components/MagneticButton'
import HeroScene from '../components/HeroScene'

const typingWords = ['Full Stack Developer', 'Java Developer', 'MERN Stack Developer', 'Problem Solver']

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [displayText, setDisplayText] = useState('')
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    })
  }, [])

  useEffect(() => {
    const currentWord = typingWords[wordIndex]
    let timeout

    if (!isDeleting && charIndex < currentWord.length) {
      timeout = setTimeout(() => {
        setDisplayText(currentWord.slice(0, charIndex + 1))
        setCharIndex((prev) => prev + 1)
      }, 80)
    } else if (!isDeleting && charIndex === currentWord.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000)
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setDisplayText(currentWord.slice(0, charIndex - 1))
        setCharIndex((prev) => prev - 1)
      }, 40)
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false)
      setWordIndex((prev) => (prev + 1) % typingWords.length)
    }

    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, wordIndex])

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Subtle background gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/[0.04] rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/[0.04] rounded-full blur-[128px]" />
      </div>

      <div className="container-max px-6 relative z-10 min-h-screen">
        <div className="grid lg:grid-cols-[45%_55%] min-h-screen items-center gap-8 lg:gap-4">
          {/* ─── Left Content ─── */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left pt-24 lg:pt-0">
            {/* Hello World badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
              style={{
                background: 'rgba(0,245,255,0.06)',
                border: '1px solid rgba(0,245,255,0.15)',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-primary font-mono text-[11px] tracking-[0.15em] uppercase">
                Hello World
              </span>
            </motion.div>

            {/* Hi, I'm */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mb-1"
            >
              <h1 className="text-4xl md:text-6xl lg:text-6xl font-bold text-white/90 leading-tight">
                Hi, I&apos;m
              </h1>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-5xl md:text-7xl lg:text-7xl font-bold gradient-text mb-5 leading-[1.1]"
            >
              Yash Khandelwal
            </motion.h1>

            {/* Typing animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="flex items-center gap-2 mb-6"
            >
              <span className="text-lg md:text-xl text-gray-400 font-light">I am a</span>
              <span className="text-lg md:text-xl font-semibold text-primary">
                {displayText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, ease: 'steps(2)' }}
                  className="inline-block ml-0.5 font-light"
                >
                  |
                </motion.span>
              </span>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-sm md:text-base text-gray-400 max-w-lg leading-relaxed mb-8"
            >
              A passionate software engineer specializing in full-stack development, 
              crafting elegant solutions with modern web technologies.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8"
            >
              <MagneticButton
                href="/resume.pdf"
                className="bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 hover:border-primary"
              >
                <FaDownload className="text-sm" />
                <span className="text-sm">Download Resume</span>
              </MagneticButton>
              <MagneticButton
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-secondary/10 text-secondary border border-secondary/30 hover:bg-secondary/20 hover:border-secondary"
              >
                <HiMail className="text-sm" />
                <span className="text-sm">Get in Touch</span>
              </MagneticButton>
            </motion.div>

            {/* Availability badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="flex items-center gap-2"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <span className="text-xs text-gray-500 font-mono tracking-wide">
                Available for Internship Opportunities
              </span>
            </motion.div>
          </div>

          {/* ─── Right Content ─── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="relative h-[60vh] lg:h-screen flex items-center justify-center"
          >
            <HeroScene mousePos={mousePos} />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden lg:block"
      >
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[9px] text-gray-600 tracking-[0.2em] font-mono">SCROLL</span>
          <div className="w-5 h-8 border border-gray-700/50 rounded-full flex justify-center p-1">
            <motion.div
              className="w-1 h-2.5 rounded-full"
              style={{ background: 'linear-gradient(180deg, #00F5FF, #7B61FF)' }}
              animate={{ y: [0, 8, 0], opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  )
}
