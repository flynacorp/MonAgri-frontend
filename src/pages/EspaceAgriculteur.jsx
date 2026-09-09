import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { api } from '../lib/api'
import GestionProduits from '../components/GestionProduits'
import GestionParcelles from '../components/GestionParcelles'
import ReservationsRecues from '../components/ReservationsRecues'

function BoutonDevenirAgriculteur() {
  const { devenirAgriculteur } = useAuth()
  const [enCours, setEnCours] = useState(false)
  const [erreur, setErreur] = useState(null)

  async function clic() {
    setEnCours(true)
    setErreur(null)
    try {
      await devenirAgriculteur()
    } catch (e) {
      setErreur(e.message)
    } finally {
      setEnCours(false)
    }
  }

  return (
    <>
      <button onClick={clic} disabled={enCours}>
        {enCours ? '…' : 'Devenir agriculteur'}
      </button>
      {erreur && <p className="erreur">{erreur}</p>}
    </>
  )
}

export default function EspaceAgriculteur() {
  const { utilisateur, estAgriculteur, chargement: chargementAuth } = useAuth()

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

  if (!estAgriculteur) {
    return (
      <section>
        <h1>Espace agriculteur</h1>
        <p>Deviens agriculteur pour proposer tes produits et tes parcelles.</p>
        <BoutonDevenirAgriculteur />
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
