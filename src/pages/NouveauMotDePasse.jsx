import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

// Page où l'on arrive en cliquant sur le lien de l'e-mail « mot de passe oublié » :
// Supabase ouvre alors une session, qui nous autorise à choisir un nouveau mot de passe.
export default function NouveauMotDePasse() {
  const { utilisateur, chargement, nouveauMotDePasse } = useAuth()
  const navigate = useNavigate()

  const [motDePasse, setMotDePasse] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [erreur, setErreur] = useState(null)
  const [fait, setFait] = useState(false)
  const [enCours, setEnCours] = useState(false)

  async function soumettre(e) {
    e.preventDefault()
    setErreur(null)
    if (motDePasse !== confirmation) {
      setErreur('Les deux mots de passe sont différents.')
      return
    }
    setEnCours(true)
    try {
      await nouveauMotDePasse(motDePasse)
      setFait(true)
      setTimeout(() => navigate('/'), 1800)
    } catch (err) {
      setErreur(err.message)
    } finally {
      setEnCours(false)
    }
  }

  if (chargement) return <p>Chargement…</p>

  // Pas de session : le lien est périmé, déjà utilisé, ou la page a été ouverte au hasard.
  if (!utilisateur) {
    return (
      <section className="connexion">
        <h1>Lien expiré</h1>
        <p>Ce lien n'est plus valide ou a déjà servi. Demande-en un nouveau.</p>
        <p>
          <Link to="/connexion?mode=oubli">Recevoir un nouveau lien</Link>
        </p>
      </section>
    )
  }

  return (
    <section className="connexion">
      <h1>Nouveau mot de passe</h1>

      {fait ? (
        <p className="succes">Mot de passe modifié ✓ Tu es connecté, on te ramène à l'accueil…</p>
      ) : (
        <form onSubmit={soumettre}>
          <label>
            Nouveau mot de passe
            <input
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </label>
          <label>
            Confirme-le
            <input
              type="password"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </label>
          {erreur && <p className="erreur">{erreur}</p>}
          <button type="submit" disabled={enCours}>
            {enCours ? '…' : 'Enregistrer'}
          </button>
        </form>
      )}
    </section>
  )
}
