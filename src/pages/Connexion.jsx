import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Connexion() {
  const { connexion, inscription, motDePasseOublie } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()

  // 'connexion' | 'inscription' | 'oubli' (mot de passe oublié)
  const [mode, setMode] = useState(params.get('mode') === 'oubli' ? 'oubli' : 'connexion')
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [accepte, setAccepte] = useState(false)
  const [erreur, setErreur] = useState(null)
  const [message, setMessage] = useState(null)
  const [enCours, setEnCours] = useState(false)

  function changerMode(nouveau) {
    setErreur(null)
    setMessage(null)
    setMode(nouveau)
  }

  async function soumettre(e) {
    e.preventDefault()
    setErreur(null)
    setMessage(null)
    setEnCours(true)
    try {
      if (mode === 'oubli') {
        await motDePasseOublie(email)
        setMessage(
          "Si un compte existe avec cette adresse, un e-mail vient d'être envoyé avec un lien pour choisir un nouveau mot de passe. Pense à regarder les courriers indésirables.",
        )
        return
      }
      if (mode === 'connexion') {
        await connexion(email, motDePasse)
      } else {
        await inscription(email, motDePasse)
      }
      navigate('/')
    } catch (err) {
      setErreur(err.message)
    } finally {
      setEnCours(false)
    }
  }

  const titres = {
    connexion: 'Se connecter',
    inscription: 'Créer un compte',
    oubli: 'Mot de passe oublié',
  }
  const boutons = { connexion: 'Se connecter', inscription: "S'inscrire", oubli: 'Envoyer le lien' }

  return (
    <section className="connexion">
      <h1>{titres[mode]}</h1>

      {mode === 'oubli' && (
        <p className="detail">
          Indique l'adresse e-mail de ton compte : tu recevras un lien pour choisir un nouveau mot
          de passe.
        </p>
      )}

      <form onSubmit={soumettre}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {mode !== 'oubli' && (
          <label>
            Mot de passe
            <input
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
              minLength={6}
            />
          </label>
        )}

        {mode === 'inscription' && (
          <label className="case">
            <input
              type="checkbox"
              checked={accepte}
              onChange={(e) => setAccepte(e.target.checked)}
              required
            />
            <span>
              J'ai lu et j'accepte les <Link to="/conditions">conditions d'utilisation</Link> et la{' '}
              <Link to="/confidentialite">politique de confidentialité</Link>.
            </span>
          </label>
        )}

        {message && <p className="succes">{message}</p>}
        {erreur && <p className="erreur">{erreur}</p>}

        <button type="submit" disabled={enCours}>
          {enCours ? '…' : boutons[mode]}
        </button>
      </form>

      {mode === 'connexion' && (
        <button type="button" className="lien" onClick={() => changerMode('oubli')}>
          Mot de passe oublié ?
        </button>
      )}
      <button
        type="button"
        className="lien"
        onClick={() => changerMode(mode === 'inscription' ? 'connexion' : mode === 'oubli' ? 'connexion' : 'inscription')}
      >
        {mode === 'connexion'
          ? "Pas de compte ? S'inscrire"
          : mode === 'inscription'
            ? 'Déjà un compte ? Se connecter'
            : 'Retour à la connexion'}
      </button>
    </section>
  )
}
