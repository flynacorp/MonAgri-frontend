import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { api } from '../lib/api'

export default function CarteParcelle({ parcelle }) {
  const { utilisateur } = useAuth()
  const [dateDebut, setDateDebut] = useState('')
  const [culture, setCulture] = useState('')
  const [message, setMessage] = useState(null)
  const [erreur, setErreur] = useState(null)
  const [enCours, setEnCours] = useState(false)

  const disponible = parcelle.statut === 'disponible'

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
          date_debut: dateDebut || undefined,
          culture_demandee: culture || undefined,
        },
      })
      setMessage('Demande envoyée ✓')
      setDateDebut('')
      setCulture('')
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
      <p className="statut">{parcelle.statut}</p>

      {!disponible ? null : !utilisateur ? (
        <Link to="/connexion" className="lien">
          Se connecter pour réserver
        </Link>
      ) : (
        <form className="reserver reserver-parcelle" onSubmit={reserver}>
          <label>
            À partir du
            <input
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
            />
          </label>
          <label>
            Culture souhaitée
            <input
              type="text"
              placeholder="ex. maraîchage"
              value={culture}
              onChange={(e) => setCulture(e.target.value)}
            />
          </label>
          <button type="submit" disabled={enCours}>
            {enCours ? '…' : 'Réserver'}
          </button>
        </form>
      )}

      {message && <p className="succes">{message}</p>}
      {erreur && <p className="erreur">{erreur}</p>}
    </li>
  )
}
