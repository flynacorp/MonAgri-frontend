// Affiche une note en étoiles. Avec `onChange`, devient un sélecteur cliquable.
export default function Etoiles({ note = 0, onChange }) {
  const valeur = Math.round(note)

  if (!onChange) {
    return (
      <span className="etoiles" aria-label={`${note} sur 5`}>
        {'★'.repeat(valeur)}
        {'☆'.repeat(5 - valeur)}
      </span>
    )
  }

  return (
    <span className="etoiles etoiles-choix">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
          onClick={() => onChange(n)}
        >
          {n <= valeur ? '★' : '☆'}
        </button>
      ))}
    </span>
  )
}
