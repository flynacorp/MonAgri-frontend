import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { api } from '../lib/api'

export default function CarteProduit({ produit }) {
  const { utilisateur } = useAuth()
  const [quantite, setQuantite] = useState(1)
  const [message, setMessage] = useState(null)
  const [erreur, setErreur] = useState(null)
  const [enCours, setEnCours] = useState(false)

  const epuise = produit.quantite_disponible < 1
  const total = (Number(quantite) || 0) * produit.prix_unite

  async function reserver(e) {
    e.preventDefault()
    setMessage(null)
    setErreur(null)
    setEnCours(true)
    try {
      await api('/reservations-produits', {
        method: 'POST',
        body: { produit_id: produit.id, quantite: Number(quantite) },
      })
      setMessage('Réservation envoyée ✓')
      setQuantite(1)
    } catch (err) {
      setErreur(err.message)
    } finally {
      setEnCours(false)
    }
  }

  return (
    <li className="carte">
      <h3>{produit.nom}</h3>
      <p className="prix">{produit.prix_unite} € / unité</p>
      <p className="detail">
        {produit.quantite_disponible} disponible(s)
        {produit.region ? ` · ${produit.region}` : ''}
      </p>

      {epuise ? (
        <p className="detail">Épuisé</p>
      ) : !utilisateur ? (
        <Link to="/connexion" className="lien">
          Se connecter pour réserver
        </Link>
      ) : (
        <>
          <form className="reserver" onSubmit={reserver}>
            <input
              type="number"
              min="1"
              max={produit.quantite_disponible}
              value={quantite}
              onChange={(e) => setQuantite(e.target.value)}
              aria-label="Quantité à réserver"
            />
            <button type="submit" disabled={enCours}>
              {enCours ? '…' : 'Réserver'}
            </button>
          </form>
          {total > 0 && <p className="detail">Total : {total.toFixed(2)} €</p>}
        </>
      )}

      {message && <p className="succes">{message}</p>}
      {erreur && <p className="erreur">{erreur}</p>}
    </li>
  )
}
