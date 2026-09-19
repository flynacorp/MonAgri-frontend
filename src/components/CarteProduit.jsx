import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { api } from '../lib/api'
import PaiementCarte from './PaiementCarte'

export default function CarteProduit({ produit }) {
  const { utilisateur } = useAuth()
  const [quantite, setQuantite] = useState(1)
  const [message, setMessage] = useState(null)
  const [erreur, setErreur] = useState(null)
  const [enCours, setEnCours] = useState(false)
  const [intention, setIntention] = useState(null) // paiement en ligne en cours

  const epuise = produit.quantite_disponible < 1
  const total = (Number(quantite) || 0) * produit.prix_unite

  // Enregistre la réservation (avec le paiement autorisé, s'il y en a un).
  async function enregistrer(paymentIntentId) {
    await api('/reservations-produits', {
      method: 'POST',
      body: {
        produit_id: produit.id,
        quantite: Number(quantite),
        payment_intent_id: paymentIntentId,
      },
    })
    setMessage(
      paymentIntentId
        ? 'Réservation envoyée ✓ — ta carte sera débitée si l’agriculteur confirme'
        : 'Réservation envoyée ✓',
    )
    setQuantite(1)
    setIntention(null)
  }

  async function reserver(e) {
    e.preventDefault()
    setMessage(null)
    setErreur(null)
    setEnCours(true)
    try {
      // Le serveur dit si ce vendeur encaisse en ligne (et calcule le montant).
      const reponse = await api('/reservations-produits/intention', {
        method: 'POST',
        body: { produit_id: produit.id, quantite: Number(quantite) },
      })
      if (reponse.mode === 'en_ligne') {
        setIntention(reponse)
      } else {
        await enregistrer()
      }
    } catch (err) {
      setErreur(err.message)
    } finally {
      setEnCours(false)
    }
  }

  async function carteAutorisee(paymentIntentId) {
    try {
      await enregistrer(paymentIntentId)
    } catch (err) {
      setErreur(err.message)
      setIntention(null)
    }
  }

  return (
    <li className="carte">
      <h3>{produit.nom}</h3>
      <p className="prix">
        {produit.prix_unite} € <span>/ unité</span>
      </p>
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
      ) : intention ? (
        <PaiementCarte
          clientSecret={intention.client_secret}
          montant={intention.montant}
          onAutorise={carteAutorisee}
          onAnnuler={() => setIntention(null)}
        />
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

      {produit.agriculteur_id && (
        <p className="vendeur">
          <Link to={`/agriculteurs/${produit.agriculteur_id}`}>
            {produit.agriculteur_ferme || produit.agriculteur_nom || 'Voir le vendeur'} →
          </Link>
          {produit.agriculteur_nombre_avis > 0 && (
            <span className="note-mini">
              {' '}
              ★ {produit.agriculteur_note} ({produit.agriculteur_nombre_avis})
            </span>
          )}
        </p>
      )}
    </li>
  )
}
