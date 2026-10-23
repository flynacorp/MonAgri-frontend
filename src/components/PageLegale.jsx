import { estACompleter, infosIncompletes } from '../legal/editeur'

// Une information de l'éditeur ; en jaune tant qu'elle reste à compléter.
export function Valeur({ v }) {
  return estACompleter(v) ? <mark className="a-completer">{v}</mark> : <>{v}</>
}

// Cadre commun des pages légales (titre, date, bandeau « provisoire »).
export default function PageLegale({ titre, misAJour, children }) {
  return (
    <section className="page-legale">
      <h1>{titre}</h1>
      {infosIncompletes() && (
        <p className="attention">
          Page provisoire : certaines informations de l'éditeur restent à compléter (en jaune).
        </p>
      )}
      <p className="detail">Dernière mise à jour : {misAJour}</p>
      {children}
    </section>
  )
}
