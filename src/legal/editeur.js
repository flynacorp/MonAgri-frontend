// Informations légales de l'éditeur du site. À COMPLÉTER AVANT D'INVITER DE
// VRAIS UTILISATEURS : ces valeurs alimentent les mentions légales, la politique
// de confidentialité et les conditions d'utilisation.
//
// Tant qu'une valeur commence par « [à compléter », elle s'affiche en jaune sur
// les pages et un bandeau « page provisoire » apparaît en haut. Remplace le
// texte entre crochets (crochets compris) par la vraie information.

export const EDITEUR = {
  // Nom ou raison sociale de la structure qui porte MonAgri
  nom: '[à compléter : raison sociale ou nom]',
  // Forme juridique (SARL, SAS, micro-entreprise…)
  forme: '[à compléter : forme juridique]',
  siret: '[à compléter : SIRET]',
  adresse: '[à compléter : adresse du siège]',
  // Adresse e-mail pour toute question, demande sur les données ou signalement
  contact: '[à compléter : adresse e-mail de contact]',
  directeur: '[à compléter : directeur de la publication]',
  // Médiateur de la consommation proposé aux clients (obligatoire pour un
  // professionnel qui vend à des consommateurs) : à choisir avec le comptable
  mediateur: '[à compléter : médiateur de la consommation]',
  // Région du projet Supabase (visible dans Supabase → Project Settings)
  regionBase: '[à compléter : région du projet Supabase]',
}

export const estACompleter = (valeur) => valeur.startsWith('[à compléter')

export const infosIncompletes = () => Object.values(EDITEUR).some(estACompleter)
