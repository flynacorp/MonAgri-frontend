import { useState } from 'react'
import { supabase } from '../supabase'

const BUCKET = 'photos'

// Envoie une image vers Supabase Storage puis passe son URL publique à onUpload
// (qui doit l'enregistrer côté API). onUpload(null) = retirer la photo.
export default function UploadPhoto({ dossier, urlActuelle, onUpload }) {
  const [enCours, setEnCours] = useState(false)
  const [erreur, setErreur] = useState(null)

  async function choisir(e) {
    const fichier = e.target.files?.[0]
    e.target.value = '' // permet de re-choisir le même fichier plus tard
    if (!fichier) return

    setErreur(null)
    setEnCours(true)
    try {
      const ext = fichier.name.split('.').pop()?.toLowerCase() || 'jpg'
      const chemin = `${dossier}/${Date.now()}.${ext}`
      const envoi = await supabase.storage.from(BUCKET).upload(chemin, fichier)
      if (envoi.error) throw new Error(envoi.error.message)

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(chemin)
      await onUpload(data.publicUrl)
    } catch (err) {
      setErreur(err.message)
    } finally {
      setEnCours(false)
    }
  }

  return (
    <div className="upload-photo">
      {urlActuelle && <img src={urlActuelle} alt="" className="miniature" />}
      <label className="lien">
        {enCours ? 'Envoi…' : urlActuelle ? 'Changer la photo' : 'Ajouter une photo'}
        <input type="file" accept="image/*" hidden onChange={choisir} disabled={enCours} />
      </label>
      {urlActuelle && !enCours && (
        <button type="button" className="lien danger" onClick={() => onUpload(null)}>
          Retirer
        </button>
      )}
      {erreur && <p className="erreur">{erreur}</p>}
    </div>
  )
}
