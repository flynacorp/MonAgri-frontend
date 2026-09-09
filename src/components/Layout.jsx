import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Layout({ children }) {
  const { utilisateur, deconnexion } = useAuth()
  const navigate = useNavigate()

  async function seDeconnecter() {
    await deconnexion()
    navigate('/')
  }

  return (
    <div className="app">
      <header className="entete">
        <Link to="/" className="logo">
          MonAgri 🌱
        </Link>
        <nav>
          <Link to="/">Produits</Link>
          <Link to="/parcelles">Parcelles</Link>
          {utilisateur && <Link to="/mes-reservations">Mes réservations</Link>}
          {utilisateur && <Link to="/espace-agriculteur">Espace agriculteur</Link>}
        </nav>
        <div className="compte">
          {utilisateur ? (
            <>
              <span className="email">{utilisateur.email}</span>
              <button onClick={seDeconnecter}>Se déconnecter</button>
            </>
          ) : (
            <Link to="/connexion">Se connecter</Link>
          )}
        </div>
      </header>

      <main className="contenu">{children}</main>
    </div>
  )
}
