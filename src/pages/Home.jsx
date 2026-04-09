import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()
  return (
    <section className="panel hero-panel">
      <p className="eyebrow">Livret EPS Badminton 2026</p>
      <h2>BADMINTON EPS – Parcours Problèmes & Progression</h2>
      <p>
        Une application pensée pour les professeurs d’EPS : retrouvez en un clic toutes les situations
        du livret, leurs objectifs, variantes, critères de réussite et visuels prêts à être projetés
        en séance.
      </p>
      <button type="button" className="primary large" onClick={() => navigate('/problemes')}>
        Démarrer
      </button>
    </section>
  )
}

export default Home
