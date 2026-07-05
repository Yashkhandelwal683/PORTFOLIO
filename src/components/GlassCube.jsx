import { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, useCursor } from '@react-three/drei'
import * as THREE from 'three'

/* ─── Face Data Map ─── */
const faceConfig = {
  frontend: { position: [0, 0, 1.51], rotation: [0, 0, 0] },
  backend: { position: [0, 0, -1.51], rotation: [0, Math.PI, 0] },
  database: { position: [-1.51, 0, 0], rotation: [0, -Math.PI / 2, 0] },
  tools: { position: [1.51, 0, 0], rotation: [0, Math.PI / 2, 0] },
  languages: { position: [0, 1.51, 0], rotation: [-Math.PI / 2, 0, 0] },
  cloud: { position: [0, -1.51, 0], rotation: [Math.PI / 2, 0, 0] },
}

const faceRotationTarget = {
  frontend: new THREE.Euler(0, 0, 0),
  backend: new THREE.Euler(0, Math.PI, 0),
  database: new THREE.Euler(0, -Math.PI / 2, 0),
  tools: new THREE.Euler(0, Math.PI / 2, 0),
  languages: new THREE.Euler(-Math.PI / 2, 0, 0),
  cloud: new THREE.Euler(Math.PI / 2, 0, 0),
}

/* ─── Face Styles ─── */
const faceStyles = {
  frontend: {
    pattern: 'linear-gradient(135deg, #00F5FF08, #00F5FF02)',
    borderGlow: '#00F5FF',
    iconBg: 'radial-gradient(circle at 40% 40%, #00F5FF30, #00F5FF10)',
    decor: '< />',
  },
  backend: {
    pattern: 'linear-gradient(135deg, #7B61FF08, #7B61FF02)',
    borderGlow: '#7B61FF',
    iconBg: 'radial-gradient(circle at 40% 40%, #7B61FF30, #7B61FF10)',
    decor: '{ }',
  },
  database: {
    pattern: 'repeating-linear-gradient(0deg, #00ED6408 0px, #00ED6408 1px, transparent 1px, transparent 6px)',
    borderGlow: '#00ED64',
    iconBg: 'radial-gradient(circle at 40% 40%, #00ED6430, #00ED6410)',
    decor: 'Ⅲ',
  },
  tools: {
    pattern: 'radial-gradient(circle at 30% 50%, #007ACC08, transparent 60%)',
    borderGlow: '#007ACC',
    iconBg: 'radial-gradient(circle at 40% 40%, #007ACC30, #007ACC10)',
    decor: '⚙',
  },
  languages: {
    pattern: 'linear-gradient(0deg, #FFD70008, transparent 60%)',
    borderGlow: '#FFD700',
    iconBg: 'radial-gradient(circle at 40% 40%, #FFD70030, #FFD70010)',
    decor: '{;}',
  },
  cloud: {
    pattern: 'linear-gradient(135deg, #FF990008 30%, transparent 70%)',
    borderGlow: '#FF9900',
    iconBg: 'radial-gradient(circle at 40% 40%, #FF990030, #FF990010)',
    decor: '☁',
  },
}

/* ─── Frontend Face ─── */
function FrontendFace({ face, hovered }) {
  const Icon = face.icon
  return (
    <>
      <div style={{ position: 'absolute', top: 8, left: 10, fontSize: 8, color: '#00F5FF25', fontFamily: 'monospace', fontWeight: 700 }}>
        &lt;div&gt;
      </div>
      <div style={{ position: 'absolute', bottom: 8, right: 10, fontSize: 8, color: '#00F5FF20', fontFamily: 'monospace', fontWeight: 700 }}>
        &lt;/div&gt;
      </div>
      <div
        style={{
          width: 40, height: 40, borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: faceStyles.frontend.iconBg,
          border: '1px solid #00F5FF40',
          transform: hovered ? 'scale(1.1) rotate(-5deg)' : 'scale(1) rotate(0deg)',
          transition: 'all 0.3s ease',
        }}
      >
        <Icon style={{ color: '#00F5FF', fontSize: 20 }} />
      </div>
      <span style={{ color: '#fff', fontWeight: 700, fontSize: 13, letterSpacing: '0.04em' }}>{face.label}</span>
      <span style={{ color: '#00F5FF99', fontSize: 8, fontFamily: 'monospace' }}>UI / UX</span>
      <span style={{ color: '#aaa', fontSize: 9, fontWeight: 500 }}>{face.skills.length} Technologies</span>
    </>
  )
}

/* ─── Backend Face ─── */
function BackendFace({ face, hovered }) {
  const Icon = face.icon
  return (
    <>
      <div style={{ position: 'absolute', top: 8, right: 10, width: 20, height: 20, border: '1px solid #7B61FF20', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', bottom: 12, left: 10, width: 12, height: 12, border: '1px solid #7B61FF15', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', top: '50%', left: 6, width: 4, height: 4, borderRadius: '50%', background: '#7B61FF15' }} />
      <div
        style={{
          width: 40, height: 40, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: faceStyles.backend.iconBg,
          border: '1px solid #7B61FF40',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'all 0.3s ease',
        }}
      >
        <Icon style={{ color: '#7B61FF', fontSize: 20 }} />
      </div>
      <span style={{ color: '#fff', fontWeight: 700, fontSize: 13, letterSpacing: '0.04em' }}>{face.label}</span>
      <span style={{ color: '#7B61FF99', fontSize: 8 }}>API / Server</span>
      <span style={{ color: '#aaa', fontSize: 9, fontWeight: 500 }}>{face.skills.length} Technologies</span>
    </>
  )
}

/* ─── Database Face ─── */
function DatabaseFace({ face, hovered }) {
  const Icon = face.icon
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, #00ED6408 0px, #00ED6408 1px, transparent 1px, transparent 8px)', borderRadius: 20 }} />
      <div style={{ position: 'absolute', top: 10, left: 10, width: 8, height: 16, border: '1px solid #00ED6420', borderRadius: '0 0 4px 4px', borderTop: 'none' }} />
      <div style={{ position: 'absolute', bottom: 10, right: 10, width: 8, height: 16, border: '1px solid #00ED6420', borderRadius: '0 0 4px 4px', borderTop: 'none' }} />
      <div
        style={{
          width: 40, height: 36, borderRadius: '4px 4px 10px 10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: faceStyles.database.iconBg,
          border: '1px solid #00ED6440',
          transform: hovered ? 'scale(1.1) translateY(-2px)' : 'scale(1)',
          transition: 'all 0.3s ease',
        }}
      >
        <Icon style={{ color: '#00ED64', fontSize: 18 }} />
      </div>
      <span style={{ color: '#fff', fontWeight: 700, fontSize: 13, letterSpacing: '0.04em' }}>{face.label}</span>
      <span style={{ color: '#00ED6499', fontSize: 8 }}>SQL / NoSQL</span>
      <span style={{ color: '#aaa', fontSize: 9, fontWeight: 500 }}>{face.skills.length} Technologies</span>
    </>
  )
}

/* ─── Tools Face ─── */
function ToolsFace({ face, hovered }) {
  const Icon = face.icon
  return (
    <>
      <div style={{ position: 'absolute', top: 8, right: 8, width: 14, height: 14, borderRadius: '50%', border: '1.5px solid #007ACC15', borderTopColor: '#007ACC30', animation: 'none' }} />
      <div style={{ position: 'absolute', bottom: 8, left: 8, width: 14, height: 14, borderRadius: '50%', border: '1.5px solid #007ACC15', borderTopColor: '#007ACC30' }} />
      <div style={{ position: 'absolute', top: '45%', right: 8, width: 6, height: 6, borderRadius: 1, background: '#007ACC10', transform: 'rotate(45deg)' }} />
      <div
        style={{
          width: 40, height: 40, borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: faceStyles.tools.iconBg,
          border: '1px solid #007ACC40',
          transform: hovered ? 'scale(1.1) rotate(90deg)' : 'scale(1) rotate(0deg)',
          transition: 'all 0.4s ease',
        }}
      >
        <Icon style={{ color: '#007ACC', fontSize: 20 }} />
      </div>
      <span style={{ color: '#fff', fontWeight: 700, fontSize: 13, letterSpacing: '0.04em' }}>{face.label}</span>
      <span style={{ color: '#007ACC99', fontSize: 8 }}>Dev Tools</span>
      <span style={{ color: '#aaa', fontSize: 9, fontWeight: 500 }}>{face.skills.length} Technologies</span>
    </>
  )
}

/* ─── Languages Face ─── */
function LanguagesFace({ face, hovered }) {
  const Icon = face.icon
  return (
    <>
      <div style={{ position: 'absolute', top: 6, left: 8, fontSize: 7, color: '#FFD70015', fontFamily: 'monospace', fontWeight: 700 }}>function()</div>
      <div style={{ position: 'absolute', bottom: 6, right: 8, fontSize: 7, color: '#FFD70015', fontFamily: 'monospace' }}>console.log()</div>
      <div
        style={{
          width: 40, height: 40, border: '1px solid #FFD70030',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: faceStyles.languages.iconBg,
          transform: hovered ? 'scale(1.1) skewX(-2deg)' : 'scale(1)',
          transition: 'all 0.3s ease',
        }}
      >
        <Icon style={{ color: '#FFD700', fontSize: 20 }} />
      </div>
      <span style={{ color: '#fff', fontWeight: 700, fontSize: 13, letterSpacing: '0.04em' }}>{face.label}</span>
      <span style={{ color: '#FFD70099', fontSize: 8, fontFamily: 'monospace' }}>JS / Java / TS</span>
      <span style={{ color: '#aaa', fontSize: 9, fontWeight: 500 }}>{face.skills.length} Languages</span>
    </>
  )
}

/* ─── Cloud Face ─── */
function CloudFace({ face, hovered }) {
  const Icon = face.icon
  return (
    <>
      <div style={{ position: 'absolute', top: 8, right: 12, width: 6, height: 6, borderRadius: '50%', background: '#FF990015', boxShadow: '0 0 0 4px #FF990008' }} />
      <div style={{ position: 'absolute', bottom: 20, left: 8, width: 4, height: 4, borderRadius: '50%', background: '#FF990015' }} />
      <div style={{ position: 'absolute', top: 20, left: 8, width: 3, height: 3, borderRadius: '50%', background: '#FF990010' }} />
      <div
        style={{
          width: 44, height: 32, borderRadius: '16px 16px 8px 8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: faceStyles.cloud.iconBg,
          border: '1px solid #FF990040',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'all 0.3s ease',
        }}
      >
        <Icon style={{ color: '#FF9900', fontSize: 16 }} />
      </div>
      <span style={{ color: '#fff', fontWeight: 700, fontSize: 13, letterSpacing: '0.04em' }}>{face.label}</span>
      <span style={{ color: '#FF990099', fontSize: 8 }}>Cloud / DevOps</span>
      <span style={{ color: '#aaa', fontSize: 9, fontWeight: 500 }}>{face.skills.length} Technologies</span>
    </>
  )
}

/* ─── Face Dispatcher ─── */
const faceRenderers = {
  frontend: FrontendFace,
  backend: BackendFace,
  database: DatabaseFace,
  tools: ToolsFace,
  languages: LanguagesFace,
  cloud: CloudFace,
}

/* ─── Cube Face ─── */
function CubeFace({ face, isSelected, onHover, onClick }) {
  const [hovered, setHovered] = useState(false)
  const cfg = faceConfig[face.id]
  const fs = faceStyles[face.id]
  const FaceRenderer = faceRenderers[face.id]
  useCursor(hovered || isSelected, 'pointer', 'grab')

  return (
    <group position={cfg.position} rotation={cfg.rotation}>
      <mesh
        onPointerEnter={() => { setHovered(true); onHover(face.id) }}
        onPointerLeave={() => { setHovered(false); onHover(null) }}
        onClick={(e) => { e.stopPropagation(); onClick(face) }}
      >
        <planeGeometry args={[2.82, 2.82]} />
        <meshBasicMaterial transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      <Html transform occlude={false} center style={{ pointerEvents: 'none' }}>
        <div
          className="flex flex-col items-center justify-center gap-1.5 select-none"
          style={{
            position: 'relative',
            width: 150,
            height: 150,
            background: hovered || isSelected
              ? fs.pattern
              : 'rgba(255,255,255,0.015)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${hovered || isSelected ? face.color + '60' : 'rgba(255,255,255,0.06)'}`,
            borderRadius: 20,
            transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
            transform: hovered || isSelected ? 'scale(1.06)' : 'scale(1)',
            boxShadow: hovered || isSelected
              ? `0 0 40px ${face.color}25, 0 0 80px ${face.color}10, inset 0 0 40px ${face.color}08`
              : '0 0 0px transparent',
            overflow: 'hidden',
          }}
        >
          <FaceRenderer face={face} hovered={hovered || isSelected} />
        </div>
      </Html>
    </group>
  )
}

/* ─── Stars ─── */
function Stars() {
  const ref = useRef()
  const positions = useMemo(() => {
    const p = new Float32Array(600 * 3)
    for (let i = 0; i < 600; i++) {
      p[i * 3] = (Math.random() - 0.5) * 60
      p[i * 3 + 1] = (Math.random() - 0.5) * 60
      p[i * 3 + 2] = (Math.random() - 0.5) * 60
    }
    return p
  }, [])

  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += d * 0.008
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={600} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.08} color="#aabbdd" transparent opacity={0.3} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}

/* ─── Scene ─── */
function Scene({ faces, selectedFace, onFaceClick, onFaceHover }) {
  const groupRef = useRef()
  const { gl } = useThree()
  const isDragging = useRef(false)
  const prevPointer = useRef({ x: 0, y: 0 })
  const autoRotate = useRef(true)
  const animating = useRef(false)
  const targetEuler = useRef(new THREE.Euler(0, 0, 0))

  useEffect(() => {
    const canvas = gl.domElement

    const onDown = (e) => {
      if (animating.current) return
      isDragging.current = true
      autoRotate.current = false
      prevPointer.current = { x: e.clientX, y: e.clientY }
      canvas.style.cursor = 'grabbing'
    }

    const onMove = (e) => {
      if (isDragging.current && groupRef.current) {
        const dx = e.clientX - prevPointer.current.x
        const dy = e.clientY - prevPointer.current.y
        groupRef.current.rotation.y += dx * 0.008
        groupRef.current.rotation.x += dy * 0.008
        prevPointer.current = { x: e.clientX, y: e.clientY }
      }
    }

    const onUp = () => {
      isDragging.current = false
      canvas.style.cursor = 'grab'
    }

    canvas.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)

    return () => {
      canvas.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [gl])

  const handleFaceClick = useCallback((face) => {
    if (animating.current) return
    animating.current = true
    autoRotate.current = false

    const target = faceRotationTarget[face.id]
    targetEuler.current.copy(target)

    setTimeout(() => {
      animating.current = false
      onFaceClick(face)
    }, 500)
  }, [onFaceClick])

  const handleHover = useCallback((id) => {
    onFaceHover(id)
  }, [onFaceHover])

  useFrame((_, delta) => {
    if (!groupRef.current) return

    if (animating.current) {
      groupRef.current.rotation.x += (targetEuler.current.x - groupRef.current.rotation.x) * 0.06
      groupRef.current.rotation.y += (targetEuler.current.y - groupRef.current.rotation.y) * 0.06
      groupRef.current.rotation.z += (targetEuler.current.z - groupRef.current.rotation.z) * 0.06
    } else if (!isDragging.current && autoRotate.current) {
      groupRef.current.rotation.y += delta * 0.2
      groupRef.current.rotation.x += Math.sin(Date.now() * 0.0004) * delta * 0.04
    }
  })

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 5, 5]} intensity={0.5} />
      <pointLight position={[-4, 3, -4]} intensity={0.25} color="#00F5FF" />
      <pointLight position={[4, -3, 4]} intensity={0.15} color="#7B61FF" />

      <Stars />

      <group ref={groupRef}>
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(3, 3, 3)]} />
          <lineBasicMaterial color="rgba(255,255,255,0.08)" transparent />
        </lineSegments>

        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(2.96, 2.96, 2.96)]} />
          <lineBasicMaterial color="#00F5FF" opacity={0.06} transparent />
        </lineSegments>

        {faces.map((face) => (
          <CubeFace
            key={face.id}
            face={face}
            isSelected={selectedFace?.id === face.id}
            onHover={handleHover}
            onClick={handleFaceClick}
          />
        ))}
      </group>
    </>
  )
}

/* ─── Main ─── */
export default function GlassCube({ faces, selectedFace, onFaceClick, onFaceHover }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%', cursor: 'grab' }}
      dpr={[1, 1.5]}
    >
      <Scene
        faces={faces}
        selectedFace={selectedFace}
        onFaceClick={onFaceClick}
        onFaceHover={onFaceHover}
      />
    </Canvas>
  )
}
