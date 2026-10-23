import { useState } from 'react'
import { useAuth } from '../AuthContext'
import { api } from '../lib/api'
import UploadPhoto from './UploadPhoto'

// Formulaire d'une idée de préparation, pour la création comme pour la
// modification. `onEnregistrer(valeurs)` envoie l'idée à l'API.
function FormulaireIdee({ initial, produits, libelle, onEnregistrer, onAnnuler }) {
  const { utilisateur } = useAuth()
  const [titre, setTitre] = useState(initial?.titre ?? '')
  const [produitId, setProduitId] = useState(initial?.produit_id ?? '')
  const [ingredients, setIngredients] = useState(initial?.ingredients ?? '')
  const [preparation, setPreparation] = useState(initial?.preparation ?? '')
  const [photoUrl, setPhotoUrl] = useState(initial?.photo_url ?? null)
  const [erreur, setErreur] = useState(null)
  const [enCours, setEnCours] = useState(false)

  async function soumettre(e) {
    e.preventDefault()
    setErreur(null)
    setEnCours(true)
    try {
      await onEnregistrer({
        titre: titre.trim(),
        produit_id: produitId || null,
        ingredients: ingredients.trim() || null,
        preparation: preparation.trim(),
        photo_url: photoUrl,
      })
      if (!initial) {
        setTitre('')
        setProduitId('')
        setIngredients('')
        setPreparation('')
        setPhotoUrl(null)
      }
    } catch (err) {
      setErreur(err.message)
    } finally {
      setEnCours(false)
    }
  }

  return (
    <form className="form-idee" onSubmit={soumettre}>
      <label>
        Pour quel produit ?
        <select value={produitId} onChange={(e) => setProduitId(e.target.value)}>
          <option value="">Aucun produit en particulier</option>
          {produits.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nom}
            </option>
          ))}
        </select>
      </label>
      <label>
        Titre
        <input
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          placeholder="Ex. Tomates farcies au riz"
          maxLength={100}
          required
        />
      </label>
      <label>
        Ingrédients (facultatif)
        <textarea
          rows={3}
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="Une ligne par ingrédient"
          maxLength={1000}
        />
      </label>
      <label>
        Préparation
        <textarea
          rows={5}
          value={preparation}
          onChange={(e) => setPreparation(e.target.value)}
          placeholder="Explique les étapes, la cuisson, un conseil…"
          maxLength={3000}
          required
        />
      </label>
      <UploadPhoto
        dossier={`recettes/${utilisateur?.id}`}
        urlActuelle={photoUrl}
        onUpload={setPhotoUrl}
      />
      {erreur && <p className="erreur">{erreur}</p>}
      <div className="actions-form">
        <button type="submit" disabled={enCours}>
          {enCours ? '…' : libelle}
        </button>
        {onAnnuler && (
          <button type="button" className="lien" onClick={onAnnuler}>
            Annuler
          </button>
        )}
      </div>
    </form>
  )
}

function LigneIdee({ recette, produits, onChangement }) {
  const [edition, setEdition] = useState(false)
  const [erreur, setErreur] = useState(null)

  async function enregistrer(valeurs) {
    await api(`/recettes/${recette.id}`, { method: 'PATCH', body: valeurs })
    setEdition(false)
    onChangement()
  }

  async function retirer() {
    setErreur(null)
    try {
      await api(`/recettes/${recette.id}`, { method: 'DELETE' })
      onChangement()
    } catch (err) {
      setErreur(err.message)
    }
  }

  if (edition) {
    return (
      <li>
        <FormulaireIdee
          initial={recette}
          produits={produits}
          libelle="Enregistrer"
          onEnregistrer={enregistrer}
          onAnnuler={() => setEdition(false)}
        />
      </li>
    )
  }

  return (
    <li>
      {recette.photo_url && <img src={recette.photo_url} alt="" className="miniature" />}
      <span>
        <strong>{recette.titre}</strong>
        {recette.produit_nom ? ` — ${recette.produit_nom}` : ''}
      </span>
      <span className="actions">
        <button type="button" className="lien" onClick={() => setEdition(true)}>
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

// Section de l'espace agriculteur : proposer des idées de préparation pour ses
// produits (elles s'affichent sur la carte du produit et sur sa fiche).
export default function GestionRecettes({ produits, recettes, onChangement }) {
  async function ajouter(valeurs) {
    await api('/recettes', { method: 'POST', body: valeurs })
    onChangement()
  }

  return (
    <section className="gestion-recettes">
      <h2>Idées de préparation</h2>
      <p className="detail">
        Donne envie à tes clients : une idée de recette ou de préparation pour tes légumes. Elle
        apparaît sous le produit, et sur ta fiche.
      </p>

      <FormulaireIdee produits={produits} libelle="Ajouter l'idée" onEnregistrer={ajouter} />

      {recettes.length === 0 ? (
        <p>Aucune idée pour le moment.</p>
      ) : (
        <ul className="liste-resa">
          {recettes.map((r) => (
            <LigneIdee key={r.id} recette={r} produits={produits} onChangement={onChangement} />
          ))}
        </ul>
      )}
    </section>
  )
}
