import { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import CarteProduit from '../components/CarteProduit'

export default function Produits() {
  const [produits, setProduits] = useState([])
  const [erreur, setErreur] = useState(null)
  const [chargement, setChargement] = useState(true)
  const [recherche, setRecherche] = useState('')

  useEffect(() => {
    api('/produits')
      .then(setProduits)
      .catch((e) => setErreur(e.message))
      .finally(() => setChargement(false))
  }, [])

  const liste = useMemo(() => {
    const q = recherche.trim().toLowerCase()
    if (!q) return produits
    return produits.filter((p) =>
      [p.nom, p.region, p.agriculteur_ferme, p.agriculteur_nom]
        .filter(Boolean)
        .some((champ) => champ.toLowerCase().includes(q)),
    )
  }, [produits, recherche])

  return (
    <section>
      <div className="hero">
        <h1>Le meilleur de la ferme, sans intermédiaire.</h1>
        <p>
          Réservez fruits, légumes, œufs et même une parcelle à cultiver,
          directement auprès des agriculteurs près de chez vous.
        </p>
        <div className="barre-recherche">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher un produit, une ferme, une région…"
            aria-label="Rechercher un produit"
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
            ? 'Aucun produit ne correspond à ta recherche.'
            : 'Aucun produit pour le moment.'}
        </p>
      ) : (
        <ul className="cartes">
          {liste.map((p) => (
            <CarteProduit key={p.id} produit={p} />
          ))}
        </ul>
      )}
    </section>
  )
}
