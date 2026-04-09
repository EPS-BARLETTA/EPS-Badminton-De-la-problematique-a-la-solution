import { useNavigate } from 'react-router-dom'

function ExerciseCard({ exercise }) {
  const navigate = useNavigate()
  return (
    <article className="exercise-card">
      <div className="exercise-media">
        <img src={exercise.image} alt="" loading="lazy" />
      </div>
      <div className="exercise-content">
        <p className="eyebrow">Page {exercise.page}</p>
        <h3>{exercise.title}</h3>
        {exercise.objective && <p className="muted">{exercise.objective}</p>}
        <button
          type="button"
          className="primary full-width"
          onClick={() => navigate(`/exercices/${exercise.slug}`)}
        >
          Voir l’exercice
        </button>
      </div>
    </article>
  )
}

export default ExerciseCard
