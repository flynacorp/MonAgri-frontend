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

// Lieu de retrait : où et quand les clients viennent chercher leur commande (ou
// retrouver leur parcelle). La commune et les horaires sont visibles de tous ;
// l'adresse exacte n'est donnée au client qu'une fois sa réservation confirmée.
// Sans commune ni adresse, l'agriculteur ne peut pas confirmer de réservation.
function LieuRetraitAgriculteur() {
  const { profil, majProfil } = useAuth()
  const [ville, setVille] = useState(profil.retrait_ville ?? '')
  const [horaires, setHoraires] = useState(profil.retrait_horaires ?? '')
  const [adresse, setAdresse] = useState(profil.retrait_adresse ?? '')
  const [enCours, setEnCours] = useState(false)
  const [message, setMessage] = useState(null)
  const [erreur, setErreur] = useState(null)

  const renseigne = Boolean(profil.retrait_ville && profil.retrait_adresse)

  async function enregistrer(e) {
    e.preventDefault()
    setEnCours(true)
    setMessage(null)
    setErreur(null)
    try {
      await majProfil({
        retrait_ville: ville.trim() || null,
        retrait_horaires: horaires.trim() || null,
        retrait_adresse: adresse.trim() || null,
      })
      setMessage('Lieu de retrait enregistré ✓')
    } catch (err) {
      setErreur(err.message)
    } finally {
      setEnCours(false)
    }
  }

  return (
    <section className="lieu-retrait">
      <h2>Lieu de retrait</h2>
      {!renseigne && (
        <p className="attention">
          À renseigner avant de pouvoir confirmer une réservation : tes clients doivent savoir où
          venir.
        </p>
      )}
      <form onSubmit={enregistrer}>
        <label>
          Commune
          <input
            value={ville}
            onChange={(e) => setVille(e.target.value)}
            placeholder="Ex. Foix"
            maxLength={100}
            required
          />
        </label>
        <label>
          Jours et horaires de retrait
          <input
            value={horaires}
            onChange={(e) => setHoraires(e.target.value)}
            placeholder="Ex. vendredi 17h–19h, samedi matin"
            maxLength={300}
          />
        </label>
        <label>
          Adresse exacte et consignes
          <textarea
            rows={3}
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            placeholder="Ex. Ferme du Vallon, route de Pamiers. Sonner au portail vert."
            maxLength={500}
            required
          />
        </label>
        <p className="detail">
          La commune et les horaires sont visibles de tous. L'adresse exacte n'est donnée au client
          qu'une fois sa réservation confirmée.
        </p>
        {message && <p className="succes">{message}</p>}
        {erreur && <p className="erreur">{erreur}</p>}
        <button type="submit" disabled={enCours}>
          {enCours ? '…' : 'Enregistrer'}
        </button>
      </form>
    </section>
  )
}

// Configuration des paiements en ligne (Stripe Connect). Le statut est lu en
// direct auprès de Stripe via l'API ; le bouton envoie l'agriculteur sur la
// page d'inscription hébergée par Stripe, qui le ramène ici ensuite.
function PaiementsAgriculteur() {
  const [statut, setStatut] = useState(null) // { configure, pret }
  const [erreur, setErreur] = useState(null)
  const [enCours, setEnCours] = useState(false)

  useEffect(() => {
    api('/stripe/statut')
      .then(setStatut)
      .catch((e) => setErreur(e.message))
  }, [])

  async function configurer() {
    setEnCours(true)
    setErreur(null)
    try {
      const { url } = await api('/stripe/onboarding', { method: 'POST' })
      window.location.href = url
    } catch (e) {
      setErreur(e.message)
      setEnCours(false)
    }
  }

  return (
    <section className="paiements-agri">
      <h2>Paiements en ligne</h2>
      {!statut && !erreur && <p className="detail">Vérification…</p>}

      {statut?.pret && (
        <p className="succes">Paiements activés ✓ — tu recevras l'argent des réservations confirmées.</p>
      )}

      {statut && !statut.pret && (
        <>
          <p>
            {statut.configure
              ? "Ta configuration n'est pas terminée : Stripe attend encore des informations de ta part."
              : 'Pour recevoir le paiement de tes ventes en ligne, configure ton compte de paiement (quelques minutes, hébergé par Stripe).'}
          </p>
          <button onClick={configurer} disabled={enCours}>
            {enCours ? '…' : statut.configure ? 'Reprendre la configuration' : 'Configurer les paiements'}
          </button>
        </>
      )}

      {erreur && <p className="erreur">{erreur}</p>}
    </section>
  )
}

export default function EspaceAgriculteur() {
  const {
    utilisateur,
    estAgriculteur,
    demandeAgriculteurEnAttente,
    profilIndisponible,
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

  if (profilIndisponible) {
    return (
      <section>
        <h1>Espace agriculteur</h1>
        <p className="erreur">Impossible de charger ton profil pour le moment.</p>
        <button onClick={() => window.location.reload()}>Réessayer</button>
      </section>
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
      <LieuRetraitAgriculteur />
      <PaiementsAgriculteur />
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
