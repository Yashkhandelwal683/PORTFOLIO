import { motion } from 'framer-motion'
import { FaArrowUp, FaHeart } from 'react-icons/fa'

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative z-10 border-t border-white/5 py-8">
      <div className="container-max px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm flex items-center gap-1">
            Made with <FaHeart className="text-red-500" /> by Yash Khandelwal &copy; {new Date().getFullYear()}
          </p>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-primary hover:bg-primary/10 transition-colors"
            aria-label="Back to top"
          >
            <FaArrowUp />
          </motion.button>
        </div>
      </div>
    </footer>
  )
}
