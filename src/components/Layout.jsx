import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

// Petits pictogrammes (tracés, style homogène) pour l'en-tête et la barre du bas.
const IconeFeuille = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
    <path d="M20 4S8 5 5 12s3 8 3 8 8-1 11-8c1-3 1-8 1-8Z" />
    <path d="M8.5 19.5C10 14 13 10.5 18 8" />
  </svg>
)
const IconeMarche = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
    <path d="M5 9h14l-1.5 10.5a2 2 0 0 1-2 1.5h-7a2 2 0 0 1-2-1.5L5 9Z" />
    <path d="M9 9 12 3l3 6" />
  </svg>
)
const IconeParcelles = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
    <path d="M4 20V8l8-4 8 4v12" />
    <path d="M4 14h16M9 20v-8h6v8" />
  </svg>
)
const IconeResa = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
    <rect x="4" y="5" width="16" height="16" rx="2" />
    <path d="M8 3v4M16 3v4M4 10h16m-9 4 2 2 4-4" />
  </svg>
)
const IconeProfil = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1.6-4.5 5-6 8-6s6.4 1.5 8 6" />
  </svg>
)

const classeActif = ({ isActive }) => (isActive ? 'actif' : undefined)

export default function Layout({ children }) {
  const { utilisateur, profil, deconnexion } = useAuth()
  const navigate = useNavigate()

  async function seDeconnecter() {
    await deconnexion()
    navigate('/')
  }

  return (
    <div className="app">
      <header className="entete">
        <Link to="/" className="logo">
          <IconeFeuille />
          MonAgri
        </Link>
        <nav>
          <NavLink to="/" end className={classeActif}>
            Le marché
          </NavLink>
          <NavLink to="/parcelles" className={classeActif}>
            Les parcelles
          </NavLink>
          {utilisateur && (
            <NavLink to="/mes-reservations" className={classeActif}>
              Mes réservations
            </NavLink>
          )}
          {utilisateur && (
            <NavLink to="/espace-agriculteur" className={classeActif}>
              Espace agriculteur
            </NavLink>
          )}
        </nav>
        <div className="compte">
          {utilisateur ? (
            <>
              <Link to="/mon-profil" className="email">
                {profil?.nom || utilisateur.email}
              </Link>
              <button className="secondaire" onClick={seDeconnecter}>
                Se déconnecter
              </button>
            </>
          ) : (
            <Link to="/connexion">Se connecter</Link>
          )}
        </div>
      </header>

      <main className="contenu">{children}</main>

      <nav className="bottom-nav">
        <NavLink to="/" end className={classeActif}>
          <IconeMarche />
          Marché
        </NavLink>
        <NavLink to="/parcelles" className={classeActif}>
          <IconeParcelles />
          Parcelles
        </NavLink>
        <NavLink to={utilisateur ? '/mes-reservations' : '/connexion'} className={classeActif}>
          <IconeResa />
          Réservations
        </NavLink>
        <NavLink to={utilisateur ? '/mon-profil' : '/connexion'} className={classeActif}>
          <IconeProfil />
          Profil
        </NavLink>
      </nav>
    </div>
  )
}
