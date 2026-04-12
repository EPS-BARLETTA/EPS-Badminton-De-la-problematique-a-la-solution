import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  return (
    <section className="panel hero-panel">
      <p className="eyebrow">Livret EPS Badminton 2026 FFB</p>

      <h2>BADMINTON EPS – Parcours Problèmes & Progression</h2>

      <p>
        Accédez rapidement aux situations du livret pour organiser vos séances et projeter les exercices.
      </p>

      <div className="home-actions">
        <button
          type="button"
          className="primary large"
          onClick={() => navigate('/problemes')}
        >
          Démarrer
        </button>
      </div>

      <div className="home-card-grid">
        <article className="exercise-card home-feature-card">
          <div className="exercise-media">
            <img
              src="/images/bases-prises-2.png"
              alt="Les bases techniques"
              loading="lazy"
            />
          </div>

          <div className="exercise-content">
            <h3>Les bases techniques</h3>
            <p className="muted">
              Retrouver les prises de raquette, les placements et la construction du sur-filet.
            </p>

            <button
              type="button"
              className="primary full-width"
              onClick={() => navigate('/bases-techniques')}
            >
              Ouvrir
            </button>
          </div>
        </article>
      </div>
    </section>
  )
}

export default Home
