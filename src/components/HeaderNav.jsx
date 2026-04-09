import { useLocation, useNavigate } from 'react-router-dom'

function HeaderNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <header className="app-header">
      <div className="brand">
        <p className="eyebrow">Cycle 4 • EPS</p>
        <h1>BADMINTON EPS</h1>
        <p className="subtitle">Parcours problèmes & progression</p>
      </div>
      <div className="nav-actions">
        <button type="button" className="primary" onClick={() => navigate('/')}>
          Accueil
        </button>
        <button
          type="button"
          className="ghost"
          onClick={() => navigate(-1)}
          disabled={isHome}
        >
          Retour
        </button>
      </div>
    </header>
  )
}

export default HeaderNav
