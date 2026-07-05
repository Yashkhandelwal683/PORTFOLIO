import { useMousePosition } from '../hooks/useMousePosition'

export default function MouseGlow() {
  const { x, y } = useMousePosition()

  return (
    <div
      className="fixed pointer-events-none z-[9999] transition-all duration-300 ease-out"
      style={{
        left: x - 150,
        top: y - 150,
        width: 300,
        height: 300,
        background: 'radial-gradient(circle, rgba(0,245,255,0.06) 0%, transparent 70%)',
        borderRadius: '50%',
      }}
      aria-hidden="true"
    />
  )
}
