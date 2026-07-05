import { useRef, useState } from 'react'

export default function MagneticButton({ children, onClick, href, className = '', ...props }) {
  const ref = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setPosition({ x: x * 0.3, y: y * 0.3 })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  const Component = href ? 'a' : 'button'
  const extraProps = href ? { href, ...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {}) } : { onClick }

  return (
    <Component
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: 'transform 0.3s ease-out',
      }}
      className={`magnetic-btn inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${className}`}
      {...extraProps}
      {...props}
    >
      {children}
    </Component>
  )
}
