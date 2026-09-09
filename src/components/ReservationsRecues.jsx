import { useState } from 'react'
import { api } from '../lib/api'

const LIBELLE_STATUT = {
  en_attente: 'En attente',
  confirmee: 'Confirmée',
  annulee: 'Annulée',
}

export default function ReservationsRecues({ donnees, produits, parcelles, onChangement }) {
  const [erreur, setErreur] = useState(null)
  const [enCours, setEnCours] = useState(null) // id de la résa en cours de traitement

  const nomProduit = (id) => produits.find((p) => p.id === id)?.nom ?? 'Produit'
  const nomParcelle = (id) => {
    const p = parcelles.find((x) => x.id === id)
    return p ? `Parcelle ${p.surface_m2} m²` : 'Parcelle'
  }

  async function traiter(type, id, statut) {
    setErreur(null)
    setEnCours(id)
    try {
      await api(`/reservations-${type}/${id}`, { method: 'PATCH', body: { statut } })
      onChangement()
    } catch (err) {
      setErreur(err.message)
    } finally {
      setEnCours(null)
    }
  }

  function Ligne({ type, resa, libelle, complement }) {
    const enAttente = resa.statut === 'en_attente'
    return (
      <li>
        <span>
          <strong>{libelle}</strong>
          {complement}
        </span>
        {enAttente ? (
          <span className="actions">
            <button
              type="button"
              disabled={enCours === resa.id}
              onClick={() => traiter(type, resa.id, 'confirmee')}
            >
              Accepter
            </button>
            <button
              type="button"
              className="lien danger"
              disabled={enCours === resa.id}
              onClick={() => traiter(type, resa.id, 'annulee')}
            >
              Refuser
            </button>
          </span>
        ) : (
          <span className={`badge badge-${resa.statut}`}>
            {LIBELLE_STATUT[resa.statut] ?? resa.statut}
          </span>
        )}
      </li>
    )
  }

  const rp = donnees.reservations_produits
  const rpar = donnees.reservations_parcelles

  return (
    <section>
      <h2>Réservations reçues</h2>
      {erreur && <p className="erreur">{erreur}</p>}

      {rp.length === 0 && rpar.length === 0 ? (
        <p>Aucune réservation reçue.</p>
      ) : (
        <ul className="liste-resa">
          {rp.map((r) => (
            <Ligne
              key={r.id}
              type="produits"
              resa={r}
              libelle={nomProduit(r.produit_id)}
              complement={` — ${r.quantite} unité(s)`}
            />
          ))}
          {rpar.map((r) => (
            <Ligne
              key={r.id}
              type="parcelles"
              resa={r}
              libelle={nomParcelle(r.parcelle_id)}
              complement={r.date_debut ? ` — dès le ${r.date_debut}` : ''}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
