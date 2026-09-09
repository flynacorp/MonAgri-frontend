import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { api } from '../lib/api'

const LIBELLE_STATUT = {
  en_attente: 'En attente',
  confirmee: 'Confirmée',
  annulee: 'Annulée',
}

export default function MesReservations() {
  const { utilisateur, chargement: chargementAuth } = useAuth()

  const [reservations, setReservations] = useState(null)
  const [produits, setProduits] = useState([])
  const [parcelles, setParcelles] = useState([])
  const [erreur, setErreur] = useState(null)
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    if (!utilisateur) return
    Promise.all([api('/mes-reservations'), api('/produits'), api('/parcelles')])
      .then(([resa, prod, parc]) => {
        setReservations(resa)
        setProduits(prod)
        setParcelles(parc)
      })
      .catch((e) => setErreur(e.message))
      .finally(() => setChargement(false))
  }, [utilisateur])

  if (chargementAuth) return <p>Chargement…</p>
  if (!utilisateur) {
    return (
      <p>
        <Link to="/connexion">Connecte-toi</Link> pour voir tes réservations.
      </p>
    )
  }
  if (chargement) return <p>Chargement…</p>
  if (erreur) return <p className="erreur">{erreur}</p>

  const nomProduit = (id) => produits.find((p) => p.id === id)?.nom ?? 'Produit (retiré)'
  const nomParcelle = (id) => {
    const p = parcelles.find((x) => x.id === id)
    return p ? `Parcelle ${p.surface_m2} m²` : 'Parcelle (retirée)'
  }

  const { reservations_produits: rp, reservations_parcelles: rpar } = reservations

  return (
    <section>
      <h1>Mes réservations</h1>

      <h2>Produits</h2>
      {rp.length === 0 ? (
        <p>Aucune réservation de produit.</p>
      ) : (
        <ul className="liste-resa">
          {rp.map((r) => (
            <li key={r.id}>
              <strong>{nomProduit(r.produit_id)}</strong> — {r.quantite} unité(s)
              <span className={`badge badge-${r.statut}`}>
                {LIBELLE_STATUT[r.statut] ?? r.statut}
              </span>
            </li>
          ))}
        </ul>
      )}

      <h2>Parcelles</h2>
      {rpar.length === 0 ? (
        <p>Aucune réservation de parcelle.</p>
      ) : (
        <ul className="liste-resa">
          {rpar.map((r) => (
            <li key={r.id}>
              <strong>{nomParcelle(r.parcelle_id)}</strong>
              {r.surface_reservee ? ` — ${r.surface_reservee} m²` : ''}
              {r.culture_demandee ? ` · ${r.culture_demandee}` : ''}
              {r.date_debut ? ` · dès le ${r.date_debut}` : ''}
              <span className={`badge badge-${r.statut}`}>
                {LIBELLE_STATUT[r.statut] ?? r.statut}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
