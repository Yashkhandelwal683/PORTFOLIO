import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenu, HiX } from 'react-icons/hi'
import { navLinks } from '../data/navLinks'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('#home')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)

      const sections = navLinks.map((link) => link.path.slice(1))
      for (const section of sections.reverse()) {
        const el = document.getElementById(section)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 150) {
            setActiveSection(`#${section}`)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = (path) => {
    setIsOpen(false)
    const el = document.querySelector(path)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-lg' : ''
      }`}
    >
      <div className="container-max px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <button onClick={() => handleClick('#home')} className="text-2xl font-bold gradient-text">
            YK
          </button>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleClick(link.path)}
                className={`text-sm tracking-wide transition-all duration-300 hover:text-primary ${
                  activeSection === link.path
                    ? 'text-primary'
                    : 'text-gray-400'
                }`}
              >
                {link.name}
              </button>
            ))}
            <a
              href="/resume.pdf"
              download
              className="px-5 py-2 text-sm font-medium rounded-full gradient-border text-white hover:glow transition-all duration-300"
            >
              Resume
            </a>
          </div>

          <button
            className="md:hidden text-2xl text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/5"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleClick(link.path)}
                  className={`text-left text-sm py-2 transition-colors ${
                    activeSection === link.path ? 'text-primary' : 'text-gray-400'
                  }`}
                >
                  {link.name}
                </button>
              ))}
              <a
                href="/resume.pdf"
                download
                className="px-5 py-2 text-sm font-medium rounded-full gradient-border text-white text-center"
              >
                Resume
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
