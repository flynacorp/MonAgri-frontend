import { Routes, Route, Link } from 'react-router-dom'
import Layout from './components/Layout'
import Produits from './pages/Produits'
import Parcelles from './pages/Parcelles'
import Connexion from './pages/Connexion'
import MesReservations from './pages/MesReservations'
import EspaceAgriculteur from './pages/EspaceAgriculteur'
import MonProfil from './pages/MonProfil'
import ProfilAgriculteur from './pages/ProfilAgriculteur'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Produits />} />
        <Route path="/parcelles" element={<Parcelles />} />
        <Route path="/mes-reservations" element={<MesReservations />} />
        <Route path="/espace-agriculteur" element={<EspaceAgriculteur />} />
        <Route path="/mon-profil" element={<MonProfil />} />
        <Route path="/agriculteurs/:id" element={<ProfilAgriculteur />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route
          path="*"
          element={
            <section>
              <h1>Page introuvable</h1>
              <p>Cette page n'existe pas ou a été déplacée.</p>
              <p>
                <Link to="/">← Retour au marché</Link>
              </p>
            </section>
          }
        />
      </Routes>
    </Layout>
  )
}
