import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Produits from './pages/Produits'
import Parcelles from './pages/Parcelles'
import Connexion from './pages/Connexion'
import MesReservations from './pages/MesReservations'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Produits />} />
        <Route path="/parcelles" element={<Parcelles />} />
        <Route path="/mes-reservations" element={<MesReservations />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="*" element={<p>Page introuvable.</p>} />
      </Routes>
    </Layout>
  )
}
