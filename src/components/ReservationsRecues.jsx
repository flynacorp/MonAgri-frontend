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

  async function patch(corps) {
    setErreur(null)
    setEnCours(true)
    try {
      await api(`/reservations-${type}/${resa.id}`, { method: 'PATCH', body: corps })
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
        {resa.prix != null && ` · ${Number(resa.prix).toFixed(2)} €`}
      </span>

      {resa.statut === 'en_attente' ? (
        <span className="actions">
          <button type="button" disabled={enCours} onClick={() => patch({ statut: 'confirmee' })}>
            Accepter
          </button>
          <button
            type="button"
            className="lien danger"
            disabled={enCours}
            onClick={() => patch({ statut: 'annulee' })}
          >
            Refuser
          </button>
        </span>
      ) : (
        <span className="actions">
          <span className={`badge badge-${resa.statut}`}>
            {LIBELLE_STATUT[resa.statut] ?? resa.statut}
          </span>
          {resa.statut === 'confirmee' && (
            <button
              type="button"
              className="lien"
              disabled={enCours}
              onClick={() => patch({ paye: !resa.paye })}
            >
              {resa.paye ? 'Marquer non payé' : 'Marquer payé'}
            </button>
          )}
        </span>
      )}

      {type === 'parcelles' && resa.statut === 'confirmee' && (
        <label className="recolte">
          Récolte prévue
          <input
            type="date"
            defaultValue={resa.date_recolte ?? ''}
            onBlur={(e) => {
              const v = e.target.value || null
              if (v !== (resa.date_recolte ?? null)) patch({ date_recolte: v })
            }}
          />
        </label>
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
                (r.surface_reservee ? ` — ${r.surface_reservee} m²` : '') +
                (r.culture_demandee ? ` · ${r.culture_demandee}` : '') +
                (r.date_debut ? ` · dès le ${r.date_debut}` : '')
              }
              onChangement={onChangement}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
