import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function Parcelles() {
  const [parcelles, setParcelles] = useState([])
  const [erreur, setErreur] = useState(null)
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    api('/parcelles')
      .then(setParcelles)
      .catch((e) => setErreur(e.message))
      .finally(() => setChargement(false))
  }, [])

  if (chargement) return <p>Chargement…</p>
  if (erreur) return <p className="erreur">{erreur}</p>

  return (
    <section>
      <h1>Parcelles</h1>
      {parcelles.length === 0 ? (
        <p>Aucune parcelle pour le moment.</p>
      ) : (
        <ul className="cartes">
          {parcelles.map((p) => (
            <li key={p.id} className="carte">
              <h3>{p.surface_m2} m²</h3>
              <p className="detail">
                {p.type_sol ? `Sol ${p.type_sol}` : 'Sol non précisé'}
                {p.region ? ` · ${p.region}` : ''}
              </p>
              <p className="statut">{p.statut}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
