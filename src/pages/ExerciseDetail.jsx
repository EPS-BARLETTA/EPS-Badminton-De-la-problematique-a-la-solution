import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { exercisesBySlug, problematics } from '../data/data.js'

function ExerciseDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const exercise = useMemo(() => exercisesBySlug.get(slug), [slug])

  if (!exercise) {
    return (
      <section className="panel">
        <h2>Exercice introuvable</h2>
        <p>Impossible d’afficher cette fiche pour le moment.</p>
        <button type="button" className="primary" onClick={() => navigate('/problemes')}>
          Voir toutes les problématiques
        </button>
      </section>
    )
  }

  const parent = problematics.find((problem) => problem.id === exercise.categoryId)

  return (
    <article className="panel exercise-detail">
      <header className="exercise-header">
        <div>
          <p className="eyebrow">{parent ? parent.title : 'Exercice'}</p>
          <h2>{exercise.title}</h2>
        </div>
        <button type="button" className="ghost" onClick={() => navigate(-1)}>
          Retour à la liste
        </button>
      </header>

      <div className="exercise-visual">
        <img src={exercise.image} alt={`Fiche ${exercise.title}`} loading="lazy" />
      </div>
    </article>
  )
}

export default ExerciseDetail
