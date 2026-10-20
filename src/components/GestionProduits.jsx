import { useEffect, useState } from 'react'
import { useAuth } from '../AuthContext'
import { api } from '../lib/api'
import { UNITES, chargerCatalogue, trouverReference } from '../lib/catalogue'
import UploadPhoto from './UploadPhoto'

// Le catalogue des produits de référence : il sert à proposer des noms (liste
// de suggestions du navigateur) et à préremplir l'unité de vente.
function useCatalogue() {
  const [catalogue, setCatalogue] = useState([])

  useEffect(() => {
    let actif = true
    chargerCatalogue()
      .then((liste) => {
        if (actif) setCatalogue(liste)
      })
      .catch(() => {}) // sans catalogue, on peut quand même saisir un nom libre
    return () => {
      actif = false
    }
  }, [])

  return catalogue
}

function ChoixUnite({ valeur, onChange }) {
  return (
    <select value={valeur} onChange={(e) => onChange(e.target.value)} aria-label="Unité de vente">
      <option value="">Unité</option>
      {UNITES.map((u) => (
        <option key={u} value={u}>
          {u}
        </option>
      ))}
    </select>
  )
}

function LigneProduit({ produit, catalogue, onChangement }) {
  const [edition, setEdition] = useState(false)
  const [nom, setNom] = useState(produit.nom)
  const [prix, setPrix] = useState(produit.prix_unite)
  const [unite, setUnite] = useState(produit.unite ?? '')
  const [quantite, setQuantite] = useState(produit.quantite_disponible)
  const [region, setRegion] = useState(produit.region ?? '')
  const [erreur, setErreur] = useState(null)
  const [enCours, setEnCours] = useState(false)

  // On (re)remplit le formulaire avec les valeurs actuelles à l'ouverture :
  // le composant n'est pas démonté entre deux rechargements de la liste.
  function ouvrirEdition() {
    setNom(produit.nom)
    setPrix(produit.prix_unite)
    setUnite(produit.unite ?? '')
    setQuantite(produit.quantite_disponible)
    setRegion(produit.region ?? '')
    setErreur(null)
    setEdition(true)
  }

  function changerNom(valeur) {
    setNom(valeur)
    const reference = trouverReference(catalogue, valeur)
    if (reference && !unite) setUnite(reference.unite)
  }

  async function enregistrer(e) {
    e.preventDefault()
    setErreur(null)
    setEnCours(true)
    try {
      const reference = trouverReference(catalogue, nom)
      await api(`/produits/${produit.id}`, {
        method: 'PATCH',
        body: {
          nom,
          prix_unite: Number(prix),
          quantite_disponible: Number(quantite),
          region: region.trim() || null,
          unite: unite || null,
          // le lien avec le catalogue suit le nom : il disparaît si le nom n'y est plus
          reference_id: reference?.id ?? null,
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

  async function changerPhoto(url) {
    await api(`/produits/${produit.id}`, { method: 'PATCH', body: { photo_url: url } })
    onChangement()
  }

  if (!edition) {
    return (
      <li>
        {produit.photo_url && <img src={produit.photo_url} alt="" className="miniature" />}
        <span>
          <strong>{produit.nom}</strong> — {produit.prix_unite} € / {produit.unite || 'unité'} ·{' '}
          {produit.quantite_disponible} dispo
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
        <input
          list="catalogue-produits"
          value={nom}
          onChange={(e) => changerNom(e.target.value)}
          required
        />
        <input
          type="number"
          step="0.01"
          min="0"
          value={prix}
          onChange={(e) => setPrix(e.target.value)}
          required
        />
        <ChoixUnite valeur={unite} onChange={setUnite} />
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
        <UploadPhoto
          dossier={`produits/${produit.agriculteur_id}`}
          urlActuelle={produit.photo_url}
          onUpload={changerPhoto}
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
  const { utilisateur } = useAuth()
  const catalogue = useCatalogue()
  const [nom, setNom] = useState('')
  const [prix, setPrix] = useState('')
  const [unite, setUnite] = useState('')
  const [quantite, setQuantite] = useState('')
  const [region, setRegion] = useState('')
  const [photoUrl, setPhotoUrl] = useState(null)
  const [erreur, setErreur] = useState(null)
  const [enCours, setEnCours] = useState(false)

  // Choisir un nom du catalogue préremplit l'unité (sans écraser un choix déjà fait).
  function changerNom(valeur) {
    setNom(valeur)
    const reference = trouverReference(catalogue, valeur)
    if (reference && !unite) setUnite(reference.unite)
  }

  async function ajouter(e) {
    e.preventDefault()
    setErreur(null)
    setEnCours(true)
    try {
      const reference = trouverReference(catalogue, nom)
      await api('/produits', {
        method: 'POST',
        body: {
          nom,
          prix_unite: Number(prix),
          quantite_disponible: Number(quantite),
          region: region.trim() || undefined,
          unite: unite || undefined,
          photo_url: photoUrl || undefined,
          reference_id: reference?.id,
        },
      })
      setNom('')
      setPrix('')
      setUnite('')
      setQuantite('')
      setRegion('')
      setPhotoUrl(null)
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

      {/* Suggestions de noms (autocomplétion native), partagées par les formulaires */}
      <datalist id="catalogue-produits">
        {catalogue.map((c) => (
          <option key={c.id} value={c.nom} />
        ))}
      </datalist>

      <form className="form-annonce" onSubmit={ajouter}>
        <input
          list="catalogue-produits"
          placeholder="Nom (tape pour chercher)"
          value={nom}
          onChange={(e) => changerNom(e.target.value)}
          required
        />
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="Prix (€)"
          value={prix}
          onChange={(e) => setPrix(e.target.value)}
          required
        />
        <ChoixUnite valeur={unite} onChange={setUnite} />
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
        <UploadPhoto
          dossier={`produits/${utilisateur?.id}`}
          urlActuelle={photoUrl}
          onUpload={setPhotoUrl}
        />
        <button disabled={enCours}>{enCours ? '…' : 'Ajouter'}</button>
      </form>

      {erreur && <p className="erreur">{erreur}</p>}

      {produits.length === 0 ? (
        <p>Aucun produit en vente.</p>
      ) : (
        <ul className="liste-resa">
          {produits.map((p) => (
            <LigneProduit key={p.id} produit={p} catalogue={catalogue} onChangement={onChangement} />
          ))}
        </ul>
      )}
    </section>
  )
}
