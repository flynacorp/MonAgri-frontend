import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/api'
import CarteParcelle from '../components/CarteParcelle'

export default function Parcelles() {
  const [parcelles, setParcelles] = useState([])
  const [erreur, setErreur] = useState(null)
  const [chargement, setChargement] = useState(true)

  const charger = useCallback(() => {
    return api('/parcelles')
      .then(setParcelles)
      .catch((e) => setErreur(e.message))
      .finally(() => setChargement(false))
  }, [])

  useEffect(() => {
    charger()
  }, [charger])

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
            <CarteParcelle key={p.id} parcelle={p} onReservation={charger} />
          ))}
        </ul>
      )}
    </section>
  )
}
