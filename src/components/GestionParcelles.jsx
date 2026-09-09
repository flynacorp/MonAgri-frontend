import { useState } from 'react'
import { api } from '../lib/api'

const STATUTS = ['disponible', 'reservee']

// "maraîchage, céréales" <-> ['maraîchage', 'céréales']
const enListe = (texte) =>
  texte
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean)

function LigneParcelle({ parcelle, onChangement }) {
  const [edition, setEdition] = useState(false)
  const [surface, setSurface] = useState(parcelle.surface_m2)
  const [typeSol, setTypeSol] = useState(parcelle.type_sol ?? '')
  const [region, setRegion] = useState(parcelle.region ?? '')
  const [statut, setStatut] = useState(parcelle.statut)
  const [cultures, setCultures] = useState((parcelle.cultures_autorisees ?? []).join(', '))
  const [maxParClient, setMaxParClient] = useState(parcelle.max_m2_par_client ?? '')
  const [erreur, setErreur] = useState(null)
  const [enCours, setEnCours] = useState(false)

  function ouvrirEdition() {
    setSurface(parcelle.surface_m2)
    setTypeSol(parcelle.type_sol ?? '')
    setRegion(parcelle.region ?? '')
    setStatut(parcelle.statut)
    setCultures((parcelle.cultures_autorisees ?? []).join(', '))
    setMaxParClient(parcelle.max_m2_par_client ?? '')
    setErreur(null)
    setEdition(true)
  }

  async function enregistrer(e) {
    e.preventDefault()
    setErreur(null)
    setEnCours(true)
    try {
      await api(`/parcelles/${parcelle.id}`, {
        method: 'PATCH',
        body: {
          surface_m2: Number(surface),
          type_sol: typeSol.trim() || null,
          region: region.trim() || null,
          statut,
          cultures_autorisees: enListe(cultures),
          max_m2_par_client: maxParClient === '' ? null : Number(maxParClient),
        },
      })
      setEdition(false)
      onChangement()
    } catch (err) {
      setErreur(err.message)
    } finally {
      setEnCours(false)
    }
  }

  async function retirer() {
    setErreur(null)
    try {
      await api(`/parcelles/${parcelle.id}`, { method: 'DELETE' })
      onChangement()
    } catch (err) {
      setErreur(err.message)
    }
  }

  if (!edition) {
    return (
      <li>
        <span>
          <strong>{parcelle.surface_m2} m²</strong>{' '}
          <span className="detail">
            ({parcelle.surface_restante ?? parcelle.surface_m2} m² dispo)
          </span>
          {parcelle.type_sol ? ` · sol ${parcelle.type_sol}` : ''}
          {parcelle.region ? ` · ${parcelle.region}` : ''} · {parcelle.statut}
          {(parcelle.cultures_autorisees ?? []).length > 0 && (
            <span className="detail"> · {parcelle.cultures_autorisees.join(', ')}</span>
          )}
        </span>
        <span className="actions">
          <button type="button" className="lien" onClick={ouvrirEdition}>
            Modifier
          </button>
          <button type="button" className="lien danger" onClick={retirer}>
            Retirer
          </button>
        </span>
        {erreur && <p className="erreur">{erreur}</p>}
      </li>
    )
  }

  return (
    <li>
      <form className="form-annonce" onSubmit={enregistrer}>
        <input
          type="number"
          min="1"
          value={surface}
          onChange={(e) => setSurface(e.target.value)}
          required
        />
        <input
          placeholder="Type de sol"
          value={typeSol}
          onChange={(e) => setTypeSol(e.target.value)}
        />
        <input
          placeholder="Région"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        />
        <input
          placeholder="Cultures (séparées par des virgules)"
          value={cultures}
          onChange={(e) => setCultures(e.target.value)}
          required
        />
        <input
          type="number"
          min="1"
          placeholder="Max m²/client"
          value={maxParClient}
          onChange={(e) => setMaxParClient(e.target.value)}
        />
        <select value={statut} onChange={(e) => setStatut(e.target.value)}>
          {STATUTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button disabled={enCours}>{enCours ? '…' : 'Enregistrer'}</button>
        <button type="button" className="lien" onClick={() => setEdition(false)}>
          Annuler
        </button>
      </form>
      {erreur && <p className="erreur">{erreur}</p>}
    </li>
  )
}

export default function GestionParcelles({ parcelles, onChangement }) {
  const [surface, setSurface] = useState('')
  const [typeSol, setTypeSol] = useState('')
  const [region, setRegion] = useState('')
  const [cultures, setCultures] = useState('')
  const [maxParClient, setMaxParClient] = useState('')
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
          type_sol: typeSol.trim() || undefined,
          region: region.trim() || undefined,
          cultures_autorisees: enListe(cultures),
          max_m2_par_client: maxParClient === '' ? undefined : Number(maxParClient),
        },
      })
      setSurface('')
      setTypeSol('')
      setRegion('')
      setCultures('')
      setMaxParClient('')
      onChangement()
    } catch (err) {
      setErreur(err.message)
    } finally {
      setEnCours(false)
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
          placeholder="Cultures autorisées (virgules)"
          value={cultures}
          onChange={(e) => setCultures(e.target.value)}
          required
        />
        <input
          type="number"
          min="1"
          placeholder="Max m²/client (option.)"
          value={maxParClient}
          onChange={(e) => setMaxParClient(e.target.value)}
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
            <LigneParcelle key={p.id} parcelle={p} onChangement={onChangement} />
          ))}
        </ul>
      )}
    </section>
  )
}
