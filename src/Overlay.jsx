import React, { useEffect, useState } from "react"

const sections = [
  { 
    name: "Divyansh Krishna", 
    content: `
<span class="bullet">▸</span> B.Tech Computer Science (Blockchain Technology), VIT Vellore<br/>
<span class="bullet">▸</span> Specialized in secure distributed systems and scalable backend architectures<br/>
<span class="bullet">▸</span> Design and deploy production-ready applications across backend, mobile, and edge platforms<br/>
<span class="bullet">▸</span> Strong foundation in system design, networking principles, and performance optimization<br/>
<span class="bullet">▸</span> Integrate cryptographic security models and blockchain-backed validation mechanisms<br/>
<span class="bullet">▸</span> Engineer reliable, modular systems optimized for real-world scalability and maintainability
    `
  },

{ 
  name: "About Me", 
  content: `
<span class="bullet">▸</span> I enjoy building systems that are secure, efficient, and practical to deploy in real-world environments<br/>
<span class="bullet">▸</span> Most of my work revolves around backend development, real-time communication, and performance optimization<br/>
<span class="bullet">▸</span> I focus on writing clean, modular code that scales well and remains easy to maintain<br/>
<span class="bullet">▸</span> Experienced in implementing authentication systems, API design, database structuring, and edge ML deployment<br/>
<span class="bullet">▸</span> I like understanding how things work internally — from network flow to data processing — before building solutions<br/>
<span class="bullet">▸</span> Always exploring better ways to design reliable and secure software systems
  `
},

  { 
    name: "Projects", 
    content: `
<span class="bullet">▸</span> CITADEL: AES-256 + ECC hybrid encryption with blockchain node validation and ESP32 hardware integration<br/>
<span class="bullet">▸</span> Designed tamper-resistant distributed communication preventing replay and interception attacks<br/>
<span class="bullet">▸</span> Fruit Ripeness Detection: Trained YOLOv8 (92% mAP) on 10k+ dataset and deployed via TensorFlow Lite<br/>
<span class="bullet">▸</span> Integrated dual-camera edge inference system with Flutter-based analytics dashboard<br/>
<span class="bullet">▸</span> RePlate: ML-driven demand forecasting reducing inventory mismatch by 22% across warehouses<br/>
<span class="bullet">▸</span> TraveLink: MERN stack platform handling 5k+ daily API requests with secure JWT authentication
    `
  },

  { 
    name: "Experience & Leadership", 
    content: `
<span class="bullet">▸</span> App Developer Intern — K12 Techno Services (Bengaluru)<br/>
&nbsp;&nbsp;&nbsp;<span class="bullet small">▶</span> Built production Flutter applications serving 1,000+ active users<br/>
&nbsp;&nbsp;&nbsp;<span class="bullet small">▶</span> Reduced backend API latency by 30% via indexing, caching, and optimized queries<br/>
&nbsp;&nbsp;&nbsp;<span class="bullet small">▶</span> Engineered JWT authentication, RBAC authorization, and WebSocket real-time sync (40% latency reduction)<br/>
<span class="bullet">▸</span> Founding Board Member & Vice Chairperson — The WhiteHats Club<br/>
&nbsp;&nbsp;&nbsp;<span class="bullet small">▶</span> Led 100+ member technical community and organized national hackathon<br/>
&nbsp;&nbsp;&nbsp;<span class="bullet small">▶</span> Architected CTF infrastructure and mentored members in ML and distributed systems
    `
  },

{ 
  name: "Achievements & Contact", 
  content: `
<span class="bullet">▸</span> Yantra Central Hack Winner 2025 — AI/ML Developer<br/>
<span class="bullet">▸</span> Yantra Central Hack Winner 2026 — Team Lead (Cybersecurity + Blockchain)<br/>
<span class="bullet">▸</span> Certified in Flutter Development and Applied AI/ML Engineering<br/>
<span class="bullet">▸</span> Active contributor to secure, scalable backend and edge computing systems<br/>
<span class="bullet">▸</span> View Resume: <a href='/resume.pdf' target='_blank'>Click Here</a><br/>
<span class="bullet">▸</span> GitHub: <a href='https://github.com/dvyansh22' target='_blank'>github.com/dvyansh22</a><br/>
<span class="bullet">▸</span> LinkedIn: <a href='https://www.linkedin.com/in/divyanshkrishna' target='_blank'>linkedin.com/in/divyanshkrishna</a><br/>
<span class="bullet">▸</span> Email: <a href='mailto:divyanshkrishna3@gmail.com'>divyanshkrishna3@gmail.com</a>
  `
}
]

const colors = [
  "#00ffff",
  "#ff00ff",
  "#00ff88",
  "#ffaa00",
  "#ff0044"
]

function Overlay({ activeSection }) {
  const [booting, setBooting] = useState(true)
  const [shuttingDown, setShuttingDown] = useState(false)

  const section = sections[activeSection]

  useEffect(() => {
    if (activeSection === null) {
      setShuttingDown(true)
      setTimeout(() => setShuttingDown(false), 600)
      return
    }

    setBooting(true)
    const timer = setTimeout(() => setBooting(false), 800)

    return () => clearTimeout(timer)
  }, [activeSection])

  useEffect(() => {
    const handleMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 12
      const y = (e.clientY / window.innerHeight - 0.5) * 12
      const device = document.querySelector(".device")
      if (device) {
        device.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`
      }
    }

    window.addEventListener("mousemove", handleMove)
    return () => window.removeEventListener("mousemove", handleMove)
  }, [])

  if (activeSection === null && !shuttingDown) return null

  return (
    <div className="device-wrapper">
      <div
        className={`device ${shuttingDown ? "shutdown" : ""}`}
        style={{ "--hud-color": colors[activeSection || 0] }}
      >
        <div className="side-buttons left"></div>
        <div className="side-buttons right"></div>

        <div className="screw tl"></div>
        <div className="screw tr"></div>
        <div className="screw bl"></div>
        <div className="screw br"></div>

        <div className="led-strip"></div>

        <div className="device-screen">
          <div className="glass-layer"></div>
          <div className="curvature"></div>
          <div className="grid-bg"></div>

          {booting && <div className="boot-sequence"></div>}
          {shuttingDown && <div className="shutdown-sequence"></div>}

          {!booting && !shuttingDown && activeSection !== null && (
            <div className="hud-content">
              <h1>{section.name}</h1>
              <p dangerouslySetInnerHTML={{ __html: section.content }} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Overlay