import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { api } from '../lib/api'

export default function CarteParcelle({ parcelle, onReservation }) {
  const { utilisateur } = useAuth()
  const cultures = parcelle.cultures_autorisees ?? []
  const restante = parcelle.surface_restante ?? parcelle.surface_m2
  const prixM2 = Number(parcelle.prix_m2) || 0

  const [surface, setSurface] = useState('')
  const [culture, setCulture] = useState(cultures[0] ?? '')
  const [dateDebut, setDateDebut] = useState('')
  const [message, setMessage] = useState(null)
  const [erreur, setErreur] = useState(null)
  const [enCours, setEnCours] = useState(false)

  const reservable =
    parcelle.statut === 'disponible' && restante > 0 && cultures.length > 0

  async function reserver(e) {
    e.preventDefault()
    setMessage(null)
    setErreur(null)
    setEnCours(true)
    try {
      await api('/reservations-parcelles', {
        method: 'POST',
        body: {
          parcelle_id: parcelle.id,
          surface_reservee: Number(surface),
          culture_demandee: culture,
          date_debut: dateDebut || undefined,
        },
      })
      setMessage('Demande envoyée ✓')
      setSurface('')
      setDateDebut('')
      onReservation?.()
    } catch (err) {
      setErreur(err.message)
    } finally {
      setEnCours(false)
    }
  }

  return (
    <li className="carte">
      <h3>{parcelle.surface_m2} m²</h3>
      <p className="detail">
        {parcelle.type_sol ? `Sol ${parcelle.type_sol}` : 'Sol non précisé'}
        {parcelle.region ? ` · ${parcelle.region}` : ''}
      </p>
      <p className="detail">
        <strong>{restante} m²</strong> encore disponibles sur {parcelle.surface_m2}
        {' · '}
        {prixM2} € / m²
      </p>
      {cultures.length > 0 && (
        <p className="detail">Cultures : {cultures.join(', ')}</p>
      )}
      {parcelle.max_m2_par_client != null && (
        <p className="detail">Max {parcelle.max_m2_par_client} m² par personne</p>
      )}

      {!reservable ? (
        <p className="statut">
          {parcelle.statut !== 'disponible'
            ? parcelle.statut
            : restante <= 0
              ? 'Complète'
              : 'Cultures non définies'}
        </p>
      ) : !utilisateur ? (
        <Link to="/connexion" className="lien">
          Se connecter pour réserver
        </Link>
      ) : (
        <form className="reserver reserver-parcelle" onSubmit={reserver}>
          <label>
            Surface (m²)
            <input
              type="number"
              min="1"
              max={parcelle.max_m2_par_client ?? restante}
              value={surface}
              onChange={(e) => setSurface(e.target.value)}
              required
            />
          </label>
          <label>
            Culture
            <select value={culture} onChange={(e) => setCulture(e.target.value)}>
              {cultures.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label>
            À partir du
            <input
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
            />
          </label>
          <button type="submit" disabled={enCours}>
            {enCours ? '…' : 'Réserver'}
          </button>
          {Number(surface) > 0 && (
            <p className="detail">Total : {(Number(surface) * prixM2).toFixed(2)} €</p>
          )}
        </form>
      )}

      {message && <p className="succes">{message}</p>}
      {erreur && <p className="erreur">{erreur}</p>}
    </li>
  )
}
