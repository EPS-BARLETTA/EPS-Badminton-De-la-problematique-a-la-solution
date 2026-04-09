import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ExerciseCard from '../components/ExerciseCard.jsx'
import { problematics } from '../data/data.js'

function ProblemDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const problem = useMemo(() => problematics.find((entry) => entry.id === slug), [slug])

  if (!problem) {
    return (
      <section className="panel">
        <h2>Problématique introuvable</h2>
        <p>Le lien consulté ne correspond à aucune problématique du livret.</p>
        <button type="button" className="primary" onClick={() => navigate('/problemes')}>
          Retourner à la liste
        </button>
      </section>
    )
  }

  return (
    <section className="panel">
      <header className="section-header">
        <p className="eyebrow">Parcours</p>
        <h2>{problem.title}</h2>
        <p>{problem.description}</p>
      </header>
      <div className="exercise-grid">
        {problem.exercises.map((exercise) => (
          <ExerciseCard key={exercise.slug} exercise={exercise} />
        ))}
      </div>
    </section>
  )
}

export default ProblemDetail
