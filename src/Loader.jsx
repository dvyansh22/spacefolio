import { Html, useProgress } from "@react-three/drei"
import { useEffect, useState } from "react"

export default function Loader() {
  const { progress } = useProgress()
  const [displayProgress, setDisplayProgress] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (progress > displayProgress) {
      setDisplayProgress(progress)
    }

    if (progress >= 100) {
      setTimeout(() => {
        setVisible(false)
      }, 500)
    }
  }, [progress])

  if (!visible) return null

  return (
    <Html center>
      <div style={{
        width: "100vw",
        height: "100vh",
        background: "radial-gradient(circle at center, #0a0f1f 0%, #000000 70%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#00f0ff",
        fontFamily: "Orbitron, sans-serif",
        letterSpacing: "3px"
      }}>
        
        <h1 style={{
          fontSize: "22px",
          marginBottom: "30px",
          textShadow: "0 0 15px #00f0ff"
        }}>
          INITIALIZING
        </h1>

        <div style={{
          width: "240px",
          height: "6px",
          background: "#111",
          borderRadius: "4px",
          overflow: "hidden",
          boxShadow: "0 0 20px #00f0ff33"
        }}>
          <div style={{
            width: `${displayProgress}%`,
            height: "100%",
            background: "linear-gradient(90deg, #00f0ff, #0077ff)",
            boxShadow: "0 0 15px #00f0ff",
            transition: "width 0.3s ease"
          }} />
        </div>

        <p style={{
          marginTop: "15px",
          fontSize: "14px",
          color: "#aaa"
        }}>
          {displayProgress.toFixed(0)}%
        </p>

      </div>
    </Html>
  )
}