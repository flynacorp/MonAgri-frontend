import { useState } from 'react'
import { api } from '../lib/api'

export default function GestionParcelles({ parcelles, onChangement }) {
  const [surface, setSurface] = useState('')
  const [typeSol, setTypeSol] = useState('')
  const [region, setRegion] = useState('')
  const [erreur, setErreur] = useState(null)
  const [enCours, setEnCours] = useState(false)

  async function ajouter(e) {
    e.preventDefault()
    setErreur(null)
    setEnCours(true)
    try {
      await api('/parcelles', {
        method: 'POST',
        body: {
          surface_m2: Number(surface),
          type_sol: typeSol || undefined,
          region: region || undefined,
        },
      })
      setSurface('')
      setTypeSol('')
      setRegion('')
      onChangement()
    } catch (err) {
      setErreur(err.message)
    } finally {
      setEnCours(false)
    }
  }

  async function retirer(id) {
    setErreur(null)
    try {
      await api(`/parcelles/${id}`, { method: 'DELETE' })
      onChangement()
    } catch (err) {
      setErreur(err.message)
    }
  }

  return (
    <section>
      <h2>Mes parcelles</h2>

      <form className="form-annonce" onSubmit={ajouter}>
        <input
          type="number"
          min="1"
          placeholder="Surface (m²)"
          value={surface}
          onChange={(e) => setSurface(e.target.value)}
          required
        />
        <input
          placeholder="Type de sol (optionnel)"
          value={typeSol}
          onChange={(e) => setTypeSol(e.target.value)}
        />
        <input
          placeholder="Région (optionnel)"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        />
        <button disabled={enCours}>{enCours ? '…' : 'Ajouter'}</button>
      </form>

      {erreur && <p className="erreur">{erreur}</p>}

      {parcelles.length === 0 ? (
        <p>Aucune parcelle en location.</p>
      ) : (
        <ul className="liste-resa">
          {parcelles.map((p) => (
            <li key={p.id}>
              <strong>{p.surface_m2} m²</strong>
              {p.type_sol ? ` · sol ${p.type_sol}` : ''}
              {p.region ? ` · ${p.region}` : ''} · {p.statut}
              <button type="button" className="lien danger" onClick={() => retirer(p.id)}>
                Retirer
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
