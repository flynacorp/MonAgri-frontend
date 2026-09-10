// Affiche une note en étoiles. Avec `onChange`, devient un sélecteur cliquable.

function Etoile({ pleine }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill={pleine ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="m12 3 2.6 5.6 6 .8-4.4 4.2 1.1 6L12 17.8 6.7 19.6l1.1-6L3.4 9.4l6-.8Z" />
    </svg>
  )
}

export default function Etoiles({ note = 0, onChange }) {
  const valeur = Math.round(note)

  if (!onChange) {
    return (
      <span className="etoiles" aria-label={`${note} sur 5`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Etoile key={n} pleine={n <= valeur} />
        ))}
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
          <Etoile pleine={n <= valeur} />
        </button>
      ))}
    </span>
  )
}
