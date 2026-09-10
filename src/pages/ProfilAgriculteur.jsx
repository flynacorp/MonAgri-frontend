import { useCallback, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../lib/api'
import CarteProduit from '../components/CarteProduit'
import CarteParcelle from '../components/CarteParcelle'
import Etoiles from '../components/Etoiles'
import AvisAgriculteur from '../components/AvisAgriculteur'

export default function ProfilAgriculteur() {
  const { id } = useParams()
  const [fiche, setFiche] = useState(null)
  const [erreur, setErreur] = useState(null)
  const [chargement, setChargement] = useState(true)

  const charger = useCallback(() => {
    return api(`/agriculteurs/${id}`)
      .then(setFiche)
      .catch((e) => setErreur(e.message))
      .finally(() => setChargement(false))
  }, [id])

  useEffect(() => {
    charger()
  }, [charger])

  if (chargement) return <p>Chargement…</p>
  if (erreur) return <p className="erreur">{erreur}</p>

  const { profil, produits, parcelles, peut_noter } = fiche

  return (
    <section className="fiche-agri">
      <p>
        <Link to="/">← Retour</Link>
      </p>

      <header className="fiche-entete">
        {profil.photo_url && <img src={profil.photo_url} alt="" className="fiche-photo" />}
        <div>
          <h1>{profil.nom_ferme || profil.nom}</h1>
          {profil.nom_ferme && <p className="detail">par {profil.nom}</p>}
          {profil.region && <p className="detail">{profil.region}</p>}
          {profil.nombre_avis > 0 && (
            <p className="detail">
              <Etoiles note={Number(profil.note_moyenne)} /> {Number(profil.note_moyenne)} ·{' '}
              {profil.nombre_avis} avis
            </p>
          )}
        </div>
      </header>

      {profil.bio && <p className="fiche-bio">{profil.bio}</p>}

      <h2>Ses produits</h2>
      {produits.length === 0 ? (
        <p>Aucun produit en vente.</p>
      ) : (
        <ul className="cartes">
          {produits.map((p) => (
            <CarteProduit key={p.id} produit={p} />
          ))}
        </ul>
      )}

      <h2>Ses parcelles</h2>
      {parcelles.length === 0 ? (
        <p>Aucune parcelle en location.</p>
      ) : (
        <ul className="cartes">
          {parcelles.map((p) => (
            <CarteParcelle key={p.id} parcelle={p} />
          ))}
        </ul>
      )}

      <AvisAgriculteur agriculteurId={id} peutNoter={peut_noter} onChangement={charger} />
    </section>
  )
}
