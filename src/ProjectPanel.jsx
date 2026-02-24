import "./panel.css"

export default function ProjectPanel({ project, onClose }) {
  if (!project) return null

  return (
    <div className="panel">
      <h1>{project.title}</h1>
      <p>{project.description}</p>
      <p><strong>Tech:</strong> {project.tech}</p>
      <button onClick={onClose}>Close</button>
    </div>
  )
}