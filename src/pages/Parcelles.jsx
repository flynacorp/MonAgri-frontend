import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import CarteParcelle from '../components/CarteParcelle'

export default function Parcelles() {
  const [parcelles, setParcelles] = useState([])
  const [erreur, setErreur] = useState(null)
  const [chargement, setChargement] = useState(true)
  const [recherche, setRecherche] = useState('')

  const charger = useCallback(() => {
    return api('/parcelles')
      .then(setParcelles)
      .catch((e) => setErreur(e.message))
      .finally(() => setChargement(false))
  }, [])

  useEffect(() => {
    charger()
  }, [charger])

  const liste = useMemo(() => {
    const q = recherche.trim().toLowerCase()
    if (!q) return parcelles
    return parcelles.filter((p) =>
      [p.region, p.type_sol, p.agriculteur_ferme, p.agriculteur_nom, ...(p.cultures_autorisees ?? [])]
        .filter(Boolean)
        .some((champ) => champ.toLowerCase().includes(q)),
    )
  }, [parcelles, recherche])

  return (
    <section>
      <div className="hero">
        <h1>Cultivez votre carré de terre.</h1>
        <p>
          Des agriculteurs louent une partie de leurs parcelles au m². Choisissez
          la surface, la culture autorisée qui vous intéresse, et c'est parti.
        </p>
        <div className="barre-recherche">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher une culture, un sol, une région…"
            aria-label="Rechercher une parcelle"
          />
        </div>
      </div>

      {chargement ? (
        <p>Chargement…</p>
      ) : erreur ? (
        <p className="erreur">{erreur}</p>
      ) : liste.length === 0 ? (
        <p>
          {recherche
            ? 'Aucune parcelle ne correspond à ta recherche.'
            : 'Aucune parcelle pour le moment.'}
        </p>
      ) : (
        <ul className="cartes">
          {liste.map((p) => (
            <CarteParcelle key={p.id} parcelle={p} onReservation={charger} />
          ))}
        </ul>
      )}
    </section>
  )
}
