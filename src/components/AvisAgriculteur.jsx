import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../AuthContext'
import { api } from '../lib/api'
import Etoiles from './Etoiles'

export default function AvisAgriculteur({ agriculteurId, peutNoter, onChangement }) {
  const { utilisateur } = useAuth()
  const [avis, setAvis] = useState([])
  const [erreur, setErreur] = useState(null)

  const charger = useCallback(() => {
    return api(`/agriculteurs/${agriculteurId}/avis`)
      .then(setAvis)
      .catch((e) => setErreur(e.message))
  }, [agriculteurId])

  useEffect(() => {
    charger()
  }, [charger])

  const monAvis = avis.find((a) => a.client_id === utilisateur?.id)

  async function apresEnvoi() {
    await charger()
    onChangement?.() // rafraîchit la note moyenne dans l'en-tête
  }

  return (
    <section className="avis">
      <h2>Avis</h2>
      {erreur && <p className="erreur">{erreur}</p>}

      {peutNoter && <FormAvis agriculteurId={agriculteurId} monAvis={monAvis} onFait={apresEnvoi} />}
      {utilisateur && !peutNoter && !monAvis && (
        <p className="detail">
          Tu pourras laisser un avis après une réservation confirmée avec cet agriculteur.
        </p>
      )}

      {avis.length === 0 ? (
        <p>Aucun avis pour le moment.</p>
      ) : (
        <ul className="liste-avis">
          {avis.map((a) => (
            <li key={a.id}>
              <div className="avis-tete">
                <strong>{a.client_nom}</strong>
                <Etoiles note={a.note} />
                <span className="detail">{a.date_creation?.slice(0, 10)}</span>
              </div>
              {a.commentaire && <p>{a.commentaire}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function FormAvis({ agriculteurId, monAvis, onFait }) {
  const [note, setNote] = useState(monAvis?.note ?? 0)
  const [commentaire, setCommentaire] = useState(monAvis?.commentaire ?? '')
  const [erreur, setErreur] = useState(null)
  const [enCours, setEnCours] = useState(false)

  // Si `monAvis` change (chargé après coup), on réinitialise le formulaire.
  const [idRef, setIdRef] = useState(monAvis?.id ?? null)
  if ((monAvis?.id ?? null) !== idRef) {
    setIdRef(monAvis?.id ?? null)
    setNote(monAvis?.note ?? 0)
    setCommentaire(monAvis?.commentaire ?? '')
  }

  async function envoyer(e) {
    e.preventDefault()
    setErreur(null)
    if (note < 1) {
      setErreur('Choisis une note.')
      return
    }
    setEnCours(true)
    try {
      await api(`/agriculteurs/${agriculteurId}/avis`, {
        method: 'PUT',
        body: { note, commentaire: commentaire.trim() || undefined },
      })
      await onFait()
    } catch (err) {
      setErreur(err.message)
    } finally {
      setEnCours(false)
    }
  }

  async function supprimer() {
    setEnCours(true)
    try {
      await api(`/agriculteurs/${agriculteurId}/avis`, { method: 'DELETE' })
      setNote(0)
      setCommentaire('')
      await onFait()
    } catch (err) {
      setErreur(err.message)
    } finally {
      setEnCours(false)
    }
  }

  return (
    <form className="form-avis" onSubmit={envoyer}>
      <p className="detail">{monAvis ? 'Modifier mon avis' : 'Laisser un avis'}</p>
      <Etoiles note={note} onChange={setNote} />
      <textarea
        rows={3}
        placeholder="Ton commentaire (optionnel)"
        value={commentaire}
        onChange={(e) => setCommentaire(e.target.value)}
      />
      {erreur && <p className="erreur">{erreur}</p>}
      <div className="actions">
        <button type="submit" disabled={enCours}>
          {enCours ? '…' : 'Publier'}
        </button>
        {monAvis && (
          <button type="button" className="lien danger" disabled={enCours} onClick={supprimer}>
            Supprimer
          </button>
        )}
      </div>
    </form>
  )
}
