import { useState } from 'react'
import { api } from '../lib/api'

function LigneProduit({ produit, onChangement }) {
  const [edition, setEdition] = useState(false)
  const [nom, setNom] = useState(produit.nom)
  const [prix, setPrix] = useState(produit.prix_unite)
  const [quantite, setQuantite] = useState(produit.quantite_disponible)
  const [region, setRegion] = useState(produit.region ?? '')
  const [erreur, setErreur] = useState(null)
  const [enCours, setEnCours] = useState(false)

  // On (re)remplit le formulaire avec les valeurs actuelles à l'ouverture :
  // le composant n'est pas démonté entre deux rechargements de la liste.
  function ouvrirEdition() {
    setNom(produit.nom)
    setPrix(produit.prix_unite)
    setQuantite(produit.quantite_disponible)
    setRegion(produit.region ?? '')
    setErreur(null)
    setEdition(true)
  }

  async function enregistrer(e) {
    e.preventDefault()
    setErreur(null)
    setEnCours(true)
    try {
      await api(`/produits/${produit.id}`, {
        method: 'PATCH',
        body: {
          nom,
          prix_unite: Number(prix),
          quantite_disponible: Number(quantite),
          region: region.trim() || null,
        },
      })
      setEdition(false)
      onChangement()
    } catch (err) {
      setErreur(err.message)
    } finally {
      setEnCours(false)
    }
  }

  async function retirer() {
    setErreur(null)
    try {
      await api(`/produits/${produit.id}`, { method: 'DELETE' })
      onChangement()
    } catch (err) {
      setErreur(err.message)
    }
  }

  if (!edition) {
    return (
      <li>
        <span>
          <strong>{produit.nom}</strong> — {produit.prix_unite} € · {produit.quantite_disponible} dispo
          {produit.region ? ` · ${produit.region}` : ''}
        </span>
        <span className="actions">
          <button type="button" className="lien" onClick={ouvrirEdition}>
            Modifier
          </button>
          <button type="button" className="lien danger" onClick={retirer}>
            Retirer
          </button>
        </span>
        {erreur && <p className="erreur">{erreur}</p>}
      </li>
    )
  }

  return (
    <li>
      <form className="form-annonce" onSubmit={enregistrer}>
        <input value={nom} onChange={(e) => setNom(e.target.value)} required />
        <input
          type="number"
          step="0.01"
          min="0"
          value={prix}
          onChange={(e) => setPrix(e.target.value)}
          required
        />
        <input
          type="number"
          min="0"
          value={quantite}
          onChange={(e) => setQuantite(e.target.value)}
          required
        />
        <input
          placeholder="Région"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        />
        <button disabled={enCours}>{enCours ? '…' : 'Enregistrer'}</button>
        <button type="button" className="lien" onClick={() => setEdition(false)}>
          Annuler
        </button>
      </form>
      {erreur && <p className="erreur">{erreur}</p>}
    </li>
  )
}

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
          region: region.trim() || undefined,
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
            <LigneProduit key={p.id} produit={p} onChangement={onChangement} />
          ))}
        </ul>
      )}
    </section>
  )
}
