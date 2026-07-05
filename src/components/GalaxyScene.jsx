import { useRef, useMemo, useCallback, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'

/* ─── Background Gradient ─── */
function SceneSetup() {
  const { scene } = useThree()
  useEffect(() => {
    const c = document.createElement('canvas')
    c.width = 2
    c.height = 512
    const ctx = c.getContext('2d')
    const g = ctx.createLinearGradient(0, 0, 0, 512)
    g.addColorStop(0, '#141445')
    g.addColorStop(0.4, '#0b0b30')
    g.addColorStop(1, '#050520')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 2, 512)
    scene.background = new THREE.CanvasTexture(c)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}

/* ─── Stars ─── */
function Stars() {
  const ref = useRef()
  const count = 3000
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 15 + Math.random() * 80
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      p[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      p[i * 3 + 2] = r * Math.cos(phi)
    }
    return p
  }, [])

  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += d * 0.003
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.15} color="#fff" transparent opacity={0.6} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}

/* ─── Particle Field ─── */
function ParticleField() {
  const ref = useRef()
  const count = 300
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 24
      p[i * 3 + 1] = (Math.random() - 0.5) * 14
      p[i * 3 + 2] = (Math.random() - 0.5) * 24 - 4
    }
    return p
  }, [])

  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += d * 0.001
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#aaccff" transparent opacity={0.15} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}

/* ─── Center Planet ─── */
function CenterPlanet({ category }) {
  const groupRef = useRef()
  const glowRef = useRef()
  const atmoRef = useRef()
  const floatOffset = useRef(Math.random() * Math.PI * 2)
  const pulseOffset = useRef(Math.random() * Math.PI * 2)

  useFrame((_, d) => {
    floatOffset.current += d * 0.3
    pulseOffset.current += d * 0.5
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(floatOffset.current) * 0.06
      groupRef.current.rotation.y += d * 0.06
    }
    if (glowRef.current) {
      const s = 1 + Math.sin(pulseOffset.current) * 0.04
      glowRef.current.scale.setScalar(s)
    }
    if (atmoRef.current) {
      atmoRef.current.rotation.x = Math.sin(pulseOffset.current * 0.3) * 0.04
    }
  })

  const Icon = category.icon
  const skillCount = category.skills.length

  const expText = useMemo(() => {
    const t = category.skills.map((s) => s.timeline)
    const ys = t.filter((x) => /^\d+\+?\s*y/i.test(x)).map((x) => parseInt(x)).filter(Boolean)
    if (ys.length) return `${Math.max(...ys)}+ Years`
    const ms = t.filter((x) => /^\d+\+?\s*m/i.test(x)).map((x) => parseInt(x)).filter(Boolean)
    if (ms.length) return `${Math.max(...ms)}+ Months`
    return 'Currently Learning'
  }, [category])

  return (
    <group ref={groupRef}>
      {/* Outer glow aura */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.1, 24, 24]} />
        <meshBasicMaterial color={category.color} transparent opacity={0.08} side={THREE.BackSide} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Atmosphere ring */}
      <mesh ref={atmoRef} rotation={[Math.PI / 2.5, 0, 0]}>
        <ringGeometry args={[0.78, 0.86, 64]} />
        <meshBasicMaterial color={category.color} transparent opacity={0.15} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Main sphere */}
      <mesh>
        <sphereGeometry args={[0.75, 48, 48]} />
        <meshPhysicalMaterial
          color={category.color}
          emissive={category.color}
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.1}
          clearcoat={0.05}
          transparent
          opacity={0.95}
        />
      </mesh>

      <pointLight color={category.color} intensity={3} distance={10} decay={1.2} />

      {/* Info overlay */}
      <Html center position={[0, 0, 0]} zIndexRange={[10, 0]} occlude={false}>
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 16, delay: 0.3 }}
          className="flex flex-col items-center text-center pointer-events-none select-none"
          style={{ width: 200 }}
        >
          <div
            className="absolute inset-0 rounded-2xl -z-10"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${category.color}25, transparent 70%)`,
            }}
          />

          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center mb-2"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${category.color}60, ${category.color}20)`,
              boxShadow: `0 0 40px ${category.color}40`,
              border: `1px solid ${category.color}50`,
            }}
          >
            <Icon className="text-2xl" style={{ color: '#fff' }} />
          </div>

          <h3 className="text-white font-bold text-lg tracking-[0.12em] uppercase">
            {category.name}
          </h3>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-200/90 font-medium">{skillCount} Technologies</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-200/90 font-medium">{expText}</span>
          </div>

          <p className="text-[10px] text-gray-300 mt-2 leading-relaxed max-w-[160px]">{category.desc}</p>
        </motion.div>
      </Html>
    </group>
  )
}

/* ─── Orbit Ring ─── */
function OrbitRing({ radius, color }) {
  const pulseRef = useRef(0)
  const ringRef = useRef()

  useFrame((_, d) => {
    pulseRef.current += d * 0.15
    if (ringRef.current) {
      ringRef.current.rotation.z = Math.sin(pulseRef.current) * 0.02
    }
  })

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.12, 8, 120]} />
        <meshBasicMaterial color={color} transparent opacity={0.04} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.012, 6, 120]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} depthWrite={false} />
      </mesh>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.003, 4, 120]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.12} depthWrite={false} />
      </mesh>
    </group>
  )
}

/* ─── Tech Item ─── */
function TechItem({ tech, idx, total, radius, category, onHover, onClick }) {
  const groupRef = useRef()
  const glowRef = useRef()
  const angleRef = useRef((Math.PI * 2 / total) * idx)
  const speed = 0.12 + (idx / total) * 0.25 + Math.random() * 0.05
  const pulsePhase = useRef(Math.random() * Math.PI * 2)
  const trailHistory = useRef([])
  const trailRefs = useRef([])

  useFrame((_, d) => {
    angleRef.current += d * speed
    pulsePhase.current += d * 0.5

    const x = Math.cos(angleRef.current) * radius
    const z = Math.sin(angleRef.current) * radius

    trailHistory.current.unshift({ x, z })
    if (trailHistory.current.length > 5) trailHistory.current.pop()

    if (groupRef.current) {
      groupRef.current.position.x = x
      groupRef.current.position.z = z
      groupRef.current.position.y = Math.sin(pulsePhase.current) * 0.04
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(pulsePhase.current) * 0.1)
    }

    trailRefs.current.forEach((mesh, i) => {
      if (mesh && trailHistory.current[i + 1]) {
        mesh.position.x = trailHistory.current[i + 1].x
        mesh.position.z = trailHistory.current[i + 1].z
      }
    })
  })

  return (
    <group ref={groupRef}>
      {/* Trail particles */}
      {[...Array(4)].map((_, i) => (
        <mesh
          key={`trail-${i}`}
          ref={(el) => { trailRefs.current[i] = el }}
          position={[0, 0, 0]}
        >
          <sphereGeometry args={[0.04 - i * 0.007, 4, 4]} />
          <meshBasicMaterial
            color={category.color}
            transparent
            opacity={0.1 - i * 0.02}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.4, 10, 10]} />
        <meshBasicMaterial color={category.color} transparent opacity={0.08} side={THREE.BackSide} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Planet with icon + name inside */}
      <Html center position={[0, 0, 0]} zIndexRange={[3, 0]} occlude={false}>
        <div
          className="flex flex-col items-center transition-all duration-200"
          style={{ pointerEvents: 'auto' }}
          onMouseEnter={(e) => {
            e.stopPropagation()
            onHover(tech, e)
          }}
          onMouseLeave={() => onHover(null)}
          onClick={(e) => {
            e.stopPropagation()
            onClick(tech)
          }}
        >
          <div
            className="w-14 h-14 rounded-full flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-xl"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${category.color}50, ${category.color}15)`,
              border: `1.5px solid ${category.color}60`,
              boxShadow: `0 0 25px ${category.color}25, inset 0 0 15px ${category.color}10`,
            }}
          >
            {tech.icon ? (
              <tech.icon className="text-lg" style={{ color: '#fff' }} />
            ) : (
              <span className="text-base font-bold text-white">{tech.name[0]}</span>
            )}
            <span className="text-[7px] text-white/90 font-semibold leading-tight">{tech.name}</span>
          </div>
        </div>
      </Html>
    </group>
  )
}

/* ─── Scene Content ─── */
function SceneContent({ category, onTechClick, onTechHover }) {
  const radius = 2.6

  const handleClick = useCallback((tech) => onTechClick(tech), [onTechClick])
  const handleHover = useCallback((tech, e) => onTechHover(tech, e), [onTechHover])

  return (
    <>
      <SceneSetup />
      <ambientLight intensity={0.2} />
      <hemisphereLight args={['#6688ff', '#222244', 0.2]} />
      <Stars />
      <ParticleField />
      <CenterPlanet category={category} />
      <OrbitRing radius={radius} color={category.color} />
      {category.skills.map((tech, i) => (
        <TechItem
          key={tech.name}
          tech={tech}
          idx={i}
          total={category.skills.length}
          radius={radius}
          category={category}
          onHover={handleHover}
          onClick={handleClick}
        />
      ))}
      <OrbitControls
        enableDamping
        dampingFactor={0.06}
        minDistance={1.5}
        maxDistance={6}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 1.8}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </>
  )
}

/* ─── Main Export ─── */
export default function GalaxyScene({ category, onTechClick, onTechHover }) {
  return (
    <Canvas
      camera={{ position: [0, 1, 4.8], fov: 50 }}
      gl={{ antialias: true, alpha: false }}
      style={{ width: '100%', height: '100%' }}
    >
      <SceneContent category={category} onTechClick={onTechClick} onTechHover={onTechHover} />
    </Canvas>
  )
}
