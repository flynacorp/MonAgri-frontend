// Catalogue des produits de référence (nom, catégorie, unité usuelle).
// Chargé une seule fois par visite : il change très rarement.

import { api } from './api'

// Liste des unités de vente acceptées par l'API (la même côté serveur).
export const UNITES = ['kg', 'pièce', 'botte', 'barquette', 'douzaine', 'litre', 'pot', 'sachet']

let promesse = null

export function chargerCatalogue() {
  if (!promesse) {
    promesse = api('/catalogue').catch((erreur) => {
      promesse = null // on réessaiera à la prochaine ouverture du formulaire
      throw erreur
    })
  }
  return promesse
}

// Le produit du catalogue dont le nom correspond (sans tenir compte de la casse).
export function trouverReference(catalogue, nom) {
  const cherche = nom.trim().toLowerCase()
  if (!cherche) return undefined
  return catalogue.find((c) => c.nom.toLowerCase() === cherche)
}
