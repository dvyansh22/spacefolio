import React, { useRef, useEffect, useState, useMemo } from "react"
import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import gsap from "gsap"
import * as THREE from "three"

/* ========================= */
/* STAR TEXTURE */
/* ========================= */

function createStarTexture() {
  const size = 64
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")

  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  )

  gradient.addColorStop(0, "rgba(255,255,255,1)")
  gradient.addColorStop(0.3, "rgba(255,255,255,0.8)")
  gradient.addColorStop(1, "rgba(255,255,255,0)")

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  return new THREE.CanvasTexture(canvas)
}

/* ========================= */
/* STARFIELD */
/* ========================= */

function StarField() {
  const ref = useRef()
  const texture = useMemo(() => createStarTexture(), [])

  const positions = useMemo(() => {
    const arr = []
    for (let i = 0; i < 120000; i++) {
      arr.push(
        (Math.random() - 0.5) * 8000,
        (Math.random() - 0.5) * 8000,
        (Math.random() - 0.5) * 8000
      )
    }
    return new Float32Array(arr)
  }, [])

  useFrame(({ camera }) => {
    if (ref.current) ref.current.position.copy(camera.position)
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        map={texture}
        size={4}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

/* ========================= */
/* PLANET + SHIP DATA */
/* ========================= */

const planetsData = [
  { file: "/models/planet1.glb", position: new THREE.Vector3(-120, 40, -300) },
  { file: "/models/planet2.glb", position: new THREE.Vector3(160, 60, -700) },
  { file: "/models/planet3.glb", position: new THREE.Vector3(-200, 80, -1100) },
  { file: "/models/planet4.glb", position: new THREE.Vector3(240, 50, -1500) },
  { file: "/models/planet5.glb", position: new THREE.Vector3(-280, 90, -1900) }
]

function normalizeAngle(angle) {
  while (angle > Math.PI) angle -= Math.PI * 2
  while (angle < -Math.PI) angle += Math.PI * 2
  return angle
}

/* ========================= */
/* PLANET */
/* ========================= */

function Planet({ file, position }) {
  const { scene } = useGLTF(file)
  const ref = useRef()
  const [model, setModel] = useState()

  useEffect(() => {
    const cloned = scene.clone(true)
    const box = new THREE.Box3().setFromObject(cloned)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())

    cloned.position.sub(center)
    cloned.scale.setScalar(200 / Math.max(size.x, size.y, size.z))
    setModel(cloned)
  }, [scene])

  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.002
  })

  if (!model) return null
  return <primitive ref={ref} object={model} position={position} />
}

/* ========================= */
/* SPACESHIP */
/* ========================= */

const Spaceship = React.forwardRef(({ position }, ref) => {
  const { scene } = useGLTF("/models/spaceship/scene.gltf")
  const [model, setModel] = useState()

  useEffect(() => {
    const cloned = scene.clone(true)
    const box = new THREE.Box3().setFromObject(cloned)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())

    cloned.position.sub(center)
    cloned.scale.setScalar(40 / Math.max(size.x, size.y, size.z))

    setModel(cloned)
  }, [scene])

  if (!model) return null
  return <primitive ref={ref} object={model} position={position} />
})

/* ========================= */
/* MAIN SCENE */
/* ========================= */

function Scene({ setActiveSection }) {
  const shipRef = useRef()
  const [index, setIndex] = useState(0)

  const isAnimating = useRef(false)
  const hudLocked = useRef(false)

  const shipPosition = useRef(new THREE.Vector3(-120, 40, -100))
  const currentRotationY = useRef(0)

  const showHUD = (i) => {
    hudLocked.current = true
    setActiveSection(i)

    setTimeout(() => {
      hudLocked.current = false
    }, 3000)
  }

  const travelTo = (i) => {
    if (isAnimating.current || hudLocked.current) return

    isAnimating.current = true
    setActiveSection(null)

    const start = shipPosition.current.clone()
    const planetPos = planetsData[i].position.clone()
    const end = planetPos.clone()
    end.z += 150

    const direction = new THREE.Vector3().subVectors(end, start).normalize()
    const perpendicular = new THREE.Vector3(-direction.z, 0, direction.x)
    const turnDirection = end.x > start.x ? 1 : -1

    const midPoint = new THREE.Vector3()
      .addVectors(start, end)
      .multiplyScalar(0.5)
      .add(perpendicular.multiplyScalar(240 * turnDirection))

    midPoint.y += 140

    const curve = new THREE.QuadraticBezierCurve3(start, midPoint, end)
    const temp = { t: 0 }

    gsap.to(temp, {
      t: 1,
      duration: 6,
      ease: "power3.inOut",
      onUpdate: () => {
        shipPosition.current.copy(curve.getPoint(temp.t))
      },
      onComplete: () => {
        isAnimating.current = false
        showHUD(i)
      }
    })
  }

  useEffect(() => {
    travelTo(0)
  }, [])

  useEffect(() => {
    const handleScroll = (e) => {
      if (isAnimating.current || hudLocked.current) return

      if (e.deltaY > 0 && index < planetsData.length - 1) {
        const next = index + 1
        setIndex(next)
        travelTo(next)
      }

      if (e.deltaY < 0 && index > 0) {
        const next = index - 1
        setIndex(next)
        travelTo(next)
      }
    }

    window.addEventListener("wheel", handleScroll, { passive: true })
    return () => window.removeEventListener("wheel", handleScroll)
  }, [index])

  useFrame(({ camera }) => {
    if (!shipRef.current) return

    shipRef.current.position.copy(shipPosition.current)

    const target = planetsData[index].position
    const dx = target.x - shipPosition.current.x
    const dz = target.z - shipPosition.current.z

    let desiredAngle = Math.atan2(dx, dz)
    let delta = normalizeAngle(desiredAngle - currentRotationY.current)

    currentRotationY.current += delta * 0.08
    shipRef.current.rotation.y = currentRotationY.current

    camera.position.lerp(
      new THREE.Vector3(
        shipPosition.current.x,
        shipPosition.current.y + 30,
        shipPosition.current.z + 120
      ),
      0.05
    )

    camera.lookAt(shipPosition.current)
  })

  return (
    <>
      <ambientLight intensity={1} />
      <StarField />

      {planetsData.map((planet, i) => (
        <Planet key={i} file={planet.file} position={planet.position} />
      ))}

      <Spaceship ref={shipRef} position={shipPosition.current} />
    </>
  )
}

export default Scene