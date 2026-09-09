import { useState } from 'react'
import { api } from '../lib/api'

const LIBELLE_STATUT = {
  en_attente: 'En attente',
  confirmee: 'Confirmée',
  annulee: 'Annulée',
}

function LigneResa({ type, resa, libelle, complement, onChangement }) {
  const [erreur, setErreur] = useState(null)
  const [enCours, setEnCours] = useState(false)

  async function traiter(statut) {
    setErreur(null)
    setEnCours(true)
    try {
      await api(`/reservations-${type}/${resa.id}`, { method: 'PATCH', body: { statut } })
      onChangement()
    } catch (err) {
      setErreur(err.message)
      setEnCours(false)
    }
  }

  return (
    <li>
      <span>
        <strong>{libelle}</strong>
        {complement}
      </span>

      {resa.statut === 'en_attente' ? (
        <span className="actions">
          <button type="button" disabled={enCours} onClick={() => traiter('confirmee')}>
            Accepter
          </button>
          <button
            type="button"
            className="lien danger"
            disabled={enCours}
            onClick={() => traiter('annulee')}
          >
            Refuser
          </button>
        </span>
      ) : (
        <span className={`badge badge-${resa.statut}`}>
          {LIBELLE_STATUT[resa.statut] ?? resa.statut}
        </span>
      )}

      {erreur && <p className="erreur">{erreur}</p>}
    </li>
  )
}

export default function ReservationsRecues({ donnees, produits, parcelles, onChangement }) {
  const nomProduit = (id) => produits.find((p) => p.id === id)?.nom ?? 'Produit'
  const nomParcelle = (id) => {
    const p = parcelles.find((x) => x.id === id)
    return p ? `Parcelle ${p.surface_m2} m²` : 'Parcelle'
  }

  const rp = donnees.reservations_produits
  const rpar = donnees.reservations_parcelles

  return (
    <section>
      <h2>Réservations reçues</h2>

      {rp.length === 0 && rpar.length === 0 ? (
        <p>Aucune réservation reçue.</p>
      ) : (
        <ul className="liste-resa">
          {rp.map((r) => (
            <LigneResa
              key={r.id}
              type="produits"
              resa={r}
              libelle={nomProduit(r.produit_id)}
              complement={` — ${r.quantite} unité(s)`}
              onChangement={onChangement}
            />
          ))}
          {rpar.map((r) => (
            <LigneResa
              key={r.id}
              type="parcelles"
              resa={r}
              libelle={nomParcelle(r.parcelle_id)}
              complement={
                (r.date_debut ? ` — dès le ${r.date_debut}` : '') +
                (r.culture_demandee ? ` · ${r.culture_demandee}` : '')
              }
              onChangement={onChangement}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
