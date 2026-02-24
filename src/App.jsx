import React, { useState, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import Scene from "./Scene"
import Overlay from "./Overlay"
import Loader from "./Loader"
import "./style.css"

function App() {
  const [activeSection, setActiveSection] = useState(null)

  return (
    <>
      <Canvas
        camera={{ position: [0, 50, 200], fov: 60 }}
        gl={{ alpha: true }}
        style={{ background: "transparent" }}
      >
        <color attach="background" args={["#000000"]} />

        <Suspense fallback={<Loader />}>
          <Scene setActiveSection={setActiveSection} />
        </Suspense>

      </Canvas>

      <Overlay activeSection={activeSection} />
    </>
  )
}

export default App