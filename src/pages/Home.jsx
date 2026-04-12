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

      <button
        type="button"
        className="primary large"
        onClick={() => navigate('/problemes')}
      >
        Démarrer
      </button>
    </section>
  )
}

export default Home
