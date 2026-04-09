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
  const sections = [
    { title: 'Objectif', value: exercise.objective, type: 'text' },
    { title: 'But', value: exercise.goal, type: 'text' },
    { title: 'Consignes', value: exercise.instructions, type: 'list' },
    { title: 'Variantes', value: exercise.variants, type: 'list' },
    { title: 'Critères de réussite', value: exercise.successCriteria, type: 'list' },
    { title: 'Critères de réalisation', value: exercise.executionTips, type: 'list' },
  ]

  return (
    <article className="panel exercise-detail">
      <header className="exercise-header">
        <div>
          <p className="eyebrow">{parent ? parent.title : 'Exercice'}</p>
          <h2>{exercise.title}</h2>
          <p className="muted">Page {exercise.page}</p>
        </div>
        <button type="button" className="ghost" onClick={() => navigate(-1)}>
          Retour à la liste
        </button>
      </header>
      <div className="exercise-visual">
        <img src={exercise.image} alt={`Planche ${exercise.title}`} loading="lazy" />
      </div>
      <div className="exercise-sections">
        {sections.map((section) => {
          if (
            !section.value ||
            (Array.isArray(section.value) && section.value.length === 0) ||
            (typeof section.value === 'string' && !section.value.trim())
          ) {
            return null
          }
          return (
            <section key={section.title} className="exercise-section">
              <h3>{section.title}</h3>
              {section.type === 'list' && Array.isArray(section.value) ? (
                <ul>
                  {section.value.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>{section.value}</p>
              )}
            </section>
          )
        })}
      </div>
    </article>
  )
}

export default ExerciseDetail
