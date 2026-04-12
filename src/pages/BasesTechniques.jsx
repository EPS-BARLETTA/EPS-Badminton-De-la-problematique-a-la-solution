import { useState } from 'react'

function BasesTechniques() {
  const [selectedImage, setSelectedImage] = useState(null)

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
            onClick={() => setSelectedImage('/images/bases-prises-1.png')}
          />
        </article>

        <article className="panel">
          <h3>Les deux prises de raquette 2</h3>
          <img
            src="/images/bases-prises-2.png"
            alt="Les deux prises de raquette 2"
            className="bases-image"
            onClick={() => setSelectedImage('/images/bases-prises-2.png')}
          />
        </article>

        <article className="panel">
          <h3>Placements 1</h3>
          <img
            src="/images/bases-placements-1.png"
            alt="Placements 1"
            className="bases-image"
            onClick={() => setSelectedImage('/images/bases-placements-1.png')}
          />
        </article>

        <article className="panel">
          <h3>Placements 2</h3>
          <img
            src="/images/bases-placements-2.png"
            alt="Placements 2"
            className="bases-image"
            onClick={() => setSelectedImage('/images/bases-placements-2.png')}
          />
        </article>

        <article className="panel">
          <h3>Comment construire un sur-filet</h3>
          <img
            src="/images/sur-filet.png"
            alt="Comment construire un sur-filet"
            className="bases-image"
            onClick={() => setSelectedImage('/images/sur-filet.png')}
          />
        </article>
      </div>

      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Zoom" />
        </div>
      )}
    </section>
  )
}

export default BasesTechniques
