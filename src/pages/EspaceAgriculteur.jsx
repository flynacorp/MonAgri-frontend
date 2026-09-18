import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { api } from '../lib/api'
import GestionProduits from '../components/GestionProduits'
import GestionParcelles from '../components/GestionParcelles'
import ReservationsRecues from '../components/ReservationsRecues'

// Formulaire de candidature : le SIRET est vérifié côté serveur auprès de
// l'API SIRENE, puis le compte passe en « agriculteur_attente » jusqu'à
// validation manuelle (voir README pour la marche à suivre).
function FormDevenirAgriculteur() {
  const { devenirAgriculteur } = useAuth()
  const [siret, setSiret] = useState('')
  const [enCours, setEnCours] = useState(false)
  const [erreur, setErreur] = useState(null)

  async function soumettre(e) {
    e.preventDefault()
    setEnCours(true)
    setErreur(null)
    try {
      await devenirAgriculteur(siret.replace(/\s/g, ''))
    } catch (e) {
      setErreur(e.message)
    } finally {
      setEnCours(false)
    }
  }

  return (
    <form className="candidature-agri" onSubmit={soumettre}>
      <label>
        N° SIRET de ton exploitation
        <input
          value={siret}
          onChange={(e) => setSiret(e.target.value)}
          placeholder="14 chiffres"
          inputMode="numeric"
          required
        />
      </label>
      <p className="detail">
        On vérifie ton SIRET auprès du registre officiel des entreprises, puis
        on valide ta candidature avant que ton compte devienne visible.
      </p>
      {erreur && <p className="erreur">{erreur}</p>}
      <button type="submit" disabled={enCours}>
        {enCours ? '…' : 'Envoyer ma candidature'}
      </button>
    </form>
  )
}

export default function EspaceAgriculteur() {
  const {
    utilisateur,
    estAgriculteur,
    demandeAgriculteurEnAttente,
    chargement: chargementAuth,
  } = useAuth()

  const [produits, setProduits] = useState([])
  const [parcelles, setParcelles] = useState([])
  const [resaRecues, setResaRecues] = useState({
    reservations_produits: [],
    reservations_parcelles: [],
  })
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState(null)

  const charger = useCallback(async () => {
    if (!estAgriculteur) return
    setErreur(null)
    try {
      const [mp, mpa, rr] = await Promise.all([
        api('/mes-produits'),
        api('/mes-parcelles'),
        api('/reservations-recues'),
      ])
      setProduits(mp)
      setParcelles(mpa)
      setResaRecues(rr)
    } catch (e) {
      setErreur(e.message)
    } finally {
      setChargement(false)
    }
  }, [estAgriculteur])

  useEffect(() => {
    charger()
  }, [charger])

  if (chargementAuth) return <p>Chargement…</p>

  if (!utilisateur) {
    return (
      <p>
        <Link to="/connexion">Connecte-toi</Link> pour accéder à ton espace.
      </p>
    )
  }

  if (demandeAgriculteurEnAttente) {
    return (
      <section>
        <h1>Espace agriculteur</h1>
        <p>
          Ta candidature est en cours d'examen. On te recontacte dès qu'elle
          est validée — ton compte n'est pas encore visible des clients.
        </p>
      </section>
    )
  }

  if (!estAgriculteur) {
    return (
      <section>
        <h1>Espace agriculteur</h1>
        <p>Deviens agriculteur pour proposer tes produits et tes parcelles.</p>
        <FormDevenirAgriculteur />
      </section>
    )
  }

  if (chargement) return <p>Chargement…</p>

  return (
    <div className="espace-agri">
      <h1>Espace agriculteur</h1>
      {erreur && <p className="erreur">{erreur}</p>}
      <GestionProduits produits={produits} onChangement={charger} />
      <GestionParcelles parcelles={parcelles} onChangement={charger} />
      <ReservationsRecues
        donnees={resaRecues}
        produits={produits}
        parcelles={parcelles}
        onChangement={charger}
      />
    </div>
  )
}
