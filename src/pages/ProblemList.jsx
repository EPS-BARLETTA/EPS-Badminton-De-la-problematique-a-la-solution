import { useNavigate } from 'react-router-dom'
import { problematics } from '../data/data.js'

function ProblemList() {
  const navigate = useNavigate()
  return (
    <section className="panel">
      <header className="section-header">
        <p className="eyebrow">Étape 1</p>
        <h2>Choisissez une problématique</h2>
        <p>Chaque catégorie regroupe les exercices extraits automatiquement du livret PDF.</p>
      </header>
      <div className="card-grid">
        {problematics.map((problem) => (
          <article key={problem.id} className="problem-card">
            <p className="eyebrow">{problem.exercises.length} situations</p>
            <h3>{problem.title}</h3>
            <p>{problem.description}</p>
            <button
              type="button"
              className="primary full-width"
              onClick={() => navigate(`/problemes/${problem.id}`)}
            >
              Voir la progression
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ProblemList
