import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import CarteProduit from '../components/CarteProduit'

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
            <CarteProduit key={p.id} produit={p} />
          ))}
        </ul>
      )}
    </section>
  )
}
