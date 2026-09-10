import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import UploadPhoto from '../components/UploadPhoto'

export default function MonProfil() {
  const { utilisateur, profil, estAgriculteur, majProfil, chargement } = useAuth()

  const [form, setForm] = useState(null)
  const [message, setMessage] = useState(null)
  const [erreur, setErreur] = useState(null)
  const [enCours, setEnCours] = useState(false)

  // Initialise le formulaire une fois le profil chargé (pattern React « ajuster
  // un état quand une prop change », sans useEffect).
  if (profil && form === null) {
    setForm({
      nom: profil.nom ?? '',
      nom_ferme: profil.nom_ferme ?? '',
      bio: profil.bio ?? '',
      region: profil.region ?? '',
    })
  }

  if (chargement) return <p>Chargement…</p>
  if (!utilisateur) {
    return (
      <p>
        <Link to="/connexion">Connecte-toi</Link> pour voir ton profil.
      </p>
    )
  }
  if (!form) return <p>Chargement…</p>

  const set = (champ) => (e) => setForm({ ...form, [champ]: e.target.value })

  async function enregistrer(e) {
    e.preventDefault()
    setMessage(null)
    setErreur(null)
    setEnCours(true)
    try {
      const champs = { nom: form.nom.trim(), region: form.region.trim() || null }
      if (estAgriculteur) {
        champs.nom_ferme = form.nom_ferme.trim() || null
        champs.bio = form.bio.trim() || null
      }
      await majProfil(champs)
      setMessage('Profil enregistré ✓')
    } catch (err) {
      setErreur(err.message)
    } finally {
      setEnCours(false)
    }
  }

  return (
    <section className="mon-profil">
      <h1>Mon profil</h1>

      {estAgriculteur && (
        <p>
          <Link to={`/agriculteurs/${utilisateur.id}`}>Voir ma fiche publique →</Link>
        </p>
      )}

      <form onSubmit={enregistrer}>
        <label>
          Nom affiché
          <input value={form.nom} onChange={set('nom')} required />
        </label>

        {estAgriculteur && (
          <>
            <label>
              Nom de la ferme
              <input value={form.nom_ferme} onChange={set('nom_ferme')} />
            </label>
            <label>
              Présentation
              <textarea rows={4} value={form.bio} onChange={set('bio')} />
            </label>
          </>
        )}

        <label>
          Région
          <input value={form.region} onChange={set('region')} />
        </label>

        {message && <p className="succes">{message}</p>}
        {erreur && <p className="erreur">{erreur}</p>}

        <button type="submit" disabled={enCours}>
          {enCours ? '…' : 'Enregistrer'}
        </button>
      </form>

      {estAgriculteur && (
        <div className="photo-profil">
          <h2>Photo</h2>
          <UploadPhoto
            dossier={`profils/${utilisateur.id}`}
            urlActuelle={profil?.photo_url}
            onUpload={(url) => majProfil({ photo_url: url })}
          />
        </div>
      )}
    </section>
  )
}
