import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Connexion() {
  const { connexion, inscription } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode] = useState('connexion') // 'connexion' | 'inscription'
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [erreur, setErreur] = useState(null)
  const [enCours, setEnCours] = useState(false)

  async function soumettre(e) {
    e.preventDefault()
    setErreur(null)
    setEnCours(true)
    try {
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

  return (
    <section className="connexion">
      <h1>{mode === 'connexion' ? 'Se connecter' : 'Créer un compte'}</h1>

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

        {erreur && <p className="erreur">{erreur}</p>}

        <button type="submit" disabled={enCours}>
          {enCours ? '…' : mode === 'connexion' ? 'Se connecter' : "S'inscrire"}
        </button>
      </form>

      <button
        type="button"
        className="lien"
        onClick={() => {
          setErreur(null)
          setMode(mode === 'connexion' ? 'inscription' : 'connexion')
        }}
      >
        {mode === 'connexion'
          ? "Pas de compte ? S'inscrire"
          : 'Déjà un compte ? Se connecter'}
      </button>
    </section>
  )
}
