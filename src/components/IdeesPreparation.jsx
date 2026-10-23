// Affichage des idées de préparation (recettes) proposées par les agriculteurs.
// Chaque idée se déplie pour montrer ses ingrédients et sa préparation.

function Idee({ recette, montrerProduit }) {
  return (
    <details className="idee">
      <summary>
        {recette.titre}
        {montrerProduit && recette.produit_nom && (
          <span className="detail"> · {recette.produit_nom}</span>
        )}
      </summary>
      {recette.photo_url && <img src={recette.photo_url} alt="" className="idee-photo" />}
      {recette.ingredients && (
        <>
          <h4>Ingrédients</h4>
          <p className="idee-texte">{recette.ingredients}</p>
        </>
      )}
      <h4>Préparation</h4>
      <p className="idee-texte">{recette.preparation}</p>
    </details>
  )
}

// La liste des idées, chacune dépliable.
export function ListeIdees({ recettes, montrerProduit = false }) {
  return (
    <div className="idees">
      {recettes.map((r) => (
        <Idee key={r.id} recette={r} montrerProduit={montrerProduit} />
      ))}
    </div>
  )
}

// Encart repliable « Idées de préparation (n) » pour la carte d'un produit.
// N'affiche rien s'il n'y a pas d'idée pour ce produit.
export default function IdeesPreparation({ recettes }) {
  if (!recettes?.length) return null
  return (
    <details className="encart-idees">
      <summary>Idées de préparation ({recettes.length})</summary>
      <ListeIdees recettes={recettes} />
    </details>
  )
}
