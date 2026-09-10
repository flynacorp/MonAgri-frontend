import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { api } from '../lib/api'

const LIBELLE_STATUT = {
  en_attente: 'En attente',
  confirmee: 'Confirmée',
  annulee: 'Annulée',
}

function LigneMaResa({ type, resa, libelle, complement, onChangement }) {
  const [erreur, setErreur] = useState(null)
  const [enCours, setEnCours] = useState(false)

  async function annuler() {
    setErreur(null)
    setEnCours(true)
    try {
      await api(`/reservations-${type}/${resa.id}/annuler`, { method: 'POST' })
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
        {resa.date_recolte && ` · récolte le ${resa.date_recolte}`}
      </span>

      <span className="actions">
        {resa.statut === 'confirmee' && (
          <span className={`badge ${resa.paye ? 'badge-confirmee' : 'badge-en_attente'}`}>
            {resa.paye ? 'payé' : 'à payer'}
          </span>
        )}
        <span className={`badge badge-${resa.statut}`}>
          {LIBELLE_STATUT[resa.statut] ?? resa.statut}
        </span>
        {resa.statut === 'en_attente' && (
          <button type="button" className="lien danger" disabled={enCours} onClick={annuler}>
            Annuler
          </button>
        )}
      </span>

      {resa.photo_culture_url && (
        <img src={resa.photo_culture_url} alt="Culture en cours" className="miniature" />
      )}

      {erreur && <p className="erreur">{erreur}</p>}
    </li>
  )
}

export default function MesReservations() {
  const { utilisateur, chargement: chargementAuth } = useAuth()

  const [reservations, setReservations] = useState(null)
  const [produits, setProduits] = useState([])
  const [parcelles, setParcelles] = useState([])
  const [erreur, setErreur] = useState(null)
  const [chargement, setChargement] = useState(true)

  const charger = useCallback(() => {
    if (!utilisateur) return
    return Promise.all([api('/mes-reservations'), api('/produits'), api('/parcelles')])
      .then(([resa, prod, parc]) => {
        setReservations(resa)
        setProduits(prod)
        setParcelles(parc)
      })
      .catch((e) => setErreur(e.message))
      .finally(() => setChargement(false))
  }, [utilisateur])

  useEffect(() => {
    charger()
  }, [charger])

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
            <LigneMaResa
              key={r.id}
              type="produits"
              resa={r}
              libelle={nomProduit(r.produit_id)}
              complement={` — ${r.quantite} unité(s)`}
              onChangement={charger}
            />
          ))}
        </ul>
      )}

      <h2>Parcelles</h2>
      {rpar.length === 0 ? (
        <p>Aucune réservation de parcelle.</p>
      ) : (
        <ul className="liste-resa">
          {rpar.map((r) => (
            <LigneMaResa
              key={r.id}
              type="parcelles"
              resa={r}
              libelle={nomParcelle(r.parcelle_id)}
              complement={
                (r.surface_reservee ? ` — ${r.surface_reservee} m²` : '') +
                (r.culture_demandee ? ` · ${r.culture_demandee}` : '') +
                (r.date_debut ? ` · dès le ${r.date_debut}` : '')
              }
              onChangement={charger}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
