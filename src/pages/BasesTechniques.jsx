function BasesTechniques() {
  return (
    <section className="panel">
      <header className="section-header">
        <p className="eyebrow">Ressource pédagogique</p>
        <h2>Les bases techniques</h2>
        <p>
          Les fondamentaux visuels du livret pour accompagner les apprentissages en badminton.
        </p>
      </header>

      <div className="bases-grid">
        <article className="panel">
          <h3>Les deux prises de raquette 1</h3>
          <img
            src="/images/bases-prises-1.png"
            alt="Les deux prises de raquette 1"
            className="bases-image"
          />
        </article>

        <article className="panel">
          <h3>Les deux prises de raquette 2</h3>
          <img
            src="/images/bases-prises-2.png"
            alt="Les deux prises de raquette 2"
            className="bases-image"
          />
        </article>

        <article className="panel">
          <h3>Placements 1</h3>
          <img
            src="/images/bases-placement-1.png"
            alt="Placements 1"
            className="bases-image"
          />
        </article>

        <article className="panel">
          <h3>Placements 2</h3>
          <img
            src="/images/bases-placement-2.png"
            alt="Placements 2"
            className="bases-image"
          />
        </article>

        <article className="panel">
          <h3>Comment construire un sur-filet</h3>
          <img
            src="/images/sur-filet.png"
            alt="Comment construire un sur-filet"
            className="bases-image"
          />
        </article>
      </div>
    </section>
  )
}

export default BasesTechniques
