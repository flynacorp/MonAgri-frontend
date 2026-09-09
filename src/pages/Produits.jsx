import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function Produits() {
  const [produits, setProduits] = useState([])
  const [erreur, setErreur] = useState(null)
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    api('/produits')
      .then(setProduits)
      .catch((e) => setErreur(e.message))
      .finally(() => setChargement(false))
  }, [])

  if (chargement) return <p>Chargement…</p>
  if (erreur) return <p className="erreur">{erreur}</p>

  return (
    <section>
      <h1>Produits</h1>
      {produits.length === 0 ? (
        <p>Aucun produit pour le moment.</p>
      ) : (
        <ul className="cartes">
          {produits.map((p) => (
            <li key={p.id} className="carte">
              <h3>{p.nom}</h3>
              <p className="prix">{p.prix_unite} € / unité</p>
              <p className="detail">
                {p.quantite_disponible} disponible(s)
                {p.region ? ` · ${p.region}` : ''}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
