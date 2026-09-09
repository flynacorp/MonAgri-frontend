import { useState } from 'react'
import { api } from '../lib/api'

export default function GestionProduits({ produits, onChangement }) {
  const [nom, setNom] = useState('')
  const [prix, setPrix] = useState('')
  const [quantite, setQuantite] = useState('')
  const [region, setRegion] = useState('')
  const [erreur, setErreur] = useState(null)
  const [enCours, setEnCours] = useState(false)

  async function ajouter(e) {
    e.preventDefault()
    setErreur(null)
    setEnCours(true)
    try {
      await api('/produits', {
        method: 'POST',
        body: {
          nom,
          prix_unite: Number(prix),
          quantite_disponible: Number(quantite),
          region: region || undefined,
        },
      })
      setNom('')
      setPrix('')
      setQuantite('')
      setRegion('')
      onChangement()
    } catch (err) {
      setErreur(err.message)
    } finally {
      setEnCours(false)
    }
  }

  async function retirer(id) {
    setErreur(null)
    try {
      await api(`/produits/${id}`, { method: 'DELETE' })
      onChangement()
    } catch (err) {
      setErreur(err.message)
    }
  }

  return (
    <section>
      <h2>Mes produits</h2>

      <form className="form-annonce" onSubmit={ajouter}>
        <input placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="Prix / unité (€)"
          value={prix}
          onChange={(e) => setPrix(e.target.value)}
          required
        />
        <input
          type="number"
          min="0"
          placeholder="Quantité"
          value={quantite}
          onChange={(e) => setQuantite(e.target.value)}
          required
        />
        <input
          placeholder="Région (optionnel)"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        />
        <button disabled={enCours}>{enCours ? '…' : 'Ajouter'}</button>
      </form>

      {erreur && <p className="erreur">{erreur}</p>}

      {produits.length === 0 ? (
        <p>Aucun produit en vente.</p>
      ) : (
        <ul className="liste-resa">
          {produits.map((p) => (
            <li key={p.id}>
              <strong>{p.nom}</strong> — {p.prix_unite} € · {p.quantite_disponible} dispo
              <button type="button" className="lien danger" onClick={() => retirer(p.id)}>
                Retirer
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
